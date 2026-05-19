import { Platform } from 'react-native'

export const Colors = {
  primary: '#FACC15',
  primaryLight: '#FEF08A',
  primaryDark: '#CA8A04',
  surface: '#FFFFFF',
  surface2: '#FAFAFA',
  surface3: '#F5F5F5',
  muted: '#E5E7EB',
  text: '#111827',
  text2: '#6B7280',
  error: '#EF4444',
  success: '#16A34A',

  // Light/dark scheme tokens (used by legacy themed components)
  light: {
    text: '#111827',
    background: '#FAFAFA',
    backgroundElement: '#F5F5F5',
    backgroundSelected: '#FEF08A',
    textSecondary: '#6B7280',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    backgroundElement: '#1F2937',
    backgroundSelected: '#374151',
    textSecondary: '#9CA3AF',
  },
} as const

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
})

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 64,
  // Legacy aliases used by scaffold screens
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const

export const Radius = {
  sm: 6,
  md: 12,
  lg: 14,
  full: 9999,
} as const

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0
export const MaxContentWidth = 800
