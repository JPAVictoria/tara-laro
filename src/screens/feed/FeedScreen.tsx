import { View, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { FeedHeader, PostCard, useFeed } from '@/modules/feed'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Post } from '@/types'

export function FeedScreen() {
  const { posts, isLoading, isRefreshing, hasMore, fetchNextPage, refresh } = useFeed()
  const router = useRouter()

  function handlePostPress(post: Post) {
    router.push(`/posts/${post.id}`)
  }

  return (
    <View style={styles.container}>
      <FeedHeader />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => handlePostPress(item)}
          />
        )}
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
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  list: { paddingBottom: 80 },
  empty: { flex: 1 },
})
