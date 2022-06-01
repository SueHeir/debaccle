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
import { Comment } from "../entity/Comment";
import { User } from "../entity/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class CommentInput {
  @Field()
  text: string;
  @Field()
  postId: number;
}

@ObjectType()
class CommentFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class CommentResponse {
  @Field(() => [CommentFieldError], { nullable: true })
  errors?: CommentFieldError[];

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

@ObjectType()
class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];
  @Field()
  hasMore: boolean;
}

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() comment: Comment) {
    return comment.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creatorId);
  }

  // @FieldResolver(() => Int, { nullable: true })
  // async voteStatus(
  //   @Root() post: Post,
  //   @Ctx() { updootLoader, req }: MyContext
  // ) {
  //   if (!req.session.userId) {
  //     return null;
  //   }

  //   const updoot = await updootLoader.load({
  //     postId: post.id,
  //     userId: req.session.userId,
  //   });

  //   return updoot ? updoot.value : null;
  // }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg("commentId", () => Int) commentId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req, data }: MyContext
  ): Promise<Comment | null> {
    //const isUpdoot = value !== -1;
    let hating = false;
    if (value < 0) {
      hating = true;
    }
    const realValue = Math.abs(value);
    const { userId } = req.session;

    const comment = await Comment.findOneBy({ id: commentId });

    const post = await Post.findOneBy({ id: comment?.postId });

    if (post?.locked) return comment;
    if (!comment) return null;
    if (comment.creatorId == userId) return comment;
    // console.log(post.creatorId)
    // console.log(userId)
    const userDoing = await User.findOneBy({ id: userId });
    const userReciving = await User.findOneBy({ id: comment.creatorId });
    if (!userDoing) return comment;
    if (!userReciving) return comment;

    if (userDoing.credits < realValue) {
      return comment;
    }

    userDoing.credits -= realValue;
    await User.update({ id: userDoing.id }, { credits: userDoing.credits });

    if (!hating) {
      userReciving.credits += realValue;

      await User.update(
        { id: userReciving.id },
        { credits: userReciving.credits }
      );

      comment.upvotes += value;
      await Comment.update({ id: commentId }, { upvotes: comment.upvotes });
    } else {
      if (userReciving.haters.length > 0) {
        let otherHaters = userReciving.haters;
        let index = -1;
        for (let i = 0; i < otherHaters.length; i++) {
          if (otherHaters[i] == userId) {
            index = i;
          }
        }
        otherHaters.splice(index, 1);

        if (otherHaters.length > 0) {
          let x = realValue / userReciving.haters.length;

          // console.log(x)
          // console.log(userReciving.haters)
          await data
            .createQueryBuilder()
            .update(User)
            .where("id IN(:...ids)", { ids: otherHaters })
            .set({ credits: () => `credits + ${x}` })
            .returning("*")
            .execute();

          comment.downvotes += value;
          await Comment.update(
            { id: commentId },
            { downvotes: comment.downvotes }
          );
        }
      }
    }

    return comment;
  }

  @Query(() => PaginatedComments)
  async comments(
    @Ctx() { data }: MyContext,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Arg("postId", () => Int, { nullable: false }) postId: number
  ): Promise<PaginatedComments> {
    // console.log("comments")

    //console.log(users)
    // console.log(userids)
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    const qb = await data.getRepository(Comment).createQueryBuilder("comment");
    //.leftJoinAndSelect("post.comments", "comment")
    if (cursor) {
      qb.where('comment."createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    qb.where({ postId: postId });
    qb.orderBy({
      'comment."upvotes"': "DESC",
    });

    const comments = await qb.take(limit).getMany();
    // console.log(comments)
    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === reaLimitPlusOne,
    };
  }

  @Query(() => Comment, { nullable: true })
  comment(@Arg("id", () => Int) id: number): Promise<Comment | null> {
    return Comment.findOneBy({ id: id });
  }

  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("input") input: CommentInput,
    @Ctx() { req, data }: MyContext
  ): Promise<CommentResponse> {
    //  console.log('createComment')
    const post = await data.getRepository(Post).findOneBy({ id: input.postId });
    if (post?.locked) {
      return {
        errors: [
          {
            field: "text",
            message: "This Post has expired",
          },
        ],
      };
    }

    const user = await User.findOneBy({ id: req.session.userId });

    if (!user) {
      return {
        errors: [
          {
            field: "text",
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
            field: "text",
            message: "You dont have enough points to post",
          },
        ],
      };
    }

    user.credits -= postCosts;

    // console.log(postCosts)
    if (user.followers.length > 0) {
      let x = postCosts / user.followers.length;

      //  console.log(x)
      await data
        .createQueryBuilder()
        .update(User)
        .where("id IN(:...ids)", { ids: user.followers })
        .set({ credits: () => `credits + ${x}` })
        .execute();
    }

    data
      .createQueryBuilder()
      .update(User)
      .set({ credits: user.credits })
      .where({ id: user.id })
      .returning("*")
      .execute();

    const com = new Comment();
    com.text = input.text;
    com.creatorId = user.id;
    com.creator = user;
    com.postId = input.postId;
    const comment = await Comment.save(com);

    if (post) {
      data.getRepository(Post).update(
        {
          id: input.postId,
        },
        {
          commentCount: post.commentCount + 1,
        }
      );
    }

    // console.log(post)

    return { comment };
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg("id", () => Int) id: number,
    @Arg("text") text: string,
    @Ctx() { req, data }: MyContext
  ): Promise<Post | null> {
    const result = await data
      .createQueryBuilder()
      .update(Post)
      .set({ text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req, data }: MyContext
  ): Promise<boolean> {
    // not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (post.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    const post = await data.getRepository(Post).findOneBy({ id: postId });

    if (post) {
      data.getRepository(Post).update(
        {
          id: postId,
        },
        {
          commentCount: post.commentCount - 1,
        }
      );
    }

    await Comment.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
