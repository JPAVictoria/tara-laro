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
import { TL } from '@/constants/tl-theme'
import { Avatar, SectionLabel, tlCard } from '@/components/tl-shared'

// ─── Group data ─────────────────────────────────────────────────────────────

const GROUPS = [
  {
    id: 'cozy',
    name: 'Cozy Players',
    emoji: '🌿',
    members: '4.2k',
    badge: '12 NEW',
    gradStart: TL.amberSoft,
    gradEnd: TL.amber,
  },
  {
    id: 'soulslike',
    name: 'Soulslike',
    emoji: '⚔️',
    members: '8.9k',
    gradStart: '#0d1f3a',
    gradEnd: '#1f4080',
  },
  {
    id: 'jrpg',
    name: 'JRPGs',
    emoji: '⚡',
    members: '6.1k',
    gradStart: '#3a1f0d',
    gradEnd: '#8a4010',
  },
  {
    id: 'indie',
    name: 'Indie Devs',
    emoji: '🛠',
    members: '2.3k',
    gradStart: '#0d2a1a',
    gradEnd: '#1a6030',
  },
]

// ─── Thread data ─────────────────────────────────────────────────────────────

const THREADS = [
  {
    id: 't1',
    title: 'Why Lumen Drift has the best traversal system of the decade',
    group: 'Cozy Players',
    author: 'Theo P',
    replies: 47,
    likes: 128,
  },
  {
    id: 't2',
    title: 'Cobalt Choir — the ending hit different for me. Spoilers.',
    group: 'JRPGs',
    author: 'Kira S',
    replies: 89,
    likes: 212,
  },
  {
    id: 't3',
    title: 'Best cozy games to play during monsoon season?',
    group: 'Cozy Players',
    author: 'Jules M',
    replies: 31,
    likes: 74,
  },
]

// ─── CommunityHeader ─────────────────────────────────────────────────────────

function CommunityHeader() {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerLabel}>47 posts today · 18.4k active</Text>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      <TouchableOpacity style={styles.iconBtn}>
        <Text style={styles.iconBtnText}>◎</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─── Group card ──────────────────────────────────────────────────────────────

function GroupCard({
  emoji,
  name,
  members,
  badge,
  bgColor,
}: {
  emoji: string
  name: string
  members: string
  badge?: string
  bgColor: string
}) {
  return (
    <TouchableOpacity
      style={[styles.groupCard, { backgroundColor: bgColor }]}
      onPress={() => Alert.alert(name, 'Group detail coming soon.')}
      activeOpacity={0.7}
    >
      {badge && (
        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeText}>{badge}</Text>
        </View>
      )}
      <Text style={styles.groupEmoji}>{emoji}</Text>
      <Text style={styles.groupName}>{name}</Text>
      <Text style={styles.groupMembers}>{members} members</Text>
    </TouchableOpacity>
  )
}

// ─── Groups grid ────────────────────────────────────────────────────────────

function GroupsGrid() {
  return (
    <View style={styles.section}>
      <SectionLabel kicker="YOUR GROUPS" subtitle="Active circles" />
      <View style={styles.groupsGrid}>
        {GROUPS.map((g) => (
          <GroupCard
            key={g.id}
            emoji={g.emoji}
            name={g.name}
            members={g.members}
            badge={g.badge}
            bgColor={g.gradEnd}
          />
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
}: {
  title: string
  group: string
  author: string
  replies: number
  likes: number
}) {
  return (
    <TouchableOpacity
      style={styles.threadRow}
      onPress={() => Alert.alert(group, 'Thread detail coming soon.')}
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

// ─── Trending section ────────────────────────────────────────────────────────

function TrendingSection() {
  return (
    <View style={styles.section}>
      <SectionLabel kicker="TRENDING TODAY" />
      <View style={tlCard}>
        {THREADS.map((t, idx) => (
          <React.Fragment key={t.id}>
            {idx > 0 && <View style={styles.hairline} />}
            <ThreadRow
              title={t.title}
              group={t.group}
              author={t.author}
              replies={t.replies}
              likes={t.likes}
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
  return (
    <TouchableOpacity
      style={styles.composerPill}
      onPress={() => router.push('/create')}
      activeOpacity={0.7}
    >
      <Avatar name="You" size={34} />
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
        <GroupsGrid />
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
