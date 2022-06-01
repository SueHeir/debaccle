import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { Session } from "express-session";
import { Bucket } from "@google-cloud/storage";
// const OneSignal = require("@onesignal/node-onesignal");

export type MyContext = {
  data: DataSource;
  res: Response;
  req: Request & {
    session: Session & {
      userId: number;
    };
  };
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
  debaccle_bucket: Bucket;
  // OneSignalclient: ReturnType<typeof OneSignal.DefaultApi>;
};
