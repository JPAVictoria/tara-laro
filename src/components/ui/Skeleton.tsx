import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { TL } from '@/constants/tl-theme'

interface SkeletonProps {
  width?: number | `${number}%`
  height: number
  radius?: number
  style?: object
}

export function Skeleton({ width = '100%', height, radius = 6, style }: SkeletonProps) {
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.35, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [])

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: TL.surface2 },
        animStyle,
        style,
      ]}
    />
  )
}

// ─── Compound shapes ────────────────────────────────────────────────────────

export function SkeletonCircle({ size }: { size: number }) {
  return <Skeleton width={size} height={size} radius={size / 2} />
}

export function SkeletonLine({ width = '100%', height = 14, radius = 4 }: Omit<SkeletonProps, 'height'> & { height?: number }) {
  return <Skeleton width={width} height={height} radius={radius} />
}

// ─── Profile skeleton ────────────────────────────────────────────────────────

export function ProfileSkeleton() {
  return (
    <View style={profile.wrap}>
      <SkeletonCircle size={92} />
      <View style={profile.lines}>
        <SkeletonLine width={160} height={22} />
        <SkeletonLine width={120} height={13} />
        <SkeletonLine width={220} height={13} />
      </View>
      <View style={profile.btnRow}>
        <Skeleton width="100%" height={36} radius={999} />
      </View>
    </View>
  )
}

const profile = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingBottom: 4 },
  lines: { alignItems: 'center', gap: 8, width: '100%' },
  btnRow: { width: '100%', marginTop: 4 },
})

// ─── Stats row skeleton ───────────────────────────────────────────────────────

export function StatsSkeleton() {
  return (
    <View style={stats.row}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={stats.item}>
          <SkeletonLine width={40} height={20} />
          <SkeletonLine width={60} height={11} />
        </View>
      ))}
    </View>
  )
}

const stats = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 8 },
  item: { flex: 1, alignItems: 'center', gap: 6 },
})

// ─── Entry tiles skeleton ────────────────────────────────────────────────────

export function EntryTilesSkeleton() {
  return (
    <View style={tiles.grid}>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} width="47%" height={90} radius={14} />
      ))}
    </View>
  )
}

const tiles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
})

// ─── Library row skeleton ─────────────────────────────────────────────────────

export function LibraryRowSkeleton() {
  return (
    <View style={lib.row}>
      <Skeleton width={56} height={72} radius={8} />
      <View style={lib.info}>
        <SkeletonLine width={140} height={14} />
        <SkeletonLine width={90} height={11} />
        <SkeletonLine width={60} height={11} />
        <SkeletonLine width="100%" height={3} radius={99} />
      </View>
    </View>
  )
}

const lib = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  info: { flex: 1, gap: 8 },
})

// ─── Game detail skeleton ─────────────────────────────────────────────────────

export function GameDetailSkeleton() {
  return (
    <View>
      <Skeleton width="100%" height={260} radius={0} />
      <View style={detail.body}>
        <View style={detail.titleRow}>
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonLine width="75%" height={26} />
            <SkeletonLine width={60} height={13} />
          </View>
          <Skeleton width={64} height={64} radius={10} />
        </View>
        <View style={detail.genreRow}>
          {[80, 70, 90].map((w, i) => <SkeletonLine key={i} width={w} height={24} radius={999} />)}
        </View>
        <View style={{ gap: 8, marginTop: 14 }}>
          <SkeletonLine width="100%" height={14} />
          <SkeletonLine width="90%" height={14} />
          <SkeletonLine width="70%" height={14} />
        </View>
        <View style={{ height: 1, backgroundColor: TL.border, marginVertical: 20 }} />
        <View style={{ gap: 12 }}>
          <SkeletonLine width={120} height={18} />
          {[0, 1].map((i) => (
            <View key={i} style={detail.reviewCard}>
              <SkeletonCircle size={32} />
              <View style={{ flex: 1, gap: 8 }}>
                <SkeletonLine width={100} height={13} />
                <SkeletonLine width="80%" height={13} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const detail = StyleSheet.create({
  body: { padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  genreRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  reviewCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 12, backgroundColor: TL.surface, borderRadius: 12 },
})

// ─── Today pick skeleton ──────────────────────────────────────────────────────

export function TodayPickSkeleton() {
  return (
    <View style={{ backgroundColor: TL.surface, borderRadius: 20, overflow: 'hidden' }}>
      <Skeleton width="100%" height={230} radius={0} />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 }}>
        <Skeleton width={52} height={52} radius={12} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonLine width={140} height={15} />
          <SkeletonLine width={100} height={12} />
        </View>
        <Skeleton width={80} height={36} radius={999} />
      </View>
    </View>
  )
}

// ─── Friend activity skeleton ─────────────────────────────────────────────────

export function FriendRowSkeleton() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10 }}>
      <SkeletonCircle size={34} />
      <View style={{ flex: 1, gap: 6 }}>
        <SkeletonLine width={90} height={13} />
        <SkeletonLine width={150} height={12} />
      </View>
      <Skeleton width={38} height={50} radius={6} />
    </View>
  )
}
