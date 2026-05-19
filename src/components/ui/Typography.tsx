import { Text, StyleSheet } from 'react-native'
import type { TextProps } from 'react-native'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label'

interface TypographyProps extends TextProps {
  variant?: TypographyVariant
  muted?: boolean
}

export function Typography({ variant = 'body', muted, style, children, ...props }: TypographyProps) {
  return (
    <Text style={[styles[variant], muted && styles.muted, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '900', color: '#111827', letterSpacing: -0.5, lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.3, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '700', color: '#111827', lineHeight: 26 },
  h4: { fontSize: 17, fontWeight: '700', color: '#111827', lineHeight: 23 },
  body: { fontSize: 15, fontWeight: '400', color: '#111827', lineHeight: 22 },
  'body-sm': { fontSize: 13, fontWeight: '400', color: '#111827', lineHeight: 19 },
  caption: { fontSize: 11, fontWeight: '400', color: '#6B7280', lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', lineHeight: 18 },
  muted: { color: '#6B7280' },
})
