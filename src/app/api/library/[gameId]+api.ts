import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { UserGame, MutationResponse } from '@/types'

function toUserGameShape(entry: {
  id: string
  userId: string
  gameId: string
  status: string
  progress: number
  createdAt: Date
  updatedAt: Date
  game: {
    id: string
    title: string
    coverUrl: string | null
    genre: string[]
    description: string | null
    avgRating: number
    releaseDate: Date | null
  }
}): UserGame {
  return {
    id: entry.id,
    userId: entry.userId,
    gameId: entry.gameId,
    status: entry.status as UserGame['status'],
    progress: entry.progress,
    game: {
      id: entry.game.id,
      title: entry.game.title,
      coverUrl: entry.game.coverUrl,
      genre: entry.game.genre,
      description: entry.game.description,
      avgRating: entry.game.avgRating,
      releaseDate: entry.game.releaseDate?.toISOString() ?? null,
    },
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { gameId: string } },
): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { status, progress } = await request.json() as { status?: string; progress?: number }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }

  const existing = await prisma.userGame.findUnique({
    where: { userId_gameId: { userId: dbUser.id, gameId: params.gameId } },
    include: { game: true },
  })

  if (!existing) {
    return Response.json({ oldData: null, newData: null, error: 'Game not in library' }, { status: 404 })
  }

  const updated = await prisma.userGame.update({
    where: { userId_gameId: { userId: dbUser.id, gameId: params.gameId } },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(progress !== undefined ? { progress } : {}),
    },
    include: { game: true },
  })

  return Response.json({
    oldData: toUserGameShape(existing),
    newData: toUserGameShape(updated),
    error: null,
  } satisfies MutationResponse<UserGame>)
}
