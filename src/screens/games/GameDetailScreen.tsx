import { View, Text, ScrollView, StyleSheet } from 'react-native'

interface GameDetailScreenProps {
  gameId: string
}

export function GameDetailScreen({ gameId: _gameId }: GameDetailScreenProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.cover} />
      <View style={styles.body}>
        <Text style={styles.title}>Game Title</Text>
        {/* Day 13: game details, RatingStars, reviews list, Write Review CTA */}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 80 },
  cover: { width: '100%', height: 260, backgroundColor: '#E5E7EB' },
  body: { padding: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 },
})
