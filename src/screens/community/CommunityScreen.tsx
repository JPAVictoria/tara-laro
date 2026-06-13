import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { TL } from '@/constants/tl-theme'
import { Avatar, SectionLabel, tlCard } from '@/components/tl-shared'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useApiClient } from '@/hooks/use-api-client'
import type { Post, PaginatedResponse } from '@/types'

// ─── Featured topics (genre filters) ────────────────────────────────────────

const TOPICS = [
  { id: 'cozy', name: 'Cozy Games', emoji: '🌿', genre: 'Simulation', bgColor: TL.amberSoft },
  { id: 'soulslike', name: 'Souls-like', emoji: '⚔️', genre: 'Souls-like', bgColor: '#1f4080' },
  { id: 'jrpg', name: 'JRPGs', emoji: '⚡', genre: 'JRPG', bgColor: '#8a4010' },
  { id: 'indie', name: 'Indie', emoji: '🛠', genre: 'Indie', bgColor: '#1a6030' },
]


// ─── CommunityHeader ─────────────────────────────────────────────────────────

function CommunityHeader() {
  const router = useRouter()
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerLabel}>Games · Reviews · Discussion</Text>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/search')}
        activeOpacity={0.7}
      >
        <Text style={styles.iconBtnText}>🔍</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─── Topic card ──────────────────────────────────────────────────────────────

function TopicCard({
  emoji,
  name,
  genre,
  bgColor,
}: {
  emoji: string
  name: string
  genre: string
  bgColor: string
}) {
  const router = useRouter()
  return (
    <TouchableOpacity
      style={[styles.groupCard, { backgroundColor: bgColor }]}
      onPress={() => router.push(`/discover?genre=${encodeURIComponent(genre)}`)}
      activeOpacity={0.7}
    >
      <Text style={styles.groupEmoji}>{emoji}</Text>
      <Text style={styles.groupName}>{name}</Text>
      <Text style={styles.groupMembers}>Browse →</Text>
    </TouchableOpacity>
  )
}

// ─── Topics grid ─────────────────────────────────────────────────────────────

function TopicsGrid() {
  return (
    <View style={styles.section}>
      <SectionLabel kicker="BROWSE BY TOPIC" />
      <View style={styles.groupsGrid}>
        {TOPICS.map((t) => (
          <TopicCard key={t.id} emoji={t.emoji} name={t.name} genre={t.genre} bgColor={t.bgColor} />
        ))}
      </View>
    </View>
  )
}

// ─── Thread row ──────────────────────────────────────────────────────────────

function ThreadRow({
  title,
  group,
  author,
  replies,
  likes,
  onPress,
}: {
  title: string
  group: string
  author: string
  replies: number
  likes: number
  onPress?: () => void
}) {
  return (
    <TouchableOpacity
      style={styles.threadRow}
      onPress={onPress ?? (() => Alert.alert(group, 'Thread detail coming soon.'))}
      activeOpacity={0.7}
    >
      <View style={styles.threadContent}>
        <View style={styles.threadMeta}>
          <Text style={styles.threadGroup}>{group}</Text>
          <Text style={styles.threadDot}>·</Text>
          <Text style={styles.threadAuthor}>{author}</Text>
        </View>
        <Text style={styles.threadTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.threadStats}>
          <Text style={styles.threadStat}>💬 {replies}</Text>
          <Text style={styles.threadStat}>♥ {likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Trending section — real posts ──────────────────────────────────────────

function TrendingSection() {
  const router = useRouter()
  const apiClient = useApiClient()
  const { user: authUser } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['community-feed'],
    queryFn: () => apiClient.get<PaginatedResponse<Post>>('/api/posts'),
    enabled: !!authUser,
  })

  const posts = data?.data?.slice(0, 5) ?? []

  if (isLoading) {
    return (
      <View style={styles.section}>
        <SectionLabel kicker="TRENDING TODAY" />
        <View style={[tlCard, styles.loadingCard]}>
          <ActivityIndicator color={TL.amber} />
        </View>
      </View>
    )
  }

  if (posts.length === 0) {
    return (
      <View style={styles.section}>
        <SectionLabel kicker="TRENDING TODAY" />
        <View style={[tlCard, styles.loadingCard]}>
          <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.section}>
      <SectionLabel kicker="TRENDING TODAY" />
      <View style={tlCard}>
        {posts.map((post, idx) => (
          <React.Fragment key={post.id}>
            {idx > 0 && <View style={styles.hairline} />}
            <ThreadRow
              title={post.content}
              group={post.game?.title ?? 'General'}
              author={post.user.displayName}
              replies={post.commentsCount}
              likes={post.likesCount}
              onPress={() => router.push(`/posts/${post.id}`)}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}

// ─── Composer pill ───────────────────────────────────────────────────────────

function ComposerPill() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const displayName =
    (authUser?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    authUser?.email?.split('@')[0] ??
    'You'
  return (
    <TouchableOpacity
      style={styles.composerPill}
      onPress={() => router.push('/create')}
      activeOpacity={0.7}
    >
      <Avatar name={displayName} size={34} />
      <Text style={styles.composerPlaceholder} numberOfLines={1}>
        What are you playing tonight?
      </Text>
      <View style={styles.composerBtn}>
        <Text style={styles.composerBtnText}>+</Text>
      </View>
    </TouchableOpacity>
  )
}

// ─── CommunityScreen ─────────────────────────────────────────────────────────

export function CommunityScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CommunityHeader />
        <ComposerPill />
        <TopicsGrid />
        <TrendingSection />
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: TL.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: TL.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerLabel: {
    fontSize: 12,
    color: TL.muted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: TL.ink,
    marginTop: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TL.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 18,
    color: TL.muted,
  },

  // Composer
  composerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TL.surface,
    borderRadius: TL.radius,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: TL.border,
  },
  composerPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: TL.muted,
  },
  composerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: TL.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },

  // Groups grid
  section: {
    marginTop: 16,
  },
  groupsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  groupCard: {
    width: '47%',
    borderRadius: TL.radiusSm,
    padding: 14,
    position: 'relative',
    minHeight: 100,
    justifyContent: 'flex-end',
  },
  groupBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: TL.amber,
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  groupBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  groupEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '800',
    color: TL.ink,
  },
  groupMembers: {
    fontSize: 11,
    color: TL.ink2,
    opacity: 0.7,
    marginTop: 2,
  },

  // Loading / empty
  loadingCard: { padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, color: TL.muted, textAlign: 'center' },

  // Threads
  hairline: {
    height: 1,
    backgroundColor: TL.border,
    marginHorizontal: 14,
  },
  threadRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  threadContent: {
    gap: 4,
  },
  threadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  threadGroup: {
    fontSize: 10,
    fontWeight: '700',
    color: TL.amber,
    letterSpacing: 0.5,
  },
  threadDot: {
    fontSize: 10,
    color: TL.faint,
  },
  threadAuthor: {
    fontSize: 10,
    color: TL.muted,
  },
  threadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TL.ink,
    lineHeight: 19,
  },
  threadStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  threadStat: {
    fontSize: 11,
    color: TL.muted,
  },
})
