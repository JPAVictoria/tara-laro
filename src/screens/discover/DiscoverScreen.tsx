import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native'

export function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Discover</Text>
        {/* Day 11-12: GameCard rows + search bar */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { flex: 1 },
  content: { paddingBottom: 80 },
  heading: { fontSize: 28, fontWeight: '800', color: '#111827', paddingHorizontal: 16, paddingTop: 16, marginBottom: 12 },
})
