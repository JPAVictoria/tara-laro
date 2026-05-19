import { View, Text, StyleSheet } from 'react-native'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  onPress?: () => void
  onLike?: () => void
  onComment?: () => void
}

export function PostCard({ post }: PostCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.username}>{post.user.username}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', marginBottom: 1, padding: 16 },
  username: { fontWeight: '600', color: '#111827', marginBottom: 4 },
  content: { color: '#374151', lineHeight: 20 },
})
