/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { AuthChecker } from "type-graphql"
import type { NextApiRequest as Request } from 'next'

import { AuthService } from "./service"

export async function authChecker(context: Request, authHeader: string, roles: string[]): Promise<boolean> {
  try {
    context.user = await new AuthService().check(authHeader, roles)
  } catch (err) {
    return false
  }
  return true
}

export const nextAuthChecker: AuthChecker<Request> = async (
  { root, args, context, info }, roles,) => 
{
  return authChecker(context, context.req.headers.authorization, roles)
};