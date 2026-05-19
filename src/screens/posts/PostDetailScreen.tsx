import { View, Text, FlatList, StyleSheet } from 'react-native'

interface PostDetailScreenProps {
  postId: string
}

export function PostDetailScreen({ postId: _postId }: PostDetailScreenProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item) => item}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.post}>
            <Text style={styles.placeholder}>Post content</Text>
            {/* Day 10: full PostCard + PostActions */}
          </View>
        }
        /* Comments list below */
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  post: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  placeholder: { padding: 16, color: '#6B7280' },
})
