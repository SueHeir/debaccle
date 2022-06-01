import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { AppDataSource } from "./modules/config/ormconfig";
import { CommentResolver } from "./resolvers/comment";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { Storage } from "@google-cloud/storage";

process.env.TZ = "UTC";

const main = async () => {
  console.log("Hello from version 0.0.15");
  await AppDataSource.initialize();

  console.log("DataBase init");

  await AppDataSource.runMigrations();
  console.log("DataBase runMigrations");

  const gc = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY
        ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n")
        : "",
    },
  });

  const debaccle_bucket = gc.bucket("debaccle-first-test");
  // let posts = await AppDataSource.getRepository(Post)
  //   .createQueryBuilder("post")
  //   .leftJoinAndSelect("post.comments", "comment")
  //   .getMany();

  // posts.map((p) => {
  //   p.commentCount = p.comments.length;
  //   AppDataSource.getRepository(Post).update(
  //     {
  //       id: p.id,
  //     },
  //     {
  //       commentCount: p.commentCount,
  //     }
  //   );
  // });

  // const users = await AppDataSource.getRepository(User).update(
  //   { credits: 0, emailvarified: true },
  //   { credits: 25 }
  // );

  // console.log(users);

  const app_key_provider = {
    getToken() {
      return process.env.ONESIGNAL_APP_KEY;
    },
  };
  const user_key_provider = {
    getToken() {
      return process.env.ONESIGNAL_USER_KEY;
    },
  };

  const OneSignal = require("@onesignal/node-onesignal");

  let configuration = OneSignal.createConfiguration({
    authMethods: {
      user_key: {
        tokenProvider: user_key_provider,
      },
      app_key: {
        tokenProvider: app_key_provider,
      },
    },
  });

  const OneSignalclient = await new OneSignal.DefaultApi(configuration);

  const OneSignalApp = await OneSignalclient.getApp(
    process.env.ONESIGNAL_APP_ID
  );

  const app = express();

  if (__prod__) {
    app.set("trust proxy", 1);
  }
  console.log("app init");
  // app.use("/images", express.static(path.join(__dirname, "/images")));
  // console.log("app use /images");

  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 1 }));

  const RedisStore = connectRedis(session);
  const IoRedis = require("ioredis");
  const redis = new IoRedis(process.env.REDIS_URL);

  console.log("Cors Options:" + process.env.CORS_ORIGIN);

  var corsOptions = {
    origin: [process.env.CORS_ORIGIN],
    Headers: {
      AccessControlAllowOrigin: process.env.CORS_ORIGIN,
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        domain: __prod__ ? ".debaccle.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, CommentResolver],

      validate: false,
    }),

    context: ({ req, res }) => ({
      data: AppDataSource,
      req,
      res,
      redis: redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
      debaccle_bucket: debaccle_bucket,
      // OneSignalclient,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on port" + process.env.PORT);
  });

  var minutes = 2,
    the_interval = minutes * 60 * 1000;
  setInterval(async function () {
    // console.log("I am doing my 1 minutes check");

    let today = new Date();
    // const date = new Date(
    //   today.getFullYear(),
    //   today.getMonth(),
    //   today.getDate()-2,
    //   today.getHours(),
    //   today.getMinutes(),
    //   today.getSeconds()
    // );
    const date = new Date(today.valueOf() - 1000 * 60 * 60 * 72);

    // console.log(date);
    let resutls = await AppDataSource.createQueryBuilder()
      .update(Post)
      .set({ locked: true })
      .where("locked = :lockedfalse", {
        lockedfalse: false,
      })
      .andWhere('"createdAt" < :date', {
        date,
      })
      .returning("*")
      .execute();

    resutls.raw.map(async (p: Post) => {
      console.log("handing post p");
      const value = p.upvotes;
      const user = await AppDataSource.createQueryBuilder()
        .update(User)
        .where({ id: p.creatorId })
        .set({ credits: () => `credits + ${value}` })
        .returning("*")
        .execute();
      // console.log(user);
      if (p.downvotes < 0) {
        if (user.raw[0].haters.length > 0) {
          let x = -p.downvotes / user.raw[0].haters.length;
          // console.log(x);
          await AppDataSource.createQueryBuilder()
            .update(User)
            .where("id IN(:...ids)", { ids: user.raw[0].haters })
            .set({ credits: () => `credits + ${x}` })
            .returning("*")
            .execute();

          // console.log(haters);
        }
      }
    });

    // console.log(resutls);
  }, the_interval);

  const notification = new OneSignal.Notification();
  notification.app_id = OneSignalApp.id;
  notification.contents = {
    en: "contents is here",
  };
  notification.headings = {
    en: "heading is here",
  };
  notification.include_external_user_ids = ["2"];

  await OneSignalclient.createNotification(notification, {
    Authorization: "Basic " + process.env.ONESIGNAL_APP_KEY,
  });
};

main().catch((err) => {
  console.error(err);
});
