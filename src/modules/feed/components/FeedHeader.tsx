import { View, Text, StyleSheet } from 'react-native'

export function FeedHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>TaraLaro</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  logo: { fontSize: 22, fontWeight: '800', color: '#FACC15' },
})
