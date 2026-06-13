import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import type { Game } from '@/types'
import { formatRating } from '@/utils/format'
import { TL } from '@/constants/tl-theme'

interface GameCardProps {
  game: Game
  onPress?: () => void
}

export function GameCard({ game, onPress }: GameCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {game.coverUrl ? (
        <Image
          source={{ uri: game.coverUrl }}
          style={styles.cover}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
          transition={200}
        />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Text style={styles.coverQ}>?</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
      <Text style={styles.rating}>★ {formatRating(game.avgRating)}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { width: 140, marginRight: 12 },
  cover: { width: 140, height: 190, borderRadius: 10, marginBottom: 8 },
  coverFallback: { backgroundColor: TL.surface2, alignItems: 'center', justifyContent: 'center' },
  coverQ: { fontSize: 32, color: TL.muted },
  title: { fontSize: 13, fontWeight: '600', color: TL.ink, marginBottom: 2 },
  rating: { fontSize: 12, color: TL.amber, fontWeight: '500' },
})
