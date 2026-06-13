import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useRealtimePost(postId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!postId) return

    const channel = supabase
      .channel(`post:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Post',
          filter: `id=eq.${postId}`,
        },
        (payload) => {
          queryClient.setQueryData(['post', postId], (old: Record<string, unknown> | undefined) => {
            if (!old) return old
            return {
              ...old,
              likesCount: (payload.new as { likesCount?: number }).likesCount ?? old.likesCount,
              commentsCount: (payload.new as { commentsCount?: number }).commentsCount ?? old.commentsCount,
            }
          })
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Comment',
          filter: `postId=eq.${postId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ['post', postId] })
        },
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [postId, queryClient])
}
