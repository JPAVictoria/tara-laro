import { useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NotificationItem, useNotifications, useMarkNotificationsRead } from '@/modules/notifications'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'

export function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, isRefreshing, hasMore, fetchNextPage, refresh } = useNotifications()
  const { mutate: markRead } = useMarkNotificationsRead()
  const { user } = useAuth()
  useRealtimeNotifications(user?.id ?? null)

  useEffect(() => {
    if (unreadCount > 0) {
      const timer = setTimeout(() => markRead(), 2000)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={notifications.length === 0 ? styles.empty : styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="No notifications yet"
              message="You'll see likes, comments, and follows here"
            />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor="#FACC15" />
        }
        onEndReached={hasMore ? fetchNextPage : undefined}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  heading: { fontSize: 20, fontWeight: '700', color: '#111827' },
  badge: {
    backgroundColor: '#FACC15',
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#111827' },
  list: { paddingBottom: 80 },
  empty: { flex: 1 },
})
