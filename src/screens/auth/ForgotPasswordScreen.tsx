import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Typography } from '@/components/ui/Typography'
import { LogoIcon } from '@/components/logo'
import { supabase } from '@/lib/supabase'
import { Colors } from '@/constants/theme'

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  async function handleReset() {
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'tara-laro://auth/reset-password',
      })
      if (error) throw error
      setSent(true)
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Typography variant="body" style={styles.backText}>← Back</Typography>
          </TouchableOpacity>
          <LogoIcon size={40} />
        </View>

        <Typography variant="h2">reset password.</Typography>
        <Typography variant="body" muted style={styles.subtitle}>
          {sent ? 'Check your email for a reset link.' : "We'll send a reset link to your email."}
        </Typography>

        {!sent ? (
          <>
            <View style={styles.inputWrap}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            <Button label="Send reset link" onPress={handleReset} loading={submitting} fullWidth />
          </>
        ) : (
          <Button
            label="Back to sign in"
            onPress={() => router.replace('/(auth)/login')}
            variant="secondary"
            fullWidth
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 32 },
  backText: { color: Colors.text2 },
  subtitle: { marginTop: 4, marginBottom: 28 },
  inputWrap: { marginBottom: 24 },
})
