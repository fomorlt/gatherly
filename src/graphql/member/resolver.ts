import { Query, Authorized, Arg, Mutation, Resolver, Ctx} from "type-graphql"
import type { NextApiRequest as Request } from 'next'
import { Member, NewMember } from "./schema"
import { MemberService } from "./service"

@Resolver()
export class MemberResolver {
    @Authorized("admin")
    @Mutation(() => Member)
  async makeMember(
        @Arg("input") input: NewMember,
        
  ): Promise<Member> {
    // console.log('it is done.');
    return new MemberService().createMember(input);
  }

    @Authorized("member")
    @Query(() => [Member])
    async member(
      @Ctx() request: Request
    ): Promise<Member[]> {
      return new MemberService().getAllMembers(request.user?.id);
    }
}