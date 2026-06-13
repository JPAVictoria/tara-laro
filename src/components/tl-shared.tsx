import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TL } from '@/constants/tl-theme'

// ─── Avatar ────────────────────────────────────────────────────────────────

const AVATAR_BG = ['#F2A413', '#E26A2C', '#6D7AE6', '#1FA66B', '#C7820A', '#8C5DD2', '#D14D6E']

export function Avatar({
  name,
  size = 32,
  ring = false,
}: {
  name: string
  size?: number
  ring?: boolean
}) {
  const initials = name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const bg = AVATAR_BG[(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_BG.length]
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          ...(ring ? { borderWidth: 2.5, borderColor: TL.amber } : {}),
        },
      ]}
    >
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.38 }}>{initials}</Text>
    </View>
  )
}

// ─── Stars ─────────────────────────────────────────────────────────────────

export function Stars({ value = 4, size = 12 }: { value: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: TL.amber }}>
          {i <= value ? '★' : '☆'}
        </Text>
      ))}
    </View>
  )
}

// ─── SectionLabel ──────────────────────────────────────────────────────────

export function SectionLabel({
  kicker,
  subtitle,
  rightLink,
  onPress,
}: {
  kicker: string
  subtitle?: string
  rightLink?: string
  onPress?: () => void
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}
    >
      <View style={{ gap: 2 }}>
        <Text
          style={{
            fontSize: 11.5,
            fontWeight: '700',
            color: TL.amberDeep,
            letterSpacing: 1.0,
          }}
        >
          {kicker}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 15, fontWeight: '700', color: TL.ink }}>{subtitle}</Text>
        )}
      </View>
      {rightLink && (
        onPress ? (
          <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: TL.amber }}>{rightLink}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ fontSize: 12, fontWeight: '600', color: TL.muted }}>{rightLink}</Text>
        )
      )}
    </View>
  )
}

// ─── ScoreBadge ────────────────────────────────────────────────────────────

export function ScoreBadge({ value }: { value: number }) {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingLeft: 12,
        paddingRight: 10,
        borderRadius: 14,
        backgroundColor: TL.amberSoft,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '800', color: TL.ink }}>{value}</Text>
      <View>
        <Text style={{ fontSize: 9, fontWeight: '700', color: TL.amberDeep, letterSpacing: 0.5 }}>
          TARA
        </Text>
        <Text style={{ fontSize: 9, fontWeight: '700', color: TL.amberDeep, letterSpacing: 0.5 }}>
          SCORE
        </Text>
      </View>
    </View>
  )
}

// ─── Card style ────────────────────────────────────────────────────────────

export const tlCard = {
  backgroundColor: TL.surface,
  borderRadius: TL.radius,
  shadowColor: 'rgba(120,85,30,1)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 3,
} as const

// ─── AmberButton styles ────────────────────────────────────────────────────

export const amberBtn = {
  height: 36,
  paddingHorizontal: 14,
  borderRadius: 999,
  backgroundColor: TL.amber,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
} as const

export const amberBtnText = { color: '#fff', fontWeight: '700' as const, fontSize: 13 }

