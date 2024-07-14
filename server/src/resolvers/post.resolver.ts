import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../db/posts";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class PostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit") limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ) {
    return getPosts(limit, cursor);
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number) {
    return getPostById(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("postInput") postInput: PostInput,
    @Ctx() { req, redisClient, res }: MyContext
  ) {
    return createPost(postInput, { req, redisClient, res });
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id") id: number,
    @Arg("postInput") postInput: PostInput
  ) {
    return updatePost({ id, ...postInput });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg("id") id: number) {
    return deletePost(id);
  }
}
