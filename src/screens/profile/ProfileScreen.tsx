import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TL } from '@/constants/tl-theme'
import {
  SectionLabel,
  ScoreBadge,
  tlCard,
  amberBtn,
  amberBtnText,
  GAMES,
} from '@/components/tl-shared'
import { GameCover } from '@/components/game/GameCover'

// ─── Profile avatar ──────────────────────────────────────────────────────────

function ProfileAvatar() {
  return (
    <View style={styles.avatarWrap}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitials}>MR</Text>
      </View>
      <View style={styles.levelBadge}>
        <Text style={styles.levelBadgeText}>LVL 12</Text>
      </View>
    </View>
  )
}

// ─── Identity block ──────────────────────────────────────────────────────────

function IdentityBlock() {
  return (
    <View style={styles.identityBlock}>
      <ProfileAvatar />
      <Text style={styles.displayName}>Maya Reyes</Text>
      <Text style={styles.handle}>@mayareyes · Manila, PH · joined 2023</Text>
      <Text style={styles.bio}>
        Collecting cozy games and strong opinions. Usually overleveled, always underslept. 🌙
      </Text>
      <View style={styles.identityActions}>
        <TouchableOpacity style={[amberBtn, { flex: 1 }]}>
          <Text style={amberBtnText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.outlineBtn, { flex: 1 }]}>
          <Text style={styles.outlineBtnText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Stats row ────────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function StatsRow() {
  return (
    <View style={[tlCard, styles.statsRow]}>
      <StatItem value="247" label="Games" />
      <View style={styles.statDivider} />
      <StatItem value="48" label="Reviews" />
      <View style={styles.statDivider} />
      <StatItem value="12" label="Lists" />
      <View style={styles.statDivider} />
      <StatItem value="1.2k" label="Followers" />
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
}: {
  icon: string
  label: string
  count: string
  badge?: string
  accent?: boolean
}) {
  return (
    <TouchableOpacity style={[styles.entryTile, accent && styles.entryTileAccent]}>
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

function EntryTiles() {
  return (
    <View style={styles.entryGrid}>
      <EntryTile icon="📚" label="Library" count="247 games" />
      <EntryTile icon="✍️" label="Reviews" count="48 written" />
      <EntryTile icon="📋" label="Lists" count="12 curated" />
      <EntryTile icon="👥" label="Friends" count="1.2k" badge="8 new" accent />
    </View>
  )
}

// ─── Now Playing ─────────────────────────────────────────────────────────────

function NowPlayingRow() {
  const game = GAMES['lumen']
  if (!game) return null
  return (
    <View style={[tlCard, styles.nowPlayingCard]}>
      <GameCover id="lumen" w={56} h={72} />
      <View style={styles.nowPlayingInfo}>
        <Text style={styles.nowPlayingTitle}>{game.title}</Text>
        <Text style={styles.nowPlayingStudio}>{game.studio}</Text>
        <Text style={styles.nowPlayingGenre}>{game.genre}</Text>
        <ScoreBadge value={game.score} />
      </View>
    </View>
  )
}

function NowPlaying() {
  return (
    <View style={styles.section}>
      <SectionLabel kicker="NOW PLAYING" rightLink="Library →" />
      <NowPlayingRow />
    </View>
  )
}

// ─── Top nav ─────────────────────────────────────────────────────────────────

function TopNav() {
  return (
    <View style={styles.topNav}>
      <TouchableOpacity style={styles.topNavBtn}>
        <Text style={styles.topNavBtnText}>↑</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.topNavBtn}>
        <Text style={styles.topNavBtnText}>···</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─── ProfileScreen ───────────────────────────────────────────────────────────

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopNav />
        <IdentityBlock />
        <StatsRow />
        <View style={styles.section}>
          <EntryTiles />
        </View>
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
  topNavBtnText: {
    fontSize: 16,
    color: TL.muted,
    fontWeight: '700',
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
  outlineBtn: {
    height: 36,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: TL.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    color: TL.ink,
    fontWeight: '700',
    fontSize: 13,
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
