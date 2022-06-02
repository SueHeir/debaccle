import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
  Int,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entity/User";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { isAuth } from "../middleware/isAuth";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import Upload from "graphql-upload/Upload.js";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comment";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOneBy({ id: userIdNum });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    // log in user after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    console.log("forgotPassword");
    const user = await User.findOneBy({ email });
    if (!user) {
      // the email is not in the db
      console.log("email not in db");
      return true;
    }

    console.log(user);

    const token = v4();

    //console.log(token)

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    //console.log("sending email")
    await sendEmail(
      email,
      `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`,
      "Password Reset"
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOneBy({ id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req, data }: MyContext
  ): Promise<UserResponse> {
    console.log("New register called");
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    // console.log("no errors")
    const hashedPassword = await argon2.hash(options.password);
    let user = new User();

    //  console.log("checking for same users")
    const email_result = await data
      .getRepository(User)
      .findOneBy({ email: options.email });
    const username_result = await data
      .getRepository(User)
      .findOneBy({ username: options.username });
    // console.log("checked for same users")

    const token = v4();

    if (!email_result && !username_result) {
      user.email = options.email;
      user.username = options.username;
      user.name = options.name;
      user.credits = 0;
      user.password = hashedPassword;
      user.emailvarifiedtoken = token;
      // console.log(user);

      user = await data.getRepository(User).save(user);
      // console.log(user)

      req.session.userId = user.id;
      // console.log(req.session.userId)

      //console.log("sending email")

      await sendEmail(
        user.email,
        `<a href="${process.env.CORS_ORIGIN}/register-email/${token}">Register email here</a>`,
        "Thanks for Creating an Account!"
      );

      return { user };
    }

    if (email_result) {
      return {
        errors: [
          {
            field: "email",
            message: "email already taken",
          },
        ],
      };
    }
    if (username_result) {
      return {
        errors: [
          {
            field: "username",
            message: "username already taken",
          },
        ],
      };
    }

    return {
      errors: [
        {
          field: "username",
          message: "unknown",
        },
      ],
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async registerEmail(
    @Arg("token") token: string,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const user = await User.findOneBy({ id: req.session.userId });

    if (!user) {
      return false;
    }

    if (user.credits > 0) {
      if (user.emailvarified) {
        return false;
      }
    }

    let value = 25;

    if (
      user.email.includes("@gmail.com") ||
      user.email.includes("@outlook.com") ||
      user.email.includes("@hotmail.com") ||
      user.email.includes("@yahoo.com") ||
      user.email.includes("@aol.com") ||
      user.email.includes("@aim.com") ||
      user.email.includes("@inbox.com") ||
      user.email.includes("@icloud.com") ||
      user.email.includes("@mail.com") ||
      user.email.includes("@zoho.com") ||
      user.email.includes(".edu")
    ) {
      value = 25;
    }
    if (user.emailvarifiedtoken == token) {
      await User.update(
        { id: req.session.userId },
        { emailvarified: true, credits: user.credits + value }
      );
      return true;
    }

    return false;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg("id", () => Int, { nullable: true }) id: number,
    @Arg("username", () => String, { nullable: true }) username: string
  ): Promise<User | null> {
    if (id) {
      // let posts = await AppDataSource.getRepository(Post)
      //   .createQueryBuilder("post")
      //   .leftJoinAndSelect("post.comments", "comment")
      //   .getMany();

      return User.findOneBy({ id: id });
    } else {
      return User.findOneBy({ username: username });
    }
  }

  @Query(() => [User], { nullable: true })
  async userFollowHateInfo(
    @Arg("id", () => Int, { nullable: true }) id: number,
    @Arg("type", () => String) type: string,
    @Arg("username", () => String, { nullable: true }) username: string,
    @Ctx() { data }: MyContext
  ): Promise<User[] | null> {
    let user;
    if (id) {
      user = await User.findOneBy({ id: id });
    } else {
      user = await User.findOneBy({ username: username });
    }
    // console.log(user);
    if (user) {
      if (type == "followers") {
        // console.log("hello");
        let qb = await data
          .getRepository(User)
          .createQueryBuilder()
          .where("id IN(:...ids)", { ids: user.followers });

        const followers = await qb.getMany();

        console.log(followers);
        return followers;
      }
      if (type == "following") {
        let qb = await data
          .getRepository(User)
          .createQueryBuilder()
          .where("id IN(:...ids)", { ids: user.following });

        const following = await qb.getMany();

        return following;
      }
      if (type == "haters") {
        let qb = await data
          .getRepository(User)
          .createQueryBuilder()
          .where("id IN(:...ids)", { ids: user.haters });

        const haters = await qb.getMany();

        return haters;
      }
      if (type == "hating") {
        let qb = await data
          .getRepository(User)
          .createQueryBuilder()
          .where("id IN(:...ids)", { ids: user.hating });

        const hating = await qb.getMany();

        return hating;
      }
    }
    return null;
  }

  @Mutation(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("name") name: string,
    @Arg("bio") bio: string,
    @Arg("image") image: string,
    @Arg("file", () => GraphQLUpload, { nullable: true })
    file: typeof Upload | null,
    @Ctx() { data, debaccle_bucket }: MyContext
  ): Promise<User | null> {
    if (file) {
      // console.log(file);
      const user = await User.findOneBy({ id });

      if (user?.image && file) {
        async function deleteFile() {
          if (user?.image) await debaccle_bucket.file(user.image).delete();
        }
        deleteFile().catch(console.error);
      }

      const token = v4();

      image = `images/userprofiles/${token}${file.filename}`;

      console.log(image);
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

      // async function uploadFromMemory() {
      //   await debaccle_bucket.file(image).save(file.createReadStream());

      //   console.log(
      //     `${image} with contents ${file.valueOf()} uploaded to ${debaccle_bucket}.`
      //   );
      // }

      // uploadFromMemory().catch(console.error);

      const result = await data
        .createQueryBuilder()
        .update(User)
        .set({ name, bio, image })
        .where("id = :id", {
          id,
        })
        .returning("*")
        .execute();

      return result.raw[0];
    }

    console.log(bio);

    const result = await data
      .createQueryBuilder()
      .update(User)
      .set({ name, bio })
      .where("id = :id", {
        id,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async followUser(
    @Arg("username") username: string,
    @Ctx() { data, req }: MyContext
  ): Promise<UserResponse | null> {
    // console.log("followUser")

    let userToFollow = await User.findOneBy({ username: username });
    let userFollowing = await User.findOneBy({ id: req.session.userId });
    // console.log(userToHate)
    // console.log(userFollowing)

    if (userFollowing && userToFollow) {
      //console.log("inhere")

      if (userFollowing?.followers?.length >= 100) {
        return {
          errors: [
            {
              field: "Follow",
              message: "Can't follow more than 100 people",
            },
          ],
        };
      }
      if (
        userToFollow.followers.some(
          (folowers) => folowers === userFollowing?.id
        )
      ) {
        //console.log("ealready in usr")
        return {
          errors: [
            {
              field: "Follow",
              message: "Already Following Them",
            },
          ],
        };
      }

      //console.log( userToHate.followers)
      let updateFollowerList = userToFollow.followers;

      updateFollowerList.push(userFollowing.id);
      //console.log(updateFollowerList)

      let updateFollowingList = userFollowing.following;
      //updateFollowingList.push(userToHate.id)

      updateFollowingList.push(userToFollow.id);

      const result1 = await data
        .createQueryBuilder()
        .update(User)
        .set({ followers: updateFollowerList })
        .where("id = :id", {
          id: userToFollow.id,
        })
        .returning("*")
        .execute();

      await data
        .createQueryBuilder()
        .update(User)
        .set({ following: updateFollowingList })
        .where("id = :id", {
          id: userFollowing.id,
        })
        .returning("*")
        .execute();

      return { user: result1.raw[0] };
    }

    return {
      errors: [
        {
          field: "None",
          message: "No erros",
        },
      ],
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async unfollowUser(
    @Arg("username") username: string,
    @Ctx() { data, req }: MyContext
  ): Promise<UserResponse | null> {
    // console.log("unfollowUser")

    let userToFollow = await User.findOneBy({ username: username });
    let userFollowing = await User.findOneBy({ id: req.session.userId });
    // console.log(userToFollow)
    // console.log(userFollowing)

    if (userFollowing && userToFollow) {
      // console.log("inhere")
      if (
        userToFollow.followers.some(
          (folowers) => folowers === userFollowing?.id
        )
      ) {
        let updateFollowerList = userToFollow.followers;
        let index = updateFollowerList.indexOf(userFollowing.id, 0);
        if (index > -1) {
          updateFollowerList.splice(index, 1);
        }

        // console.log(updateFollowerList)
        let updateFollowingList = userFollowing.following;
        index = updateFollowingList.indexOf(userToFollow.id, 0);
        if (index > -1) {
          updateFollowingList.splice(index, 1);
        }

        const result1 = await data
          .createQueryBuilder()
          .update(User)
          .set({ followers: updateFollowerList })
          .where("id = :id", {
            id: userToFollow.id,
          })
          .returning("*")
          .execute();

        await data
          .createQueryBuilder()
          .update(User)
          .set({ following: updateFollowingList })
          .where("id = :id", {
            id: userFollowing.id,
          })
          .returning("*")
          .execute();

        return { user: result1.raw[0] };
      }
    }

    return {
      errors: [
        {
          field: "UnFollow",
          message: "No users to unfollow",
        },
      ],
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async hateUser(
    @Arg("username") username: string,
    @Ctx() { data, req }: MyContext
  ): Promise<UserResponse | null> {
    // console.log("followUser")

    let userToHate = await User.findOneBy({ username: username });
    let userHating = await User.findOneBy({ id: req.session.userId });
    // console.log(userToHate)
    // console.log(userHating)

    if (userHating && userToHate) {
      //console.log("inhere")
      if (userToHate.haters.some((folowers) => folowers === userHating?.id)) {
        //console.log("ealready in usr")
        return {
          errors: [
            {
              field: "Follow",
              message: "Already Hating Them",
            },
          ],
        };
      }

      //console.log( userToHate.followers)
      let updateHaterList = userToHate.haters;

      updateHaterList.push(userHating.id);
      //console.log(updateHaterList)

      let updateHatingList = userHating.hating;
      //updateHatingList.push(userToHate.id)
      updateHatingList.push(userToHate.id);

      const result1 = await data
        .createQueryBuilder()
        .update(User)
        .set({ haters: updateHaterList })
        .where("id = :id", {
          id: userToHate.id,
        })
        .returning("*")
        .execute();

      await data
        .createQueryBuilder()
        .update(User)
        .set({ hating: updateHatingList })
        .where("id = :id", {
          id: userHating.id,
        })
        .returning("*")
        .execute();

      return { user: result1.raw[0] };
    }

    return {
      errors: [
        {
          field: "None",
          message: "No erros",
        },
      ],
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async unhateUser(
    @Arg("username") username: string,
    @Ctx() { data, req }: MyContext
  ): Promise<UserResponse | null> {
    // console.log("unfollowUser")

    let userToHate = await User.findOneBy({ username: username });
    let userHating = await User.findOneBy({ id: req.session.userId });
    // console.log(userToHate)
    // console.log(userHating)

    if (userHating && userToHate) {
      // console.log("inhere")
      if (userToHate.haters.some((folowers) => folowers === userHating?.id)) {
        let updateHaterList = userToHate.haters;
        let index = updateHaterList.indexOf(userHating.id, 0);
        if (index > -1) {
          updateHaterList.splice(index, 1);
        }

        // console.log(updateHaterList)
        let updateHatingList = userHating.hating;
        index = updateHatingList.indexOf(userToHate.id, 0);
        if (index > -1) {
          updateHatingList.splice(index, 1);
        }

        const result1 = await data
          .createQueryBuilder()
          .update(User)
          .set({ haters: updateHaterList })
          .where("id = :id", {
            id: userToHate.id,
          })
          .returning("*")
          .execute();

        await data
          .createQueryBuilder()
          .update(User)
          .set({ hating: updateHatingList })
          .where("id = :id", {
            id: userHating.id,
          })
          .returning("*")
          .execute();

        return { user: result1.raw[0] };
      }
    }

    return {
      errors: [
        {
          field: "UnFollow",
          message: "No users to unfollow",
        },
      ],
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(
    @Ctx() { res, req, debaccle_bucket }: MyContext
  ): Promise<boolean> {
    await Comment.delete({ creatorId: req.session.userId });

    const posts = await Post.findBy({ creatorId: req.session.userId });

    posts.map(async (p) => {
      await Comment.delete({ postId: p.id });
      if (p?.image) {
        async function deleteFile() {
          if (p?.image) await debaccle_bucket.file(p?.image).delete();
        }
        deleteFile().catch(console.error);
      }
    });

    await Post.delete({ creatorId: req.session.userId });

    await User.delete({ id: req.session.userId });

    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
