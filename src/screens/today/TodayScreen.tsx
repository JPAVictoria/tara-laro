import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TL } from '@/constants/tl-theme'
import {
  Avatar,
  Stars,
  SectionLabel,
  ScoreBadge,
  tlCard,
  amberBtn,
  amberBtnText,
} from '@/components/tl-shared'
import { GameCover } from '@/components/game/GameCover'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useGames } from '@/modules/games'
import { useApiClient } from '@/hooks/use-api-client'
import { TodayPickSkeleton, FriendRowSkeleton } from '@/components/ui/Skeleton'
import type { Post, PaginatedResponse, UserGame, MutationResponse } from '@/types'

// ─── TodayHeader ───────────────────────────────────────────────────────────

function TodayHeader() {
  const { user } = useAuth()
  const router = useRouter()
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'there'

  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerDate}>{dateStr}</Text>
        <Text style={styles.headerGreeting}>Hey, {firstName}.</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push('/search')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18 }}>◎</Text>
        </TouchableOpacity>
        <Avatar name={firstName} size={38} ring />
      </View>
    </View>
  )
}

// ─── TodayPick ─────────────────────────────────────────────────────────────

function TodayPick() {
  const { games, isLoading } = useGames()
  const game = games[0] ?? null
  const { user: authUser } = useAuth()
  const apiClient = useApiClient()
  const queryClient = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleAddToLibrary() {
    if (!game || adding || added || !authUser) return
    setAdding(true)
    try {
      await apiClient.post<MutationResponse<UserGame>>('/api/library', {
        gameId: game.id,
        status: 'playing',
      })
      await queryClient.invalidateQueries({ queryKey: ['library'] })
      setAdded(true)
    } catch {
      Alert.alert('Error', 'Could not add to library. Try again.')
    } finally {
      setAdding(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.section}>
        <SectionLabel kicker="TODAY'S PICK" subtitle="Picked for you" />
        <TodayPickSkeleton />
      </View>
    )
  }

  if (!game) return null

  return (
    <View style={styles.section}>
      <SectionLabel kicker="TODAY'S PICK" subtitle="Top rated right now" />
      <View style={[tlCard, styles.pickCard]}>
        <View style={styles.pickCoverWrap}>
          <GameCover id={game.id} coverUrl={game.coverUrl} w="100%" h={230} radius={0} flat />
          <View style={styles.pickGradient} />
        </View>

        <View style={styles.pickMeta}>
          <View style={styles.pickMetaLeft}>
            <ScoreBadge value={Math.round(game.avgRating * 10)} />
            <View style={{ gap: 1 }}>
              <Text style={styles.pickTitle}>{game.title}</Text>
              <Text style={styles.pickStudio}>{game.genre.slice(0, 2).join(' · ')}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[amberBtn, (adding || added) && { opacity: 0.7 }]}
            onPress={handleAddToLibrary}
            activeOpacity={0.7}
            disabled={adding || added}
          >
            <Text style={amberBtnText}>
              {adding ? '…' : added ? '✓ Added' : '+ Library'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hairline} />

        {game.description ? (
          <View style={styles.pickQuote}>
            <Text style={styles.pickQuoteText} numberOfLines={3}>
              "{game.description}"
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

// ─── No Library placeholder ────────────────────────────────────────────────

function TodayContinuePlaceholder() {
  const router = useRouter()
  return (
    <View style={styles.section}>
      <SectionLabel kicker="PICK UP WHERE YOU LEFT OFF" />
      <View style={[tlCard, styles.emptyCard]}>
        <Text style={styles.emptyEmoji}>🎮</Text>
        <Text style={styles.emptyTitle}>Your library is empty</Text>
        <Text style={styles.emptyBody}>Add games from Discover to start tracking your play sessions.</Text>
        <TouchableOpacity
          style={[amberBtn, { marginTop: 12 }]}
          onPress={() => router.push('/discover')}
          activeOpacity={0.7}
        >
          <Text style={amberBtnText}>Browse Discover</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Friend activity from real posts ──────────────────────────────────────

function PostActivityRow({ post }: { post: Post }) {
  const router = useRouter()
  return (
    <TouchableOpacity
      style={styles.friendRow}
      onPress={() => router.push(`/posts/${post.id}`)}
      activeOpacity={0.7}
    >
      <Avatar name={post.user.displayName} size={34} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{post.user.displayName}</Text>
        <Text style={styles.friendVerb} numberOfLines={1}>
          {post.game
            ? <Text>posted about <Text style={styles.friendGame}>{post.game.title}</Text></Text>
            : post.content
          }
        </Text>
      </View>
      {post.game && (
        <GameCover id={post.game.id} coverUrl={post.game.coverUrl} w={38} h={50} radius={TL.radiusXs} />
      )}
    </TouchableOpacity>
  )
}

function TodayFriends() {
  const router = useRouter()
  const apiClient = useApiClient()
  const { user: authUser } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['feed', 'today'],
    queryFn: () => apiClient.get<PaginatedResponse<Post>>('/api/posts'),
    enabled: !!authUser,
  })

  const posts = data?.data?.slice(0, 3) ?? []

  if (isLoading) {
    return (
      <View style={styles.section}>
        <SectionLabel kicker="FROM YOUR CIRCLE" />
        <View style={tlCard}>
          <View style={styles.cardInner}>
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.hairline} />}
                <FriendRowSkeleton />
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    )
  }

  if (posts.length === 0) {
    return (
      <View style={styles.section}>
        <SectionLabel kicker="FROM YOUR CIRCLE" />
        <View style={[tlCard, styles.emptyCard]}>
          <Text style={styles.emptyEmoji}>👥</Text>
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptyBody}>Follow players to see what they're playing.</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.section}>
      <SectionLabel
        kicker="FROM YOUR CIRCLE"
        rightLink="See all"
        onPress={() => router.push('/notifications')}
      />
      <View style={tlCard}>
        <View style={styles.cardInner}>
          {posts.map((post, i) => (
            <React.Fragment key={post.id}>
              {i > 0 && <View style={styles.hairline} />}
              <PostActivityRow post={post} />
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  )
}

// ─── Create FAB ────────────────────────────────────────────────────────────

function CreateFAB() {
  const router = useRouter()
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push('/create')}
      activeOpacity={0.8}
    >
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  )
}

// ─── TodayScreen ───────────────────────────────────────────────────────────

export function TodayScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TodayHeader />
        <TodayPick />
        <TodayContinuePlaceholder />
        <TodayFriends />
      </ScrollView>
      <CreateFAB />
    </SafeAreaView>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  scroll: { flex: 1, backgroundColor: TL.bg },
  content: { paddingHorizontal: 16, paddingBottom: 100, gap: 8 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerDate: { fontSize: 12, color: TL.muted, fontWeight: '600', letterSpacing: 0.3 },
  headerGreeting: { fontSize: 28, fontWeight: '800', color: TL.ink, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TL.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: { marginTop: 20 },
  hairline: { height: 1, backgroundColor: TL.border, marginHorizontal: 14 },
  cardInner: { paddingVertical: 4 },

  pickLoadingCard: { height: 120, alignItems: 'center', justifyContent: 'center' },
  pickCard: { overflow: 'hidden' },
  pickCoverWrap: { width: '100%', height: 230, position: 'relative' },
  pickGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: 'rgba(20,16,10,0.7)',
  },
  pickMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 10,
  },
  pickMetaLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  pickTitle: { fontSize: 15, fontWeight: '700', color: TL.ink },
  pickStudio: { fontSize: 12, color: TL.muted },
  pickQuote: { paddingHorizontal: 14, paddingVertical: 12 },
  pickQuoteText: { fontSize: 13, color: TL.ink2, lineHeight: 19, fontStyle: 'italic' },

  emptyCard: { padding: 24, alignItems: 'center', gap: 6 },
  emptyEmoji: { fontSize: 32, marginBottom: 4 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: TL.ink },
  emptyBody: { fontSize: 13, color: TL.muted, textAlign: 'center', lineHeight: 19 },

  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  friendInfo: { flex: 1, gap: 2 },
  friendName: { fontSize: 13, fontWeight: '700', color: TL.ink },
  friendVerb: { fontSize: 12, color: TL.muted },
  friendGame: { color: TL.ink2, fontWeight: '600' },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TL.amber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TL.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { fontSize: 28, fontWeight: '700', color: '#fff', lineHeight: 32 },
})
