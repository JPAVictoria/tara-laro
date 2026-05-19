import { View, StyleSheet } from 'react-native'
import type { ViewProps } from 'react-native'

interface CardProps extends ViewProps {
  padded?: boolean
}

export function Card({ padded = true, style, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  padded: { padding: 16 },
})
