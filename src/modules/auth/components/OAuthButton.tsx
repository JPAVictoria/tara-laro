import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import type { AuthProvider } from '@/types'

interface OAuthButtonProps {
  provider: Exclude<AuthProvider, 'email'>
  onPress: () => void
  disabled?: boolean
}

const labels: Record<Exclude<AuthProvider, 'email'>, string> = {
  google: 'Continue with Google',
  discord: 'Continue with Discord',
}

export function OAuthButton({ provider, onPress, disabled }: OAuthButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <View style={styles.inner}>
        <Text style={styles.label}>{labels[provider]}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  disabled: { opacity: 0.5 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontSize: 15, fontWeight: '500', color: '#111827' },
})
