import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { MutationResponse } from '@/types'

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
