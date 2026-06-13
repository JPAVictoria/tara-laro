import { prisma } from '@/lib/prisma'
import type { Game, PaginatedResponse } from '@/types'

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const cursor = url.searchParams.get('cursor') ?? undefined
  const genre = url.searchParams.get('genre') ?? undefined
  const search = url.searchParams.get('search') ?? undefined
  const limit = 40

  const games = await prisma.game.findMany({
    where: {
      ...(genre ? { genre: { has: genre } } : {}),
      ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { avgRating: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = games.length > limit
  if (hasMore) games.pop()

  const result: Game[] = games.map((g) => ({
    id: g.id,
    title: g.title,
    coverUrl: g.coverUrl,
    genre: g.genre,
    description: g.description,
    avgRating: g.avgRating,
    releaseDate: g.releaseDate?.toISOString() ?? null,
  }))

  return Response.json({
    data: result,
    nextCursor: hasMore && games.length > 0 ? games[games.length - 1]!.id : null,
    hasMore,
  } satisfies PaginatedResponse<Game>)
}
