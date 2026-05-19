import { View, Text, StyleSheet } from 'react-native'
import type { Review } from '@/types'
import { formatRelativeTime } from '@/utils/format'
import { RatingStars } from '@/modules/games'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.meta}>
          <Text style={styles.username}>{review.user.username}</Text>
          <Text style={styles.time}>{formatRelativeTime(review.createdAt)}</Text>
        </View>
        <RatingStars rating={review.rating} size={14} />
      </View>
      <Text style={styles.content}>{review.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5E7EB' },
  meta: { flex: 1 },
  username: { fontSize: 14, fontWeight: '600', color: '#111827' },
  time: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  content: { fontSize: 14, color: '#374151', lineHeight: 22 },
})
