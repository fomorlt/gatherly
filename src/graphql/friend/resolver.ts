import { Query, Authorized, Arg, Mutation, Resolver, Ctx} from "type-graphql"
import type { NextApiRequest as Request } from 'next'
import { MemberId, Member } from "../member/schema";
import { FriendService } from "./service";
import { Requests } from "./schema";

@Resolver()
export class FriendResolver {
    @Authorized("member")
    @Mutation(() => Member)
  async makeRequest(
        @Arg("input") input: MemberId,
        @Ctx() request: Request
  ): Promise<Member> {
    return new FriendService().sendFriendRequest(request.user?.id, input.memberId);
  }

  @Authorized("member")
  @Query(() => Requests)
    async request(
    @Ctx() request: Request
    ): Promise<Requests> {
      return new FriendService().getRequests(request.user?.id);
    }

  @Authorized("member")
  @Mutation(() => Member)
  async acceptRequest(
    @Arg("input") input: MemberId,
    @Ctx() request: Request
  ): Promise<Member> {
    return new FriendService().acceptFriendRequest(request.user?.id, input.memberId);
  }

  @Authorized("member")
  @Query(() => [Member])
  async friend(
    @Ctx() request: Request
  ): Promise<Member[]> {
    return new FriendService().getFriends(request.user?.id);
  }

  @Authorized("member")
  @Mutation(() => Member)
  async removeFriend(
    @Arg("input") input: MemberId,
    @Ctx() request: Request
  ): Promise<Member> {
    return new FriendService().deleteFriend(request.user?.id, input.memberId);
  }
}