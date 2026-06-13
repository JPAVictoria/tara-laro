import { prisma } from '@/lib/prisma'
import type { Review, PaginatedResponse } from '@/types'

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const url = new URL(request.url)
  const sort = url.searchParams.get('sort') ?? 'newest'
  const cursor = url.searchParams.get('cursor') ?? undefined
  const limit = 20

  const orderBy = sort === 'highest'
    ? [{ rating: 'desc' as const }, { createdAt: 'desc' as const }]
    : [{ createdAt: 'desc' as const }]

  const reviews = await prisma.review.findMany({
    where: { gameId: params.id, deleted: false },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      game: { select: { id: true, title: true } },
    },
    orderBy,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = reviews.length > limit
  if (hasMore) reviews.pop()

  const result: Review[] = reviews.map((r) => ({
    id: r.id,
    userId: r.userId,
    gameId: r.gameId,
    rating: r.rating,
    content: r.content,
    user: r.user,
    game: r.game,
    createdAt: r.createdAt.toISOString(),
  }))

  return Response.json({
    data: result,
    nextCursor: hasMore && reviews.length > 0 ? reviews[reviews.length - 1]!.id : null,
    hasMore,
  } satisfies PaginatedResponse<Review>)
}
