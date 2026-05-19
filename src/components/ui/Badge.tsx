import { View, Text, StyleSheet } from 'react-native'

type BadgeVariant = 'yellow' | 'gray' | 'green'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

export function Badge({ label, variant = 'yellow' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  yellow: { backgroundColor: '#FEF08A' },
  gray: { backgroundColor: '#F3F4F6' },
  green: { backgroundColor: '#DCFCE7' },
  label: { fontSize: 11, fontWeight: '600' },
  yellowLabel: { color: '#CA8A04' },
  grayLabel: { color: '#6B7280' },
  greenLabel: { color: '#16A34A' },
})
