import { View, Text, StyleSheet } from 'react-native'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎮</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant='primary' />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emoji: { fontSize: 48, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center' },
  message: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
})
