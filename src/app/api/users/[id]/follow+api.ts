import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { MutationResponse } from '@/types'

interface FollowResult {
  followerId: string
  followeeId: string
  following: boolean
}

export async function POST(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const follower = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!follower) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }
  if (follower.id === params.id) {
    return Response.json({ oldData: null, newData: null, error: 'Cannot follow yourself' }, { status: 400 })
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followeeId: { followerId: follower.id, followeeId: params.id } },
  })

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followeeId: { followerId: follower.id, followeeId: params.id } },
    })
    const result: FollowResult = { followerId: follower.id, followeeId: params.id, following: false }
    return Response.json({ oldData: { ...result, following: true }, newData: result, error: null } satisfies MutationResponse<FollowResult>)
  }

  await prisma.follow.create({ data: { followerId: follower.id, followeeId: params.id } })
  const result: FollowResult = { followerId: follower.id, followeeId: params.id, following: true }
  return Response.json({ oldData: { ...result, following: false }, newData: result, error: null } satisfies MutationResponse<FollowResult>)
}
