import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Field, ObjectType } from "type-graphql";

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
  @Column({ type: 'int', default: 0 })
  points!: number;

  @Field()
  @Column()
  authorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  author!: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Field()
  @UpdateDateColumn()
  updatedAt: Date = new Date();
  
}
