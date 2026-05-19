import { View, Text, StyleSheet, SafeAreaView } from 'react-native'

export function RegisterScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Create account</Text>
        {/* Day 4: email, password, username inputs */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 8 },
})
