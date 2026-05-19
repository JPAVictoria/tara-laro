import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { Notification } from '@/types'
import { formatRelativeTime } from '@/utils/format'

const typeLabel: Record<Notification['type'], string> = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
  review: 'reviewed a game you follow',
}

interface NotificationItemProps {
  notification: Notification
  onPress?: () => void
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !notification.read && styles.unread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.text}>
          <Text style={styles.bold}>{String((notification.data as Record<string, unknown>).username ?? '')}</Text>
          {` ${typeLabel[notification.type]}`}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
      </View>
      {!notification.read && <View style={styles.dot} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  unread: { backgroundColor: '#FEFCE8' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB', flexShrink: 0 },
  body: { flex: 1 },
  text: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bold: { fontWeight: '600', color: '#111827' },
  time: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FACC15' },
})
