import { prisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/supabase-server'
import type { Post, Comment, ApiResponse } from '@/types'

interface PostWithComments extends Post {
  comments: Comment[]
}

export async function GET(request: Request, context?: { params?: { id: string } }): Promise<Response> {
  const id = context?.params?.id
  if (!id) return Response.json({ data: null, error: 'Missing post ID' }, { status: 400 })

  const user = await getRequestUser(request)
  if (!user) {
    return Response.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })

  const post = await prisma.post.findUnique({
    where: { id, deleted: false },
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      game: { select: { id: true, title: true, coverUrl: true } },
      likes: dbUser ? { where: { userId: dbUser.id }, select: { id: true } } : false,
      comments: {
        where: { deleted: false },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!post) {
    return Response.json({ data: null, error: 'Post not found' }, { status: 404 })
  }

  const result: PostWithComments = {
    id: post.id,
    userId: post.userId,
    gameId: post.gameId,
    content: post.content,
    images: post.images,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
    user: post.user,
    game: post.game,
    createdAt: post.createdAt.toISOString(),
    comments: post.comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      userId: c.userId,
      content: c.content,
      user: c.user,
      createdAt: c.createdAt.toISOString(),
    })),
  }

  return Response.json({ data: result, error: null } satisfies ApiResponse<PostWithComments>)
}
