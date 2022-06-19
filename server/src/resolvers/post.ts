import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { Comment } from "../entity/Comment";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { ILike, In } from "typeorm";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import Upload from "graphql-upload/Upload.js";
import { v4 } from "uuid";

import * as OneSignal from "@onesignal/node-onesignal";
import { Updoot } from "../entity/Updoot";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
  @Field()
  type: string;
  @Field()
  topics: string[];
}

@ObjectType()
class FieldError2 {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [FieldError2], { nullable: true })
  errors?: FieldError2[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
class SearchResponse {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => [User], { nullable: true })
  users?: User[];
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(@Root() post: Post, @Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const updoots = await Updoot.createQueryBuilder()
      .where({
        postId: post.id,
        userId: req.session.userId,
      })
      .getMany();

    // console.log(updoots);

    if (updoots.length == 0) {
      return null;
    }
    let value = 0;

    updoots.map((updoot) => {
      value += updoot.value;
    });

    // console.log(value);
    return value;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req, data }: MyContext
  ): Promise<Post | null> {
    //const isUpdoot = value !== -1;
    let hating = false;
    if (value < 0) {
      hating = true;
    }
    const realValue = Math.abs(value);
    const { userId } = req.session;

    const post = await Post.findOneBy({ id: postId });

    //const updoot = await Updoot.findOne({ where: { postId, userId } });
    if (!post) return null;
    if (post.locked) return post;

    if (post.creatorId == userId) return post;
    // console.log(post.creatorId)
    // console.log(userId)
    const userDoing = await User.findOneBy({ id: userId });
    // const userReciving = await User.findOneBy({ id: post.creatorId });
    if (!userDoing) return null;
    // if (!userReciving) return post;

    if (userDoing.credits < realValue) {
      return post;
    }

    await data
      .getRepository(Updoot)
      .insert({ postId: postId, userId: userId, value: value });

    userDoing.credits -= realValue;
    await User.update({ id: userDoing.id }, { credits: userDoing.credits });

    if (!hating) {
      post.upvotes += value;

      post.ratio = (post.upvotes + 1) / (-post.downvotes + post.upvotes + 1);
      await Post.update(
        { id: postId },
        { upvotes: post.upvotes, ratio: post.ratio }
      );

      // userReciving.credits += realValue;

      // await User.update(
      //   { id: userReciving.id },
      //   { credits: userReciving.credits }
      // );
    } else {
      post.downvotes += value;

      post.ratio = (post.upvotes + 1) / (-post.downvotes + post.upvotes + 1);
      await Post.update(
        { id: postId },
        { downvotes: post.downvotes, ratio: post.ratio }
      );

      //   if (userReciving.haters.length > 0) {
      //     let otherHaters = userReciving.haters;
      //     let index = -1;
      //     for (let i = 0; i < otherHaters.length; i++) {
      //       if (otherHaters[i] == userId) {
      //         index = i;
      //       }
      //     }
      //     otherHaters.splice(index, 1);

      // if (otherHaters.length > 0) {
      //   let x = realValue / userReciving.haters.length;

      //   // console.log(x)
      //   // console.log(userReciving.haters)
      //   await data
      //     .createQueryBuilder()
      //     .update(User)
      //     .where("id IN(:...ids)", { ids: otherHaters })
      //     .set({ credits: () => `credits + ${x}` })
      //     .returning("*")
      //     .execute();

      //   // console.log(haters.raw[0])
      // }
    }

    return post;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Ctx() { data }: MyContext,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Arg("users", () => [String], { nullable: true }) users: string[] | null,
    @Arg("userids", () => [Int], { nullable: true }) userids: number[] | null,
    @Arg("showExpired", () => Boolean, { nullable: true })
    showExpired: boolean | null
  ): Promise<PaginatedPosts> {
    // console.log("posts")

    //console.log(users)
    // console.log(userids)
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    let posts;
    if (!users && !userids) {
      const qb = await data.getRepository(Post).createQueryBuilder("post");
      //.leftJoinAndSelect("post.comments", "comment")
      if (cursor) {
        qb.where('post."createdAt" < :cursor', {
          cursor: new Date(parseInt(cursor)),
        });
      }
      if (!showExpired || showExpired != true) {
        qb.andWhere('post."locked" = :lock', {
          lock: false,
        });
      }
      qb.orderBy({
        'post."createdAt"': "DESC",
      });

      posts = await qb.take(reaLimitPlusOne).getMany();

      // console.log("posts: ", posts);
      return {
        posts: posts.slice(0, realLimit),
        hasMore: posts.length === reaLimitPlusOne,
      };

      //console.log(posts)
    } else if (users) {
      const user = await data
        .getRepository(User)
        .findBy({ username: In(users) });
      let userIDS = [] as number[];
      let i = 0;
      user.forEach((u) => {
        userIDS[i] = u.id;
        i++;
      });

      if (user) {
        let qb = await data
          .createQueryBuilder()
          .select("post")
          .from(Post, "post")
          .where('post."creatorId" IN(:...ids)', { ids: userIDS });
        if (cursor) {
          qb.where('post."createdAt" < :cursor', {
            cursor: new Date(parseInt(cursor)),
          });
        }
        if (!showExpired || showExpired != true) {
          qb.andWhere('post."locked" = :lock', {
            lock: false,
          });
        }
        qb.orderBy({
          'post."createdAt"': "DESC",
        });
        //.leftJoinAndSelect("post.comments", "comment")

        posts = await qb.take(reaLimitPlusOne).getMany();
        return {
          posts: posts.slice(0, realLimit),
          hasMore: posts.length === reaLimitPlusOne,
        };
      }
    } else {
      let qb = await data
        .createQueryBuilder()
        .select("post")
        .from(Post, "post")
        .where('post."creatorId" IN(:...ids)', { ids: userids });

      if (cursor) {
        qb.where('post."createdAt" < :cursor', {
          cursor: new Date(parseInt(cursor)),
        });
      }
      if (!showExpired || showExpired != true) {
        qb.andWhere('post."locked" = :lock', {
          lock: false,
        });
      }
      qb.orderBy({
        'post."createdAt"': "DESC",
      });
      //.leftJoinAndSelect("post.comments", "comment")

      posts = await qb.take(reaLimitPlusOne).getMany();

      return {
        posts: posts.slice(0, realLimit),
        hasMore: posts.length === reaLimitPlusOne,
      };
    }

    return {
      posts: [],
      hasMore: false,
    };

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();
  }

  @Query(() => SearchResponse)
  async search(
    @Ctx() { data }: MyContext,
    @Arg("search", () => String) search: string
  ): Promise<SearchResponse> {
    let posts = [] as Post[];
    let users = [] as User[];

    if (search.includes("#")) {
      if (search.includes("#Points")) {
        const qb = await data
          .getRepository(User)
          .createQueryBuilder()
          .orderBy({
            '"credits"': "DESC",
          })
          .take(50)
          .getMany();
        users.push(...qb);
      }
      if (search.includes("#Upvotes")) {
        const postqb = await data
          .getRepository(Post)
          .createQueryBuilder()
          .orderBy({
            '"upvotes"': "DESC",
          })
          .getMany();

        posts.push(...postqb);
      }
      if (search.includes("#Downvotes")) {
        const postqb = await data
          .getRepository(Post)
          .createQueryBuilder()
          .orderBy({
            '"downvotes"': "ASC",
          })
          .getMany();

        posts.push(...postqb);
      }
    } else {
      // console.log(search);
      const qb = await data
        .getRepository(User)
        .createQueryBuilder()
        .where({ username: ILike(`%${search}%`) })
        .orWhere({ name: ILike(`%${search}%`) })
        .getMany();

      users.push(...qb);

      const postqb = await data
        .getRepository(Post)
        .createQueryBuilder()
        .where({ title: ILike(`%${search}%`) })
        .orWhere({ text: ILike(`%${search}%`) })
        .orderBy({
          '"createdAt"': "DESC",
        })
        .getMany();

      posts.push(...postqb);
    }

    return {
      posts: posts,
      users: users,
    };
  }

  @Query(() => PaginatedPosts)
  async trending(
    @Ctx() { data }: MyContext,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Arg("anti", () => Boolean, { nullable: false }) anti: boolean
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const qb = await data.getRepository(Post).createQueryBuilder("post");
    //.leftJoinAndSelect("post.comments", "comment")
    if (cursor) {
      qb.where('post."createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    qb.andWhere('post."locked" = :lock', {
      lock: false,
    });
    if (!anti) {
      qb.andWhere('post."ratio" >= 0.66');
    } else {
      qb.andWhere('post."ratio" < 0.66');
    }

    qb.orderBy({
      'post."createdAt"': "DESC",
    }).limit(reaLimitPlusOne);

    let posts = await qb.getMany();

    return {
      posts: posts,
      hasMore: posts.length === reaLimitPlusOne,
    };

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOneBy({ id: id });
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Arg("file", () => GraphQLUpload, { nullable: true })
    file: typeof Upload | null,
    @Ctx()
    { req, data, debaccle_bucket, OneSignalclient }: MyContext
  ): Promise<PostResponse> {
    console.log("createPost");
    const user = await User.findOneBy({ id: req.session.userId });
    if (!user) {
      return {
        errors: [
          {
            field: "title",
            message: "You are not a user",
          },
        ],
      };
    }
    const postCosts = (user.followers.length + 1) / (user.haters.length + 1);
    if (user.credits < postCosts) {
      return {
        errors: [
          {
            field: "title",
            message: "You dont have enough points to post",
          },
        ],
      };
    }

    user.credits -= postCosts;

    if (user.followers.length > 0) {
      let x = postCosts / user.followers.length;

      // console.log(x)
      await data
        .createQueryBuilder()
        .update(User)
        .where("id IN(:...ids)", { ids: user.followers })
        .set({ credits: () => `credits + ${x}` })
        .execute();

      const notification = new OneSignal.Notification();
      notification.app_id = process.env.ONESIGNAL_APP_ID;
      notification.contents = {
        en: input.title,
      };
      notification.headings = {
        en: "@" + user.username + " just posted an opinion!",
      };

      let idArrayOfStrings: string[] = [];
      user.followers.map((num) => {
        idArrayOfStrings.push(num.toString());
      });
      notification.include_external_user_ids = idArrayOfStrings;

      await OneSignalclient.createNotification(notification);
    }

    data
      .createQueryBuilder()
      .update(User)
      .set({ credits: user.credits })
      .where({ id: user.id })
      .returning("*")
      .execute();

    let image = "";
    const token = v4();
    if (file != null) {
      image = `images/posts/${token}${file.filename}`;
    }

    const post = await Post.create({
      title: input.title,
      text: input.text,
      image: image,
      topics: input.topics,
      type: input.type,
      creatorId: req.session.userId,
    }).save();

    // console.log(path.join(__dirname, "../images/posts", file.filename));

    if (file) {
      await new Promise((res, rejects) =>
        file
          .createReadStream()
          .pipe(
            debaccle_bucket.file(image).createWriteStream({
              resumable: false,
              contentType: "image",
              gzip: true,
            })
          )
          .on("error", (err: any) => rejects(err)) // reject on error
          .on("finish", res)
      );
    }

    // console.log(post.createdAt.toString());

    return { post };
  }

  @Mutation(() => PostResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req, data }: MyContext
  ): Promise<PostResponse> {
    let today = new Date();
    const date = new Date(today.valueOf() - 1000 * 60 * 1.5);
    const result = await data
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .andWhere('"createdAt" > :date', {
        date,
      })
      .returning("*")
      .execute();
    console.log(result);
    if (result.raw[0]) {
      return result.raw[0];
    } else {
      return {
        errors: [
          {
            field: "title",
            message: "You ran out of time to edit this post",
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req, debaccle_bucket }: MyContext
  ): Promise<boolean> {
    const post = await Post.findOneBy({ id });

    if (post?.creatorId != req.session.userId) return false;

    if (post?.image) {
      async function deleteFile() {
        if (post?.image) await debaccle_bucket.file(post?.image).delete();
      }
      deleteFile().catch(console.error);
    }

    await Comment.delete({ postId: id });
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
