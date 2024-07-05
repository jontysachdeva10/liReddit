import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Error {
  @Field()
  code!: string;
  @Field()
  message!: string;

  @Field()
  field!: string;
}
