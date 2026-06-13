import { memo } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import type { Post } from '@/types'

const CELL_SIZE = (Dimensions.get('window').width - 3) / 3

interface PostGridProps {
  posts: Post[]
  onPostPress?: (post: Post) => void
}

export const PostGrid = memo(function PostGrid({ posts, onPostPress }: PostGridProps) {
  return (
    <View style={styles.grid}>
      {posts.map((post) => (
        <TouchableOpacity key={post.id} style={styles.cell} onPress={() => onPostPress?.(post)} activeOpacity={0.85}>
          {post.images[0] ? (
            <Image
              source={{ uri: post.images[0] }}
              style={styles.image}
              contentFit="cover"
              placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
              recyclingKey={post.id}
              transition={150}
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 1.5 },
  cell: { width: CELL_SIZE, height: CELL_SIZE },
  image: { flex: 1 },
  imagePlaceholder: { backgroundColor: '#E5E7EB' },
})
