import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { Notification, PaginatedResponse, MutationResponse } from '@/types'

function toNotification(n: {
  id: string
  userId: string
  type: string
  data: unknown
  read: boolean
  createdAt: Date
}): Notification {
  return {
    id: n.id,
    userId: n.userId,
    type: n.type as Notification['type'],
    data: n.data as Record<string, unknown>,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }
}

export async function GET(request: Request): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) {
    return Response.json({ data: [], nextCursor: null, hasMore: false } satisfies PaginatedResponse<Notification>)
  }

  const url = new URL(request.url)
  const cursor = url.searchParams.get('cursor') ?? undefined
  const limit = 30

  const notifications = await prisma.notification.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = notifications.length > limit
  if (hasMore) notifications.pop()

  return Response.json({
    data: notifications.map(toNotification),
    nextCursor: hasMore && notifications.length > 0 ? notifications[notifications.length - 1]!.id : null,
    hasMore,
  } satisfies PaginatedResponse<Notification>)
}

export async function PATCH(request: Request): Promise<Response> {
  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }

  const { ids } = await request.json() as { ids?: string[] }

  await prisma.notification.updateMany({
    where: {
      userId: dbUser.id,
      ...(ids?.length ? { id: { in: ids } } : {}),
    },
    data: { read: true },
  })

  return Response.json({ oldData: null, newData: { read: true }, error: null } satisfies MutationResponse<{ read: boolean }>)
}
