import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { Comment, MutationResponse } from '@/types'

export async function POST(request: Request, context?: { params?: { id: string } }): Promise<Response> {
  const id = context?.params?.id ?? new URL(request.url).pathname.split('/').at(-2)
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

  const { content } = await request.json() as { content: string }
  if (!content?.trim()) {
    return Response.json({ oldData: null, newData: null, error: 'Content is required' }, { status: 400 })
  }

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: { postId: id, userId: dbUser.id, content: content.trim() },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    }),
    prisma.post.update({ where: { id }, data: { commentsCount: { increment: 1 } } }),
  ])

  const result: Comment = {
    id: comment.id,
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    user: comment.user,
    createdAt: comment.createdAt.toISOString(),
  }

  return Response.json({ oldData: null, newData: result, error: null } satisfies MutationResponse<Comment>)
}
