import React from 'react'
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
import { FontAwesome5 } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { TL } from '@/constants/tl-theme'
import {
  SectionLabel,
  ScoreBadge,
  tlCard,
  amberBtn,
  amberBtnText,
} from '@/components/tl-shared'
import { GameCover } from '@/components/game/GameCover'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useApiClient } from '@/hooks/use-api-client'
import {
  ProfileSkeleton,
  StatsSkeleton,
  EntryTilesSkeleton,
} from '@/components/ui/Skeleton'
import type { User, UserGame } from '@/types'

// ─── Profile avatar ──────────────────────────────────────────────────────────

function ProfileAvatar({ initials }: { initials: string }) {
  return (
    <View style={styles.avatarWrap}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
      <View style={styles.levelBadge}>
        <Text style={styles.levelBadgeText}>LVL 1</Text>
      </View>
    </View>
  )
}

// ─── Identity block ──────────────────────────────────────────────────────────

function IdentityBlock({ profile }: { profile: User | null }) {
  const router = useRouter()
  const initials = profile
    ? profile.displayName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <View style={styles.identityBlock}>
      <ProfileAvatar initials={initials} />
      <Text style={styles.displayName}>{profile?.displayName ?? '—'}</Text>
      <Text style={styles.handle}>
        @{profile?.username ?? '…'}
      </Text>
      {profile?.bio ? (
        <Text style={styles.bio}>{profile.bio}</Text>
      ) : null}
      <View style={styles.identityActions}>
        <TouchableOpacity
          style={[amberBtn, { flex: 1 }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <Text style={amberBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Stats row ────────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function StatsRow({ profile }: { profile: User | null }) {
  return (
    <View style={[tlCard, styles.statsRow]}>
      <StatItem value={profile?.postsCount ?? 0} label="Posts" />
      <View style={styles.statDivider} />
      <StatItem value={profile?.followersCount ?? 0} label="Followers" />
      <View style={styles.statDivider} />
      <StatItem value={profile?.followingCount ?? 0} label="Following" />
    </View>
  )
}

// ─── Entry tile ───────────────────────────────────────────────────────────────

function EntryTile({
  icon,
  label,
  count,
  badge,
  accent,
  onPress,
}: {
  icon: string
  label: string
  count: string
  badge?: string
  accent?: boolean
  onPress?: () => void
}) {
  return (
    <TouchableOpacity
      style={[styles.entryTile, accent && styles.entryTileAccent]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.entryTileIcon}>{icon}</Text>
      <Text style={styles.entryTileLabel}>{label}</Text>
      <Text style={[styles.entryTileCount, accent && styles.entryTileCountAccent]}>{count}</Text>
      {badge && (
        <View style={styles.entryBadge}>
          <Text style={styles.entryBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

function EntryTiles({ profile }: { profile: User | null }) {
  const router = useRouter()
  return (
    <View style={styles.entryGrid}>
      <EntryTile
        icon="📚"
        label="Library"
        count="0 games"
        onPress={() => router.push('/discover')}
      />
      <EntryTile
        icon="✍️"
        label="Posts"
        count={`${profile?.postsCount ?? 0} written`}
        onPress={() => router.push('/discover')}
      />
      <EntryTile
        icon="📋"
        label="Lists"
        count="0 curated"
        onPress={() => Alert.alert('Coming soon', 'Lists are not available yet.')}
      />
      <EntryTile
        icon="👥"
        label="Following"
        count={String(profile?.followingCount ?? 0)}
        accent
        onPress={() => Alert.alert('Coming soon', 'Following feed is not available yet.')}
      />
    </View>
  )
}

// ─── Now Playing ─────────────────────────────────────────────────────────────

function NowPlaying() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const apiClient = useApiClient()

  const { data } = useQuery({
    queryKey: ['library', 'playing', 1],
    queryFn: () => apiClient.get<{ data: UserGame[] }>('/api/library?status=playing&limit=1').then(r => r.data),
    enabled: !!authUser,
  })

  const nowPlaying = data?.[0] ?? null
  if (!nowPlaying) return null

  return (
    <View style={styles.section}>
      <SectionLabel
        kicker="NOW PLAYING"
        rightLink="Library →"
        onPress={() => router.push('/discover')}
      />
      <TouchableOpacity
        style={[tlCard, styles.nowPlayingCard]}
        onPress={() => router.push(`/games/${nowPlaying.gameId}`)}
        activeOpacity={0.7}
      >
        <GameCover id={nowPlaying.gameId} coverUrl={nowPlaying.game.coverUrl} w={56} h={72} />
        <View style={styles.nowPlayingInfo}>
          <Text style={styles.nowPlayingTitle}>{nowPlaying.game.title}</Text>
          <Text style={styles.nowPlayingGenre}>{nowPlaying.game.genre.slice(0, 2).join(' · ')}</Text>
          <ScoreBadge value={Math.round(nowPlaying.game.avgRating * 10)} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

// ─── Top nav ─────────────────────────────────────────────────────────────────

function TopNav() {
  const router = useRouter()
  return (
    <View style={styles.topNav}>
      <View style={{ width: 36 }} />
      <TouchableOpacity
        style={styles.topNavBtn}
        onPress={() => router.push('/settings')}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="cog" size={16} color={TL.muted} />
      </TouchableOpacity>
    </View>
  )
}

// ─── ProfileScreen ───────────────────────────────────────────────────────────

export function ProfileScreen() {
  const { user: authUser } = useAuth()
  const apiClient = useApiClient()

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get<{ data: User | null }>('/api/users/me'),
    enabled: !!authUser,
  })
  const profile = profileRes?.data ?? null

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopNav />
        {isLoading ? (
          <>
            <ProfileSkeleton />
            <StatsSkeleton />
            <View style={styles.section}>
              <EntryTilesSkeleton />
            </View>
          </>
        ) : (
          <>
            <IdentityBlock profile={profile} />
            <StatsRow profile={profile} />
            <View style={styles.section}>
              <EntryTiles profile={profile} />
            </View>
          </>
        )}
        <NowPlaying />
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
    gap: 16,
  },

  // Top nav
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  topNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TL.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Identity
  identityBlock: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#8C5DD2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: TL.amberSoft,
  },
  avatarInitials: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: TL.amber,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: TL.bg,
  },
  levelBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '800',
    color: TL.ink,
    textAlign: 'center',
  },
  handle: {
    fontSize: 12,
    color: TL.muted,
    textAlign: 'center',
  },
  bio: {
    fontSize: 13,
    color: TL.ink2,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  identityActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 6,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: TL.ink,
  },
  statLabel: {
    fontSize: 11,
    color: TL.muted,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: TL.border,
  },

  // Entry tiles
  section: {
    gap: 4,
  },
  entryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  entryTile: {
    width: '47%',
    backgroundColor: TL.surface,
    borderRadius: TL.radiusSm,
    padding: 14,
    gap: 4,
    minHeight: 90,
    justifyContent: 'flex-end',
    shadowColor: 'rgba(120,85,30,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  entryTileAccent: {
    borderWidth: 1.5,
    borderColor: TL.amber,
  },
  entryTileIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  entryTileLabel: {
    fontSize: 12,
    color: TL.muted,
    fontWeight: '600',
  },
  entryTileCount: {
    fontSize: 15,
    fontWeight: '800',
    color: TL.ink,
  },
  entryTileCountAccent: {
    color: TL.amber,
  },
  entryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: TL.amber,
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  entryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },

  // Now playing
  nowPlayingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  nowPlayingInfo: {
    flex: 1,
    gap: 4,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TL.ink,
  },
  nowPlayingStudio: {
    fontSize: 12,
    color: TL.muted,
  },
  nowPlayingGenre: {
    fontSize: 11,
    color: TL.faint,
    marginBottom: 4,
  },
})
