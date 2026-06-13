import { prisma } from '@/lib/prisma'
import type { Game, Review, ApiResponse } from '@/types'

interface GameDetail extends Game {
  reviews: Review[]
  reviewsCount: number
}

export async function GET(_request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        where: { deleted: false },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          game: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: { select: { reviews: { where: { deleted: false } } } },
    },
  })

  if (!game) {
    return Response.json({ data: null, error: 'Game not found' }, { status: 404 })
  }

  const result: GameDetail = {
    id: game.id,
    title: game.title,
    coverUrl: game.coverUrl,
    genre: game.genre,
    description: game.description,
    avgRating: game.avgRating,
    releaseDate: game.releaseDate?.toISOString() ?? null,
    reviews: game.reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      gameId: r.gameId,
      rating: r.rating,
      content: r.content,
      user: r.user,
      game: r.game,
      createdAt: r.createdAt.toISOString(),
    })),
    reviewsCount: game._count.reviews,
  }

  return Response.json({ data: result, error: null } satisfies ApiResponse<GameDetail>)
}
