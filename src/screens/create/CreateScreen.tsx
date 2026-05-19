import { View, Text, StyleSheet, SafeAreaView } from 'react-native'

export function CreateScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>New Post</Text>
        {/* Day 15-16: image picker, caption, game tag, upload */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 16 },
  heading: { fontSize: 20, fontWeight: '700', color: '#111827', paddingTop: 16, marginBottom: 16 },
})
