import { useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { ReviewCard } from '@/modules/reviews'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Review, PaginatedResponse } from '@/types'

type SortOrder = 'newest' | 'highest'

export default function GameReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [sort, setSort] = useState<SortOrder>('newest')

  const query = useInfiniteQuery({
    queryKey: ['game-reviews', id, sort],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({ sort })
      if (pageParam) params.set('cursor', pageParam as string)
      return api.get<PaginatedResponse<Review>>(`/api/games/${id}/reviews?${params.toString()}`)
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })

  const reviews = query.data?.pages.flatMap((p) => p.data) ?? []

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.sortRow}>
        {(['newest', 'highest'] as SortOrder[]).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sortChip, sort === s && styles.sortChipActive]}
            onPress={() => setSort(s)}
          >
            <Text style={[styles.sortChipText, sort === s && styles.sortChipTextActive]}>
              {s === 'newest' ? 'Newest' : 'Highest Rated'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {query.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FACC15" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewCard review={item} />}
          ListEmptyComponent={
            <EmptyState
              title="No reviews yet"
              message="Be the first to review this game"
              actionLabel="Write a Review"
              onAction={() => router.push(`/games/${id}/write-review`)}
            />
          }
          onEndReached={query.hasNextPage ? () => { void query.fetchNextPage() } : undefined}
          onEndReachedThreshold={0.5}
          contentContainerStyle={reviews.length === 0 ? { flex: 1 } : styles.listContent}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: '#111827' },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#111827' },
  spacer: { width: 30 },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  sortChipActive: { backgroundColor: '#FACC15' },
  sortChipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  sortChipTextActive: { color: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: 80 },
})
