import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { PaginatedResponse, Post, MutationResponse } from '@/types'

export async function GET(request: Request): Promise<Response> {
  const user = await getRequestUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const cursor = url.searchParams.get('cursor') ?? undefined
  const limit = 20

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })
  if (!dbUser) {
    return Response.json({ data: [], nextCursor: null, hasMore: false } satisfies PaginatedResponse<Post>)
  }

  const following = await prisma.follow.findMany({
    where: { followerId: dbUser.id },
    select: { followeeId: true },
  })
  const followeeIds = following.map((f) => f.followeeId)

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const posts = await prisma.post.findMany({
    where: {
      deleted: false,
      OR: [
        ...(followeeIds.length > 0 ? [{ userId: { in: followeeIds } }] : []),
        { likesCount: { gte: 5 }, createdAt: { gte: sevenDaysAgo } },
        { userId: dbUser.id },
      ],
    },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      game: { select: { id: true, title: true, coverUrl: true } },
      likes: { where: { userId: dbUser.id }, select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = posts.length > limit
  if (hasMore) posts.pop()

  const result: Post[] = posts.map((p) => ({
    id: p.id,
    userId: p.userId,
    gameId: p.gameId,
    content: p.content,
    images: p.images,
    likesCount: p.likesCount,
    commentsCount: p.commentsCount,
    isLiked: p.likes.length > 0,
    user: p.user,
    game: p.game,
    createdAt: p.createdAt.toISOString(),
  }))

  return Response.json({
    data: result,
    nextCursor: hasMore && posts.length > 0 ? posts[posts.length - 1]!.id : null,
    hasMore,
  } satisfies PaginatedResponse<Post>)
}

export async function POST(request: Request): Promise<Response> {
  const user = await getRequestUser(request)
  if (!user) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })
  if (!dbUser) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }

  const { content, images, gameId } = await request.json() as {
    content: string
    images?: string[]
    gameId?: string | null
  }

  if (!content?.trim()) {
    return Response.json({ oldData: null, newData: null, error: 'Content is required' }, { status: 400 })
  }

  const post = await prisma.post.create({
    data: {
      userId: dbUser.id,
      content: content.trim(),
      images: images ?? [],
      gameId: gameId ?? null,
    },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      game: { select: { id: true, title: true, coverUrl: true } },
    },
  })

  const result: Post = {
    id: post.id,
    userId: post.userId,
    gameId: post.gameId,
    content: post.content,
    images: post.images,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: false,
    user: post.user,
    game: post.game,
    createdAt: post.createdAt.toISOString(),
  }

  return Response.json({ oldData: null, newData: result, error: null } satisfies MutationResponse<Post>)
}
