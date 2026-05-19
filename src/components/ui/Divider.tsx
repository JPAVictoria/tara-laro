import { View, StyleSheet } from 'react-native'

interface DividerProps {
  spacing?: number
}

export function Divider({ spacing = 0 }: DividerProps) {
  return <View style={[styles.line, { marginVertical: spacing }]} />
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB' },
})
