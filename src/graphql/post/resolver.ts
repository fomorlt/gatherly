import { Query, Authorized, Arg, Mutation, Resolver, Ctx, Args} from "type-graphql"
import type { NextApiRequest as Request } from 'next'
import { NewPost, Post, PageSize } from "./schema";
import { PostService } from "./service";
// import { MemberId, Member } from "../member/schema";

@Resolver()
export class PostResolver {
    @Authorized("member")
    @Mutation(() => Post)
  async makePost(
        @Arg("input") input: NewPost,
        @Ctx() request: Request
  ): Promise<Post> {
    return new PostService().createPost(request.user?.id, input.content, input.image)
  }


    // Code for optional argument from SO and TGQL dogs
    // https://stackoverflow.com/questions/63293280/optional-argument-mutation-typegraphql
    // https://typegraphql.com/docs/0.17.0/resolvers.html
    @Authorized("member")
  @Query(() => [Post])
    async post(
    @Args() pagesize: PageSize,
    @Ctx() request: Request
    ): Promise<Post[]> {
      return new PostService().fetchPosts(request.user?.id, pagesize);
    }
    // @Authorized("member")
    // @Query(() => [Member])
    // async member(
    //   @Ctx() request: Request
    // ): Promise<Member[]> {
    //   return new MemberService().getAllMembers(request.user?.id);
    // }
}