import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { User, ApiResponse, MutationResponse } from '@/types'

function toUserShape(u: {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  _count: { posts: number; followers: number; following: number }
  createdAt: Date
}): User {
  return {
    id: u.id,
    supabaseId: '',
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    bio: u.bio,
    followersCount: u._count.followers,
    followingCount: u._count.following,
    postsCount: u._count.posts,
    createdAt: u.createdAt.toISOString(),
  }
}

export async function GET(_request: Request, context?: { params?: { id: string } }): Promise<Response> {
  const id = context?.params?.id
  if (!id) return Response.json({ data: null, error: 'Missing user ID' }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { id, deleted: false },
    include: { _count: { select: { posts: { where: { deleted: false } }, followers: true, following: true } } },
  })

  if (!user) {
    return Response.json({ data: null, error: 'User not found' }, { status: 404 })
  }

  return Response.json({ data: toUserShape(user), error: null } satisfies ApiResponse<User>)
}

export async function PATCH(request: Request, context?: { params?: { id: string } }): Promise<Response> {
  const id = context?.params?.id
  if (!id) return Response.json({ oldData: null, newData: null, error: 'Missing user ID' }, { status: 400 })

  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { id } })
  if (!dbUser || dbUser.supabaseId !== authUser.id) {
    return Response.json({ oldData: null, newData: null, error: 'Forbidden' }, { status: 403 })
  }

  const { displayName, bio, avatarUrl } = await request.json() as {
    displayName?: string
    bio?: string
    avatarUrl?: string | null
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(displayName?.trim() ? { displayName: displayName.trim() } : {}),
      ...(bio !== undefined ? { bio: bio?.trim() ?? null } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    },
    include: { _count: { select: { posts: { where: { deleted: false } }, followers: true, following: true } } },
  })

  return Response.json({
    oldData: toUserShape(dbUser as Parameters<typeof toUserShape>[0]),
    newData: toUserShape(updated),
    error: null,
  } satisfies MutationResponse<User>)
}
