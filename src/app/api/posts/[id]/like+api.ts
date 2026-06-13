import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { MutationResponse } from '@/types'

interface LikeResult {
  postId: string
  liked: boolean
  likesCount: number
}

export async function POST(request: Request, context?: { params?: { id: string } }): Promise<Response> {
  const id = context?.params?.id
  if (!id) return Response.json({ oldData: null, newData: null, error: 'Missing post ID' }, { status: 400 })

  const authUser = await getRequestUser(request)
  if (!authUser) {
    return Response.json({ oldData: null, newData: null, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (!dbUser) {
    return Response.json({ oldData: null, newData: null, error: 'User not found' }, { status: 404 })
  }

  const post = await prisma.post.findUnique({ where: { id, deleted: false } })
  if (!post) {
    return Response.json({ oldData: null, newData: null, error: 'Post not found' }, { status: 404 })
  }

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: id, userId: dbUser.id } },
  })

  if (existing) {
    await prisma.$transaction([
      prisma.like.delete({ where: { postId_userId: { postId: id, userId: dbUser.id } } }),
      prisma.post.update({ where: { id }, data: { likesCount: { decrement: 1 } } }),
    ])
    const updated = await prisma.post.findUnique({ where: { id }, select: { likesCount: true } })
    const result: LikeResult = { postId: id, liked: false, likesCount: updated?.likesCount ?? 0 }
    return Response.json({ oldData: { ...result, liked: true }, newData: result, error: null } satisfies MutationResponse<LikeResult>)
  }

  await prisma.$transaction([
    prisma.like.create({ data: { postId: id, userId: dbUser.id } }),
    prisma.post.update({ where: { id }, data: { likesCount: { increment: 1 } } }),
  ])
  const updated = await prisma.post.findUnique({ where: { id }, select: { likesCount: true } })
  const result: LikeResult = { postId: id, liked: true, likesCount: updated?.likesCount ?? 0 }
  return Response.json({ oldData: { ...result, liked: false }, newData: result, error: null } satisfies MutationResponse<LikeResult>)
}
