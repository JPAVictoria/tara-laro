import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useGame, useGames } from '@/modules/games'
import { RatingStars, GameCard } from '@/modules/games'
import { ReviewCard } from '@/modules/reviews'
import { GameDetailSkeleton } from '@/components/ui/Skeleton'
import { TL } from '@/constants/tl-theme'

interface GameDetailScreenProps {
  gameId: string
}

function RelatedGames({ genre, currentId }: { genre: string; currentId: string }) {
  const router = useRouter()
  const { games } = useGames({ genre })
  const related = games.filter((g) => g.id !== currentId).slice(0, 8)
  if (related.length === 0) return null
  return (
    <View style={styles.relatedSection}>
      <Text style={styles.reviewsTitle}>More like this</Text>
      <FlatList
        horizontal
        data={related}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard game={item} onPress={() => router.push(`/games/${item.id}`)} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  )
}

export function GameDetailScreen({ gameId }: GameDetailScreenProps) {
  const { game, reviews, isLoading } = useGame(gameId)
  const router = useRouter()

  if (isLoading) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GameDetailSkeleton />
      </ScrollView>
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
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>?</Text>
          </View>
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
          activeOpacity={0.7}
        >
          <Text style={styles.writeReviewText}>✍️ Write a Review</Text>
        </TouchableOpacity>

        {game.genre[0] && (
          <RelatedGames genre={game.genre[0]} currentId={gameId} />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: TL.bg },
  content: { paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: TL.bg, padding: 40 },
  notFound: { fontSize: 16, color: TL.muted },
  cover: { width: '100%', height: 260, position: 'relative' },
  coverImg: { width: '100%', height: 260 },
  coverPlaceholder: {
    width: '100%',
    height: 260,
    backgroundColor: TL.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: { fontSize: 48, color: TL.muted },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(20,16,10,0.7)',
  },
  body: { padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  titleBlock: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: TL.ink },
  releaseDate: { fontSize: 13, color: TL.muted, marginTop: 2 },
  ratingBlock: { alignItems: 'center', gap: 4 },
  ratingNumber: { fontSize: 22, fontWeight: '800', color: TL.amber },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  genreBadge: {
    backgroundColor: TL.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: TL.border,
  },
  genreBadgeText: { fontSize: 12, fontWeight: '600', color: TL.ink2 },
  description: { fontSize: 14, color: TL.ink2, lineHeight: 22, marginTop: 14 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: TL.border, marginVertical: 20 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewsTitle: { fontSize: 18, fontWeight: '700', color: TL.ink },
  seeAll: { fontSize: 14, color: TL.amber, fontWeight: '600' },
  noReviews: { fontSize: 14, color: TL.muted, textAlign: 'center', paddingVertical: 16 },
  relatedSection: { marginTop: 24 },
  writeReviewBtn: {
    marginTop: 16,
    backgroundColor: TL.amber,
    borderRadius: TL.radius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  writeReviewText: { fontSize: 16, fontWeight: '700', color: TL.bg },
})
