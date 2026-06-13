import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import type { PaginatedResponse, Post } from '@/types'

async function fetchFeedPage(cursor?: string): Promise<PaginatedResponse<Post>> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  const path = cursor ? `/api/posts?cursor=${cursor}` : '/api/posts'
  return api.get<PaginatedResponse<Post>>(path, token ? { Authorization: `Bearer ${token}` } : {})
}

export function useFeed() {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })

  const posts = query.data?.pages.flatMap((p) => p.data) ?? []

  return {
    posts,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    fetchNextPage: () => { void query.fetchNextPage() },
    refresh: () => { void query.refetch() },
  }
}
