import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { User, ApiResponse } from '@/types'

export async function GET(request: Request): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ data: null, error: 'Unauthorized' } satisfies ApiResponse<null>, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id, deleted: false },
    include: {
      _count: {
        select: {
          posts: { where: { deleted: false } },
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    return Response.json({ data: null, error: 'User not found' } satisfies ApiResponse<null>, { status: 404 })
  }

  const result: User = {
    id: user.id,
    supabaseId: user.supabaseId,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    postsCount: user._count.posts,
    createdAt: user.createdAt.toISOString(),
  }

  return Response.json({ data: result, error: null } satisfies ApiResponse<User>)
}
