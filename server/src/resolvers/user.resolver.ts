import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  getUsers,
  login,
  logout,
  registerUser,
} from "../db/user";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { UserResponse } from "../customResponse/userResponse";
import { isAuth } from "../middleware/isAuth";

@InputType()
class UserInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    return getUsers();
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async currentUser(@Ctx() { req, redisClient, res }: MyContext) {
    return getCurrentUser({ req, redisClient, res });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("userInput") userInput: UserInput,
    @Ctx() { req, redisClient, res }: MyContext
  ) {
    return registerUser(userInput, { req, redisClient, res });
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req, redisClient, res }: MyContext
  ) {
    return login({ usernameOrEmail, password }, { req, redisClient, res });
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, redisClient, res }: MyContext) {
    return logout({ req, redisClient, res });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { req, redisClient, res }: MyContext
  ) {
    return forgotPassword({ email }, { req, redisClient, res });
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, redisClient, res }: MyContext
  ) {
    return changePassword({ token, newPassword }, { req, redisClient, res });
  }
}
