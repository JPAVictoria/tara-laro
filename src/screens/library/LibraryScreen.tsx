import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { TL } from '@/constants/tl-theme'
import { SectionLabel, tlCard, amberBtn, amberBtnText } from '@/components/tl-shared'
import { GameCover } from '@/components/game/GameCover'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useApiClient } from '@/hooks/use-api-client'
import type { UserGame } from '@/types'

// ─── Shelf tabs ─────────────────────────────────────────────────────────────

type ShelfTab = 'playing' | 'wishlist' | 'finished' | 'reviews'
type LayoutMode = 'list' | 'grid'

const SHELF_TABS: { id: ShelfTab; label: string }[] = [
  { id: 'playing', label: 'Playing' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'finished', label: 'Finished' },
  { id: 'reviews', label: 'Reviews' },
]

const EMPTY_MESSAGES: Record<ShelfTab, string> = {
  playing: 'No games in progress.\nAdd a game from Discover to start.',
  wishlist: 'Your wishlist is empty.\nBrowse Discover to add games.',
  finished: 'No finished games yet.\nComplete a game to see it here.',
  reviews: 'No reviews written yet.\nShare your thoughts on a game.',
}

// ─── LibraryHeader ─────────────────────────────────────────────────────────

function LibraryHeader({
  layout,
  onToggleLayout,
  count,
}: {
  layout: LayoutMode
  onToggleLayout: () => void
  count: number
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
  counts,
  onSelect,
}: {
  active: ShelfTab
  counts: Record<ShelfTab, number>
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
              {counts[tab.id]}
            </Text>
          </TouchableOpacity>
        )
      })}
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

// ─── Playing row (list) ─────────────────────────────────────────────────────

function PlayingRow({ entry }: { entry: UserGame }) {
  const router = useRouter()
  return (
    <TouchableOpacity
      style={styles.playingRow}
      onPress={() => router.push(`/games/${entry.gameId}`)}
      activeOpacity={0.7}
    >
      <GameCover id={entry.gameId} coverUrl={entry.game.coverUrl} w={56} h={72} />
      <View style={styles.playingInfo}>
        <Text style={styles.playingTitle} numberOfLines={1}>{entry.game.title}</Text>
        <Text style={styles.playingGenre} numberOfLines={1}>{entry.game.genre.slice(0, 2).join(' · ')}</Text>
        <Text style={styles.playingStatus}>{entry.status}</Text>
        <ProgressBar value={entry.progress} />
        <Text style={styles.progressLabel}>{entry.progress}% complete</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

// ─── Playing grid item ──────────────────────────────────────────────────────

function PlayingGridItem({ entry }: { entry: UserGame }) {
  const router = useRouter()
  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`/games/${entry.gameId}`)}
      activeOpacity={0.7}
    >
      <GameCover id={entry.gameId} coverUrl={entry.game.coverUrl} w="100%" h={110} />
      <Text style={styles.gridTitle} numberOfLines={1}>{entry.game.title}</Text>
    </TouchableOpacity>
  )
}

// ─── Empty shelf ────────────────────────────────────────────────────────────

