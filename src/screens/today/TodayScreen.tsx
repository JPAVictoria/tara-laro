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
  Avatar,
  Stars,
  SectionLabel,
  ScoreBadge,
  tlCard,
  amberBtn,
  amberBtnText,
  GAMES,
} from '@/components/tl-shared'
import { GameCover } from '@/components/game/GameCover'

// ─── TodayHeader ───────────────────────────────────────────────────────────

function TodayHeader() {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerDate}>Wednesday, May 20</Text>
        <Text style={styles.headerGreeting}>Hey, Maya.</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={{ fontSize: 18 }}>◎</Text>
        </TouchableOpacity>
        <Avatar name="Maya R" size={38} ring />
      </View>
    </View>
  )
}

// ─── TodayPick ─────────────────────────────────────────────────────────────

function TodayPick() {
  const game = GAMES['lumen']
  return (
    <View style={styles.section}>
      <SectionLabel
        kicker="TODAY'S PICK"
        subtitle="Picked by Quietmoon, polished by us"
      />
      <View style={[tlCard, styles.pickCard]}>
        {/* Cover with gradient overlay */}
        <View style={styles.pickCoverWrap}>
          <GameCover id="lumen" w="100%" h={230} radius={0} flat />
          <View style={styles.pickGradient} />
        </View>

        {/* Score + action row */}
        <View style={styles.pickMeta}>
          <View style={styles.pickMetaLeft}>
            <ScoreBadge value={game.score} />
            <View style={{ gap: 1 }}>
              <Text style={styles.pickTitle}>{game.title}</Text>
              <Text style={styles.pickStudio}>{game.studio}</Text>
            </View>
          </View>
          <TouchableOpacity style={amberBtn}>
            <Text style={amberBtnText}>+ Library</Text>
          </TouchableOpacity>
        </View>

        {/* Hairline */}
        <View style={styles.hairline} />

        {/* Quote */}
        <View style={styles.pickQuote}>
          <Text style={styles.pickQuoteText}>
            "A rare open-world that trusts you to find your own story — and rewards every detour."
          </Text>
          <Text style={styles.pickQuoteAttr}>— TaraLaro editorial</Text>
        </View>
      </View>
    </View>
  )
}

// ─── Continue row ──────────────────────────────────────────────────────────

function ContinueRow({
  id,
  playtime,
}: {
  id: string
  playtime: string
}) {
  const game = GAMES[id]
  if (!game) return null
  return (
    <View style={styles.continueRow}>
      <GameCover id={id} w={48} h={62} />
      <View style={styles.continueInfo}>
        <Text style={styles.continueTitle} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={styles.continueSub}>
          <Text style={{ fontSize: 12 }}>⏰</Text> {playtime}
        </Text>
      </View>
      <TouchableOpacity style={styles.playBtn}>
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>▶</Text>
      </TouchableOpacity>
    </View>
  )
}

function TodayContinue() {
  return (
    <View style={styles.section}>
      <SectionLabel kicker="PICK UP WHERE YOU LEFT OFF" rightLink="2 games" />
      <View style={tlCard}>
        <View style={styles.cardInner}>
          <ContinueRow id="stardust" playtime="3h 22m played" />
          <View style={styles.hairline} />
          <ContinueRow id="neon" playtime="1h 5m played" />
        </View>
      </View>
    </View>
  )
}

// ─── Friend activity row ───────────────────────────────────────────────────

function FriendRow({
  name,
  verb,
  gameId,
  stars,
}: {
  name: string
  verb: string
  gameId: string
  stars?: number
}) {
  const game = GAMES[gameId]
  if (!game) return null
  return (
    <View style={styles.friendRow}>
      <Avatar name={name} size={34} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{name}</Text>
        <Text style={styles.friendVerb} numberOfLines={1}>
          {verb} <Text style={styles.friendGame}>{game.title}</Text>
        </Text>
        {stars !== undefined && <Stars value={stars} size={11} />}
      </View>
      <GameCover id={gameId} w={38} h={50} radius={TL.radiusXs} />
    </View>
  )
}

function TodayFriends() {
  return (
    <View style={styles.section}>
      <SectionLabel kicker="FROM YOUR CIRCLE" rightLink="See all" />
      <View style={tlCard}>
        <View style={styles.cardInner}>
          <FriendRow name="Theo" verb="finished" gameId="cobalt" stars={5} />
          <View style={styles.hairline} />
          <FriendRow name="Kira" verb="started" gameId="lumen" />
          <View style={styles.hairline} />
          <FriendRow name="Jules" verb="reviewed" gameId="hollow" stars={3} />
        </View>
      </View>
    </View>
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
        <TodayContinue />
        <TodayFriends />
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────

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
  headerDate: {
    fontSize: 12,
    color: TL.muted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerGreeting: {
    fontSize: 28,
    fontWeight: '800',
    color: TL.ink,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TL.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section
  section: {
    marginTop: 20,
  },

  // Pick card
  pickCard: {
    overflow: 'hidden',
  },
  pickCoverWrap: {
    width: '100%',
    height: 230,
    position: 'relative',
  },
  pickGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
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
  pickMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pickTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TL.ink,
  },
  pickStudio: {
    fontSize: 12,
    color: TL.muted,
  },

  // Quote
  hairline: {
    height: 1,
    backgroundColor: TL.border,
    marginHorizontal: 14,
  },
  pickQuote: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pickQuoteText: {
    fontSize: 13,
    color: TL.ink2,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  pickQuoteAttr: {
    fontSize: 11,
    color: TL.muted,
    marginTop: 4,
  },

  // Card inner
  cardInner: {
    paddingVertical: 4,
  },

  // Continue
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  continueInfo: {
    flex: 1,
    gap: 3,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TL.ink,
  },
  continueSub: {
    fontSize: 12,
    color: TL.muted,
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: TL.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Friends
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  friendInfo: {
    flex: 1,
    gap: 2,
  },
  friendName: {
    fontSize: 13,
    fontWeight: '700',
    color: TL.ink,
  },
  friendVerb: {
    fontSize: 12,
    color: TL.muted,
  },
  friendGame: {
    color: TL.ink2,
    fontWeight: '600',
  },
})
