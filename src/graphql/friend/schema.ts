import { Field, ObjectType } from "type-graphql"
// import { Matches, IsNotEmpty } from "class-validator";
import { Member } from "../member/schema";


// @InputType()
// export class MemberId {
//   @Field(() => ID)
//   @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)
//     memberId!: string;
// }

// // Maybe just member?
// @ObjectType()
// export class Member {
//   @Field(() => ID) //type=>ID or can i leave it as ()?
//   //unsure if this will reinforce id
//     id!: MemberId;

//   @IsNotEmpty()
//   @Field()
//     name!: string;
// }

// there must be an array, could be empty but not null.
@ObjectType()
export class Requests {
  @Field(() => [Member], { nullable: false })
    inbound!: Member[];

  @Field(() => [Member], { nullable: false })
    outbound!: Member[];

}

