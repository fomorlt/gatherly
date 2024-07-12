import { Field, ObjectType, ID, InputType } from "type-graphql"
import { Matches, IsNotEmpty } from "class-validator";

// reminder to self, bang (!) means that the field cannot be null
// regex code from asgn1 implementation

@InputType()
export class MemberId {
  @Field()
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)
    memberId!: string;
}

@InputType()
export class NewMember {
    @Field()
    @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      email!: string

    @Field()
    @IsNotEmpty()
      password!: string

    @IsNotEmpty()
    @Field()
      name!: string;
}

@ObjectType()
export class Member {
  @Field(() => ID) //type=>ID or can i leave it as ()?
  //unsure if this will reinforce id
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)
    id!: string;

  @IsNotEmpty()
  @Field()
    name!: string;
}