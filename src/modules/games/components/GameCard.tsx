import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { Game } from '@/types'
import { formatRating } from '@/utils/format'

interface GameCardProps {
  game: Game
  onPress?: () => void
}

export function GameCard({ game, onPress }: GameCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cover} />
      <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
      <Text style={styles.rating}>★ {formatRating(game.avgRating)}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { width: 140, marginRight: 12 },
  cover: { width: 140, height: 190, borderRadius: 10, backgroundColor: '#E5E7EB', marginBottom: 8 },
  title: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 2 },
  rating: { fontSize: 12, color: '#CA8A04', fontWeight: '500' },
})
