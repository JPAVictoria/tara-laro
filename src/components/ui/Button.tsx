import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, fullWidth }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], fullWidth && styles.fullWidth, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#111827' : '#FACC15'} size='small' />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: '#FACC15' },
  secondary: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#FACC15' },
  ghost: { backgroundColor: 'transparent' },
  label: { fontSize: 15, fontWeight: '700' },
  primaryLabel: { color: '#111827' },
  secondaryLabel: { color: '#CA8A04' },
  ghostLabel: { color: '#FACC15' },
})
