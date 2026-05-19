import { View, FlatList, StyleSheet } from 'react-native'
import { FeedHeader } from '@/modules/feed'

export function FeedScreen() {
  return (
    <View style={styles.container}>
      <FeedHeader />
      <FlatList
        data={[]}
        keyExtractor={(item) => item}
        renderItem={() => null}
        contentContainerStyle={styles.list}
        /* Day 8-9: PostCard + pagination wired up */
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  list: { paddingBottom: 80 },
})
