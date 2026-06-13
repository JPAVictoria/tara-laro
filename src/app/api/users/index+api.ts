import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { MutationResponse, User, ApiResponse } from '@/types'

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') ?? ''

  if (!search.trim()) {
    return Response.json({ data: [], error: null } satisfies ApiResponse<User[]>)
  }

  const users = await prisma.user.findMany({
    where: {
      deleted: false,
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ],
    },
    take: 20,
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

  const result: User[] = users.map((u) => ({
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
  }))

  return Response.json({ data: result, error: null } satisfies ApiResponse<User[]>)
}

export async function POST(request: Request): Promise<Response> {
  const user = await getRequestUser(request)
  if (!user) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { username, displayName, avatarUrl } = await request.json() as {
    username: string
    displayName: string
    avatarUrl?: string | null
  }

  if (!username?.trim() || !displayName?.trim()) {
    return Response.json(
      { oldData: null, newData: null, error: 'username and displayName are required' },
      { status: 400 },
    )
  }

  const existing = await prisma.user.findUnique({ where: { supabaseId: user.id } })
  if (existing) {
    return Response.json({ oldData: null, newData: existing, error: null } satisfies MutationResponse<typeof existing>)
  }

  const newUser = await prisma.user.create({
    data: {
      supabaseId: user.id,
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      avatarUrl: avatarUrl ?? null,
    },
  })

  return Response.json({ oldData: null, newData: newUser, error: null } satisfies MutationResponse<typeof newUser>)
}