function EmptyShelf({ tab }: { tab: ShelfTab }) {
  const router = useRouter()
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>{EMPTY_MESSAGES[tab]}</Text>
      {tab === 'playing' || tab === 'wishlist' ? (
        <TouchableOpacity
          style={[amberBtn, { marginTop: 16 }]}
          onPress={() => router.push('/discover')}
          activeOpacity={0.7}
        >
          <Text style={amberBtnText}>Browse Discover</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

// ─── LibraryScreen ──────────────────────────────────────────────────────────

export function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<ShelfTab>('playing')
  const [layout, setLayout] = useState<LayoutMode>('list')
  const { user: authUser } = useAuth()
  const apiClient = useApiClient()

  const { data: allEntries = [], isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => apiClient.get<{ data: UserGame[] }>('/api/library').then(r => r.data),
    enabled: !!authUser,
  })

  const byStatus = {
    playing: allEntries.filter(e => e.status === 'playing'),
    wishlist: allEntries.filter(e => e.status === 'wishlist'),
    finished: allEntries.filter(e => e.status === 'finished'),
    dropped: allEntries.filter(e => e.status === 'dropped'),
    reviews: [],
  }

  const counts: Record<ShelfTab, number> = {
    playing: byStatus.playing.length,
    wishlist: byStatus.wishlist.length,
    finished: byStatus.finished.length,
    reviews: 0,
  }

  const activeEntries = activeTab === 'reviews' ? [] : (byStatus[activeTab] ?? [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LibraryHeader
          layout={layout}
          onToggleLayout={() => setLayout(l => l === 'list' ? 'grid' : 'list')}
          count={allEntries.length}
        />
        <ShelfTabs active={activeTab} counts={counts} onSelect={setActiveTab} />

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={TL.amber} />
          </View>
        ) : activeEntries.length === 0 ? (
          <EmptyShelf tab={activeTab} />
        ) : layout === 'list' ? (
          <View style={styles.section}>
            <SectionLabel kicker={activeTab.toUpperCase()} rightLink={`${activeEntries.length} games`} />
            <View style={tlCard}>
              <View style={styles.cardInner}>
                {activeEntries.map((entry, i) => (
                  <React.Fragment key={entry.id}>
                    {i > 0 && <View style={styles.hairline} />}
                    <PlayingRow entry={entry} />
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <SectionLabel kicker={activeTab.toUpperCase()} rightLink={`${activeEntries.length} games`} />
            <View style={styles.gridWrap}>
              {activeEntries.map((entry) => (
                <PlayingGridItem key={entry.id} entry={entry} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────

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
  headerLabel: { fontSize: 12, color: TL.muted, fontWeight: '600', letterSpacing: 0.3 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: TL.ink, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: TL.surface, alignItems: 'center', justifyContent: 'center',
  },
  iconBtnActive: { backgroundColor: TL.amber },
  iconBtnText: { fontSize: 18, color: TL.muted },
  iconBtnTextActive: { color: '#fff' },

  tabStrip: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 16 },
  tab: {
    flex: 1, paddingVertical: 8, paddingHorizontal: 6,
    borderRadius: TL.radiusSm, backgroundColor: TL.surface, alignItems: 'center', gap: 2,
  },
  tabActive: { backgroundColor: TL.ink },
  tabLabel: { fontSize: 11, fontWeight: '600', color: TL.muted },
  tabLabelActive: { color: TL.bg },
  tabCount: { fontSize: 13, fontWeight: '800', color: TL.ink },
  tabCountActive: { color: TL.bg },

  loadingWrap: { paddingVertical: 60, alignItems: 'center' },
  section: { marginTop: 4 },
  cardInner: { paddingVertical: 4 },
  hairline: { height: 1, backgroundColor: TL.border, marginHorizontal: 14 },

  playingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12, gap: 12,
  },
  playingInfo: { flex: 1, gap: 2 },
  playingTitle: { fontSize: 14, fontWeight: '700', color: TL.ink },
  playingGenre: { fontSize: 11, color: TL.muted },
  playingStatus: { fontSize: 11, color: TL.faint, marginTop: 2, textTransform: 'capitalize' },
  progressTrack: {
    height: 3, backgroundColor: TL.surface2, borderRadius: 99, marginTop: 6, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: TL.amber, borderRadius: 99 },
  progressLabel: { fontSize: 10, color: TL.muted, marginTop: 2 },
  chevron: { fontSize: 22, color: TL.faint, fontWeight: '600' },

  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: '47%', gap: 6 },
  gridTitle: { fontSize: 12, fontWeight: '700', color: TL.ink },

  emptyWrap: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { fontSize: 14, color: TL.muted, textAlign: 'center', lineHeight: 22 },
})
