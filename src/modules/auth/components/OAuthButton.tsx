import { TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import type { AuthProvider } from '@/types'

interface OAuthButtonProps {
  provider: Exclude<AuthProvider, 'email'>
  onPress: () => void
  disabled?: boolean
  dark?: boolean
}

const iconConfig: Record<Exclude<AuthProvider, 'email'>, { name: string; color: string }> = {
  google: { name: 'google', color: '#EA4335' },
  discord: { name: 'discord', color: '#5865F2' },
}

export function OAuthButton({ provider, onPress, disabled, dark }: OAuthButtonProps) {
  const { name, color } = iconConfig[provider]
  return (
    <TouchableOpacity
      style={[styles.button, dark && styles.buttonDark, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`Sign in with ${provider}`}
    >
      <FontAwesome5 name={name} size={24} color={color} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDark: {
    backgroundColor: '#1F1810',
    borderColor: 'rgba(248,239,216,0.14)',
  },
  disabled: { opacity: 0.5 },
})
