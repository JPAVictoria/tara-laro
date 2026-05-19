import { View, Text, StyleSheet, SafeAreaView } from 'react-native'

export function ForgotPasswordScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset password</Text>
        {/* Day 4: email input + submit */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 8 },
})
