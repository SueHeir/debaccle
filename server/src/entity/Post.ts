import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Updoot } from "./Updoot";
import { Comment } from "./Comment";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ default: "" })
  image: string;

  @Field(() => [String])
  @Column("text", { array: true, default: [] })
  topics: string[];

  @Field(() => String)
  @Column({ default: "opinion" })
  type: string;

  @Field()
  @Column({ type: "int", default: 0 })
  upvotes!: number;

  @Field()
  @Column({ type: "int", default: 0 })
  downvotes!: number;

  @Field()
  @Column({ type: "boolean", default: false })
  locked!: boolean;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Column({ type: "float", default: 1 })
  ratio!: number;

  @Field()
  @Column({ type: "int", default: 0 })
  commentCount!: number;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
