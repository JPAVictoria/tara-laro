import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import type { Post } from '@/types'

const CELL_SIZE = (Dimensions.get('window').width - 3) / 3

interface PostGridProps {
  posts: Post[]
  onPostPress?: (post: Post) => void
}

export function PostGrid({ posts, onPostPress }: PostGridProps) {
  return (
    <View style={styles.grid}>
      {posts.map((post) => (
        <TouchableOpacity key={post.id} style={styles.cell} onPress={() => onPostPress?.(post)} activeOpacity={0.85}>
          <View style={styles.image} />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 1.5 },
  cell: { width: CELL_SIZE, height: CELL_SIZE },
  image: { flex: 1, backgroundColor: '#E5E7EB' },
})
