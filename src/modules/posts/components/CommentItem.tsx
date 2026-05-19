import { View, Text, StyleSheet } from 'react-native'
import type { Comment } from '@/types'
import { formatRelativeTime } from '@/utils/format'

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.username}>{comment.user.username}</Text>
        <Text style={styles.content}>{comment.content}</Text>
        <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, paddingVertical: 10, paddingHorizontal: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', flexShrink: 0 },
  body: { flex: 1 },
  username: { fontSize: 13, fontWeight: '600', color: '#111827' },
  content: { fontSize: 14, color: '#374151', marginTop: 2, lineHeight: 20 },
  time: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
})
