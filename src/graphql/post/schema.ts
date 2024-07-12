import { ArgsType, Field, ObjectType, ID, InputType, Int } from "type-graphql"
import { Matches, IsNotEmpty } from "class-validator";

@InputType()
export class NewPost {
    @IsNotEmpty()
    @Field()
      content!: string;

    @Field({nullable: true})
    @Matches(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)
      image?: string;

}

@ObjectType()
export class Post{
  @IsNotEmpty()
  @Field()
    content!: string;

  @Field(() => ID)
    id!: string;

  //optional
  @Field({nullable: true})
  @Matches(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)
    image?: string;

  @Field(() => Date)
    posted!: Date;

    @IsNotEmpty()
  @Field()
      name!: string;
}

@ArgsType()
export class PageSize {

  @IsNotEmpty()
  @Field(() => Int)
    page!: number

  @Field(() => Int, {nullable: true})
    size?: number
}