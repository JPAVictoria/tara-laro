import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { Review, MutationResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }

  const { gameId, rating, content } = await request.json() as {
    gameId: string
    rating: number
    content: string
  }

  if (!gameId || !content?.trim() || rating < 1 || rating > 5) {
    return Response.json({ oldData: null, newData: null, error: 'gameId, rating (1-5), and content are required' }, { status: 400 })
  }

  const game = await prisma.game.findUnique({ where: { id: gameId } })
  if (!game) {
    return Response.json({ oldData: null, newData: null, error: 'Game not found' }, { status: 404 })
  }

  const existing = await prisma.review.findUnique({
    where: { userId_gameId: { userId: dbUser.id, gameId } },
  })

  const review = existing
    ? await prisma.review.update({
        where: { userId_gameId: { userId: dbUser.id, gameId } },
        data: { rating, content: content.trim(), deleted: false },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          game: { select: { id: true, title: true } },
        },
      })
    : await prisma.review.create({
        data: { userId: dbUser.id, gameId, rating, content: content.trim() },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          game: { select: { id: true, title: true } },
        },
      })

  const allReviews = await prisma.review.findMany({
    where: { gameId, deleted: false },
    select: { rating: true },
  })
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  await prisma.game.update({ where: { id: gameId }, data: { avgRating } })

  const result: Review = {
    id: review.id,
    userId: review.userId,
    gameId: review.gameId,
    rating: review.rating,
    content: review.content,
    user: review.user,
    game: review.game,
    createdAt: review.createdAt.toISOString(),
  }

  return Response.json({
    oldData: existing ? { ...result, rating: existing.rating, content: existing.content } : null,
    newData: result,
    error: null,
  } satisfies MutationResponse<Review>)
}
