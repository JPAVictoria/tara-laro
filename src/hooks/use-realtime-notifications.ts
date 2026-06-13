import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useRealtimeNotifications(userId: string | null) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notification',
          filter: `userId=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [userId, queryClient])
}
