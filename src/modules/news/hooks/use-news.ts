import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'
import type { NewsArticle, ApiResponse } from '@/types'

export function useNews() {
  const query = useQuery({
    queryKey: ['news'],
    queryFn: () => api.get<ApiResponse<NewsArticle[]>>('/api/news'),
    staleTime: 5 * 60 * 1000,
  })

  return {
    articles: query.data?.data ?? [],
    isLoading: query.isLoading,
  }
}
