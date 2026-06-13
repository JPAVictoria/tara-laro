import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'
import type { Game, Review, ApiResponse, PaginatedResponse } from '@/types'

interface GameDetail extends Game {
  reviews: Review[]
  reviewsCount: number
}

export function useGame(id: string) {
  const query = useQuery({
    queryKey: ['game', id],
    queryFn: () => api.get<ApiResponse<GameDetail>>(`/api/games/${id}`),
    enabled: !!id,
  })

  return {
    game: query.data?.data ?? null,
    reviews: query.data?.data?.reviews ?? [],
    isLoading: query.isLoading,
  }
}

export function useGames(options?: { genre?: string; search?: string }) {
  const query = useInfiniteQuery({
    queryKey: ['games', options],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams()
      if (pageParam) params.set('cursor', pageParam as string)
      if (options?.genre) params.set('genre', options.genre)
      if (options?.search) params.set('search', options.search)
      const qs = params.toString()
      return api.get<PaginatedResponse<Game>>(`/api/games${qs ? `?${qs}` : ''}`)
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })

  const games = query.data?.pages.flatMap((p) => p.data) ?? []

  return {
    games,
    isLoading: query.isLoading,
    hasMore: query.hasNextPage ?? false,
    fetchNextPage: () => { void query.fetchNextPage() },
  }
}
