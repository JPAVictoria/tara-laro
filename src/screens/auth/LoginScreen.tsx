import { View, Text, StyleSheet, SafeAreaView } from 'react-native'

export function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logo}>tara-laro</Text>
        <Text style={styles.tagline}>Your gaming world, all in one place.</Text>
        {/* Day 4: email/password form + OAuth buttons */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 36, fontWeight: '900', color: '#FACC15', marginBottom: 8 },
  tagline: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
})
