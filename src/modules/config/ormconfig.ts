import "reflect-metadata";
import { DataSource } from "typeorm";
import { Post } from "../../entity/Post";
import { Updoot } from "../../entity/Updoot";
import { User } from "../../entity/User";
import { Comment } from "../../entity/Comment";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // host: "localhost",
  // port: 5432,
  // username: "postgres",
  // password: "postgres",
  // database: "debaccle",
  synchronize: true,
  logging: false,
  entities: [User, Post, Updoot, Comment],
  migrations: ["../../migrations/*.js"],
  subscribers: [],
});
