import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field(() => Post)
  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @Field()
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Field()
  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
