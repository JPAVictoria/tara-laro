import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { TL } from '@/constants/tl-theme'
import { SectionLabel, tlCard, GAMES } from '@/components/tl-shared'
import { GameCover } from '@/components/game/GameCover'

// ─── Shelf tabs ─────────────────────────────────────────────────────────────

type ShelfTab = 'playing' | 'wishlist' | 'finished' | 'reviews'
type LayoutMode = 'list' | 'grid'

const SHELF_TABS: { id: ShelfTab; label: string; count: number }[] = [
  { id: 'playing', label: 'Playing', count: 3 },
  { id: 'wishlist', label: 'Wishlist', count: 0 },
  { id: 'finished', label: 'Finished', count: 0 },
  { id: 'reviews', label: 'Reviews', count: 0 },
]

// ─── LibraryHeader ─────────────────────────────────────────────────────────

function LibraryHeader({
  layout,
  onToggleLayout,
}: {
  layout: LayoutMode
  onToggleLayout: () => void
}) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerLabel}>Your collection</Text>
        <Text style={styles.headerTitle}>Library</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.iconBtn, layout === 'grid' && styles.iconBtnActive]}
          onPress={onToggleLayout}
          activeOpacity={0.7}
        >
          <Text style={[styles.iconBtnText, layout === 'grid' && styles.iconBtnTextActive]}>⊞</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, layout === 'list' && styles.iconBtnActive]}
          onPress={onToggleLayout}
          activeOpacity={0.7}
        >
          <Text style={[styles.iconBtnText, layout === 'list' && styles.iconBtnTextActive]}>◎</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Shelf tab strip ────────────────────────────────────────────────────────

function ShelfTabs({
  active,
  onSelect,
}: {
  active: ShelfTab
  onSelect: (t: ShelfTab) => void
}) {
  return (
    <View style={styles.tabStrip}>
      {SHELF_TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            <Text style={[styles.tabCount, isActive && styles.tabCountActive]}>
              {tab.count}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

// ─── Streak card ────────────────────────────────────────────────────────────

function StreakCard() {
  return (
    <View style={styles.streakCard}>
      <View style={styles.streakLeft}>
        <View style={styles.streakFlameCircle}>
          <Text style={{ fontSize: 22 }}>🔥</Text>
        </View>
      </View>
      <View style={styles.streakCenter}>
        <Text style={styles.streakMain}>Start your streak</Text>
        <Text style={styles.streakSub}>Play a game to begin tracking</Text>
      </View>
    </View>
  )
}

// ─── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  )
}

// ─── Playing row (list layout) ──────────────────────────────────────────────

function PlayingRow({
  id,
  progress,
  status,
}: {
  id: string
  progress: number
  status: string
}) {
  const router = useRouter()
  const game = GAMES[id]
  if (!game) return null
  return (
    <TouchableOpacity
      style={styles.playingRow}
      onPress={() => router.push(`/games/${id}`)}
      activeOpacity={0.7}
    >
      <GameCover id={id} w={56} h={72} />
      <View style={styles.playingInfo}>
        <Text style={styles.playingTitle} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={styles.playingGenre} numberOfLines={1}>
          {game.genre}
        </Text>
        <Text style={styles.playingStatus}>{status}</Text>
        <ProgressBar value={progress} />
        <Text style={styles.progressLabel}>{progress}% complete</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

// ─── Playing grid item ──────────────────────────────────────────────────────

function PlayingGridItem({ id }: { id: string }) {
  const router = useRouter()
  const game = GAMES[id]
  if (!game) return null
  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`/games/${id}`)}
      activeOpacity={0.7}
    >
      <GameCover id={id} w="100%" h={110} />
      <Text style={styles.gridTitle} numberOfLines={1}>{game.title}</Text>
    </TouchableOpacity>
  )
}

// ─── Empty shelf ────────────────────────────────────────────────────────────

const EMPTY_MESSAGES: Record<ShelfTab, string> = {
  playing: 'No games in progress.',
  wishlist: 'Your wishlist is empty.\nBrowse Discover to add games.',
  finished: 'No finished games yet.\nComplete a game to see it here.',
  reviews: 'No reviews written yet.\nShare your thoughts on a game.',
}

function EmptyShelf({ tab }: { tab: ShelfTab }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>{EMPTY_MESSAGES[tab]}</Text>
    </View>
  )
}

// ─── LibraryScreen ──────────────────────────────────────────────────────────

const PLAYING_GAMES = [
  { id: 'stardust', progress: 38, status: 'Session: 1h ago' },
  { id: 'neon', progress: 12, status: 'Session: 3 days ago' },
  { id: 'lumen', progress: 18, status: 'Session: 1 week ago' },
]

export function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<ShelfTab>('playing')
  const [layout, setLayout] = useState<LayoutMode>('list')

  const showPlaying = activeTab === 'playing'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LibraryHeader layout={layout} onToggleLayout={() => setLayout(l => l === 'list' ? 'grid' : 'list')} />
        <ShelfTabs active={activeTab} onSelect={setActiveTab} />
        <StreakCard />

        {showPlaying ? (
          layout === 'list' ? (
            <View style={styles.section}>
              <SectionLabel kicker="PLAYING" rightLink="3 active" />
              <View style={tlCard}>
                <View style={styles.cardInner}>
                  {PLAYING_GAMES.map((g, i) => (
                    <React.Fragment key={g.id}>
                      {i > 0 && <View style={styles.hairline} />}
                      <PlayingRow id={g.id} progress={g.progress} status={g.status} />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <SectionLabel kicker="PLAYING" rightLink="3 active" />
              <View style={styles.gridWrap}>
                {PLAYING_GAMES.map((g) => (
                  <PlayingGridItem key={g.id} id={g.id} />
                ))}
              </View>
            </View>
          )
        ) : (
          <EmptyShelf tab={activeTab} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────

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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TL.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: TL.amber,
  },
  iconBtnText: {
    fontSize: 18,
    color: TL.muted,
  },
  iconBtnTextActive: {
    color: '#fff',
  },

  // Shelf tabs
  tabStrip: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: TL.radiusSm,
    backgroundColor: TL.surface,
    alignItems: 'center',
    gap: 2,
  },
  tabActive: {
    backgroundColor: TL.ink,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TL.muted,
  },
  tabLabelActive: {
    color: TL.bg,
  },
  tabCount: {
    fontSize: 13,
    fontWeight: '800',
    color: TL.ink,
  },
  tabCountActive: {
    color: TL.bg,
  },

  // Streak card
  streakCard: {
    borderRadius: TL.radius,
    backgroundColor: TL.hype2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    marginBottom: 16,
  },
  streakLeft: {},
  streakFlameCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCenter: {
    flex: 1,
    gap: 3,
  },
  streakMain: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  streakSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },

  // Section
  section: {
    marginTop: 4,
  },
  cardInner: {
    paddingVertical: 4,
  },
  hairline: {
    height: 1,
    backgroundColor: TL.border,
    marginHorizontal: 14,
  },

  // Playing row
  playingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  playingInfo: {
    flex: 1,
    gap: 2,
  },
  playingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TL.ink,
  },
  playingGenre: {
    fontSize: 11,
    color: TL.muted,
  },
  playingStatus: {
    fontSize: 11,
    color: TL.faint,
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: TL.surface2,
    borderRadius: 99,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: TL.amber,
    borderRadius: 99,
  },
  progressLabel: {
    fontSize: 10,
    color: TL.muted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: TL.faint,
    fontWeight: '600',
  },

  // Grid layout
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '47%',
    gap: 6,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TL.ink,
  },

  // Empty state
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: TL.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
})
