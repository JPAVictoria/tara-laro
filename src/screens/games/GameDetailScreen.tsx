import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useGame } from '@/modules/games'
import { RatingStars } from '@/modules/games'
import { ReviewCard } from '@/modules/reviews'

interface GameDetailScreenProps {
  gameId: string
}

export function GameDetailScreen({ gameId }: GameDetailScreenProps) {
  const { game, reviews, isLoading } = useGame(gameId)
  const router = useRouter()

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FACC15" size="large" />
      </View>
    )
  }

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Game not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.cover}>
        {game.coverUrl ? (
          <Image
            source={{ uri: game.coverUrl }}
            style={styles.coverImg}
            contentFit="cover"
            placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
            transition={300}
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
        <View style={styles.coverOverlay} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{game.title}</Text>
            {game.releaseDate && (
              <Text style={styles.releaseDate}>{new Date(game.releaseDate).getFullYear()}</Text>
            )}
          </View>
          <View style={styles.ratingBlock}>
            <Text style={styles.ratingNumber}>{game.avgRating.toFixed(1)}</Text>
            <RatingStars rating={game.avgRating} size={14} />
          </View>
        </View>

        <View style={styles.genreRow}>
          {game.genre.map((g) => (
            <View key={g} style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{g}</Text>
            </View>
          ))}
        </View>

        {game.description && (
          <Text style={styles.description}>{game.description}</Text>
        )}

        <View style={styles.divider} />

        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>Top Reviews</Text>
          <TouchableOpacity onPress={() => router.push(`/games/${gameId}/reviews`)}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}

        <TouchableOpacity
          style={styles.writeReviewBtn}
          onPress={() => router.push(`/games/${gameId}/write-review`)}
        >
          <Text style={styles.writeReviewText}>✍️ Write a Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', padding: 40 },
  notFound: { fontSize: 16, color: '#6B7280' },
  cover: { width: '100%', height: 260, position: 'relative' },
  coverImg: { width: '100%', height: 260 },
  coverPlaceholder: { width: '100%', height: 260, backgroundColor: '#E5E7EB' },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  body: { padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  titleBlock: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  releaseDate: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  ratingBlock: { alignItems: 'center', gap: 4 },
  ratingNumber: { fontSize: 22, fontWeight: '800', color: '#FACC15' },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  genreBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  genreBadgeText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  description: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginTop: 14 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB', marginVertical: 20 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewsTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  seeAll: { fontSize: 14, color: '#CA8A04', fontWeight: '600' },
  noReviews: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingVertical: 16 },
  writeReviewBtn: {
    marginTop: 16,
    backgroundColor: '#FACC15',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  writeReviewText: { fontSize: 16, fontWeight: '700', color: '#111827' },
})
