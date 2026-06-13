import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import type { Post } from '@/types'
import { PostActions } from './PostActions'
import { formatRelativeTime } from '@/utils/format'

interface PostCardProps {
  post: Post
  onPress?: () => void
  onLike?: () => void
  onComment?: () => void
}

export function PostCard({ post, onPress, onLike, onComment }: PostCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {post.user.avatarUrl ? (
            <Image source={{ uri: post.user.avatarUrl }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <Text style={styles.avatarInitial}>{post.user.displayName.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.meta}>
          <Text style={styles.displayName}>{post.user.displayName}</Text>
          <Text style={styles.time}>{formatRelativeTime(post.createdAt)}</Text>
        </View>
      </View>

      {post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
          transition={200}
        />
      )}

      <View style={styles.body}>
        <Text style={styles.content}>{post.content}</Text>
        {post.game && (
          <View style={styles.gameTag}>
            <Text style={styles.gameTagText}>🎮 {post.game.title}</Text>
          </View>
        )}
      </View>

      <PostActions
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        isLiked={post.isLiked}
        onLike={onLike ?? (() => {})}
        onComment={onComment ?? (() => {})}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', marginBottom: 8, borderRadius: 0 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 40, height: 40 },
  avatarInitial: { fontSize: 16, fontWeight: '700', color: '#111827' },
  meta: { flex: 1 },
  displayName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  time: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  image: { width: '100%', height: 300, backgroundColor: '#F3F4F6' },
  body: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4 },
  content: { fontSize: 14, color: '#374151', lineHeight: 20 },
  gameTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#FEF08A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gameTagText: { fontSize: 12, fontWeight: '600', color: '#92400E' },
})
