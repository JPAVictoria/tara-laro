import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { formatCount } from '@/utils/format'

interface PostActionsProps {
  likesCount: number
  commentsCount: number
  isLiked: boolean
  onLike: () => void
  onComment: () => void
  onShare?: () => void
}

export function PostActions({ likesCount, commentsCount, isLiked, onLike, onComment }: PostActionsProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.action} onPress={onLike}>
        <Text style={[styles.icon, isLiked && styles.liked]}>♥</Text>
        <Text style={styles.count}>{formatCount(likesCount)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={onComment}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{formatCount(commentsCount)}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingVertical: 8 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon: { fontSize: 20, color: '#6B7280' },
  liked: { color: '#FACC15' },
  count: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
})
