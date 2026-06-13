import { View, TextInput, Text, StyleSheet } from 'react-native'
import type { TextInputProps } from 'react-native'

interface InputProps extends TextInputProps {
  label?: string
  error?: string | null
  dark?: boolean
}

export function Input({ label, error, dark, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text> : null}
      <TextInput
        style={[styles.input, dark && styles.inputDark, error && styles.inputError, style]}
        placeholderTextColor={dark ? '#A88E62' : '#9CA3AF'}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151' },
  labelDark: { color: '#E3D4AA' },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputDark: {
    borderColor: 'rgba(248,239,216,0.14)',
    backgroundColor: '#1F1810',
    color: '#F8EFD8',
  },
  inputError: { borderColor: '#EF4444' },
  error: { fontSize: 12, color: '#EF4444' },
})
