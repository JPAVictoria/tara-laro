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

export async function GET(request: Request): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ data: [], error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status') ?? undefined
  const limit = Number(url.searchParams.get('limit') ?? '50')

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) return Response.json({ data: [], error: null })

  const entries = await prisma.userGame.findMany({
    where: {
      userId: dbUser.id,
      ...(status ? { status } : {}),
    },
    include: { game: true },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  })

  return Response.json({ data: entries.map(toUserGameShape), error: null })
}

export async function POST(request: Request): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { gameId, status = 'playing', progress = 0 } = await request.json() as {
    gameId: string
    status?: string
    progress?: number
  }

  if (!gameId) {
    return Response.json({ oldData: null, newData: null, error: 'gameId is required' }, { status: 400 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }

  const existing = await prisma.userGame.findUnique({
    where: { userId_gameId: { userId: dbUser.id, gameId } },
    include: { game: true },
  })

  const entry = await prisma.userGame.upsert({
    where: { userId_gameId: { userId: dbUser.id, gameId } },
    create: { userId: dbUser.id, gameId, status, progress },
    update: { status, progress },
    include: { game: true },
  })

  return Response.json({
    oldData: existing ? toUserGameShape(existing) : null,
    newData: toUserGameShape(entry),
    error: null,
  } satisfies MutationResponse<UserGame>)
}
