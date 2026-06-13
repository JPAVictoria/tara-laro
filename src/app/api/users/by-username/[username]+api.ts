import { prisma } from '@/lib/prisma'
import type { User, ApiResponse } from '@/types'

export async function GET(_request: Request, context?: { params?: { username: string } }): Promise<Response> {
  const username = context?.params?.username
  if (!username) {
    return Response.json({ data: null, error: 'Missing username' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { username, deleted: false },
    include: { _count: { select: { posts: { where: { deleted: false } }, followers: true, following: true } } },
  })

  if (!user) {
    return Response.json({ data: null, error: 'User not found' }, { status: 404 })
  }

  const result: User = {
    id: user.id,
    supabaseId: '',
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
