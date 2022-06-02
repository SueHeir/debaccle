import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";
import { Comment } from "./Comment";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ default: "Please Create A Bio" })
  bio!: string;

  @Field()
  @Column({ default: "" })
  image: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ default: false })
  emailvarified!: boolean;

  @Field()
  @Column({
    default:
      "234230-9fo0awefj4r9riq34fokaefkq34023r2efokaef243r23wefesrovksfkdvmsfjsjerfwkfesef-0fo",
  })
  emailvarifiedtoken: string;

  @Field()
  @Column({ type: "float", default: 0.0 })
  credits!: number;

  @Column()
  password!: string;

  @Field(() => [Int])
  @Column("int", { array: true, default: [] })
  following: number[];

  @Field(() => [Int])
  @Column("int", { array: true, default: [] })
  followers: number[];

  @Field(() => [Int])
  @Column("int", { array: true, default: [] })
  hating: number[];

  @Field(() => [Int])
  @Column("int", { array: true, default: [] })
  haters: number[];

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
