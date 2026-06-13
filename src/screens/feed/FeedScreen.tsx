import { memo, useCallback } from 'react'
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { FeedHeader, PostCard, useFeed } from '@/modules/feed'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Post } from '@/types'

const POST_ITEM_HEIGHT = 420

const MemoPostCard = memo(PostCard)

export function FeedScreen() {
  const { posts, isLoading, isRefreshing, hasMore, fetchNextPage, refresh } = useFeed()
  const router = useRouter()

  const renderItem = useCallback(({ item }: { item: Post }) => (
    <MemoPostCard post={item} onPress={() => router.push(`/posts/${item.id}`)} />
  ), [router])

  const keyExtractor = useCallback((item: Post) => item.id, [])

  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: POST_ITEM_HEIGHT,
    offset: POST_ITEM_HEIGHT * index,
    index,
  }), [])

  return (
    <View style={styles.container}>
      <FeedHeader />
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={posts.length === 0 ? styles.empty : styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="Nothing in your feed yet"
              message="Follow some gamers or explore games to see posts"
              actionLabel="Explore Games"
              onAction={() => router.push('/(tabs)/discover')}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#FACC15"
          />
        }
        onEndReached={hasMore ? fetchNextPage : undefined}
        onEndReachedThreshold={0.5}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  list: { paddingBottom: 80 },
  empty: { flex: 1 },
})
