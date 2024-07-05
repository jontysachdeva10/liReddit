import { Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { Error } from "./Error";

@ObjectType()
export class UserResponse {
    @Field(() => User, { nullable: true })
    user?: User

    @Field(() => Error, { nullable: true })
    error?: Error
}