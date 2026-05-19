import { View, Text, StyleSheet } from 'react-native'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
}

export function RatingStars({ rating, maxRating = 5, size = 16 }: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i + 1 <= Math.round(rating)
        return (
          <Text key={i} style={[styles.star, { fontSize: size }, filled ? styles.filled : styles.empty]}>
            ★
          </Text>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  star: { lineHeight: 20 },
  filled: { color: '#FACC15' },
  empty: { color: '#E5E7EB' },
})
