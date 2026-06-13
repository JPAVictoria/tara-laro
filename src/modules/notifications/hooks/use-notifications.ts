import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import type { Notification, PaginatedResponse } from '@/types'

async function getToken(): Promise<string | undefined> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export function useNotifications() {
  const query = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam }) => {
      const token = await getToken()
      const path = pageParam ? `/api/notifications?cursor=${pageParam}` : '/api/notifications'
      return api.get<PaginatedResponse<Notification>>(path, token ? { Authorization: `Bearer ${token}` } : {})
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })

  const notifications = query.data?.pages.flatMap((p) => p.data) ?? []
  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    fetchNextPage: () => { void query.fetchNextPage() },
    refresh: () => { void query.refetch() },
  }
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids?: string[]) => {
      const token = await getToken()
      return api.patch('/api/notifications', { ids }, token ? { Authorization: `Bearer ${token}` } : {})
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
