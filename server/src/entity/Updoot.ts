import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Field } from "type-graphql";

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryGeneratedColumn()
  updootId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;
}
