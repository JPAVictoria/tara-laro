import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LogoIcon } from '@/components/logo'
import { supabase } from '@/lib/supabase'
import { TL } from '@/constants/tl-theme'

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
          <TouchableOpacity onPress={() => router.back()} disabled={submitting}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <LogoIcon size={36} />
        </View>

        <Text style={styles.heading}>reset password.</Text>
        <Text style={styles.subtitle}>
          {sent
            ? 'Check your email for a reset link.'
            : "We'll send a reset link to your email."}
        </Text>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Reset link sent!</Text>
            <Text style={styles.successSub}>Check your inbox and follow the link to set a new password.</Text>
          </View>
        ) : null}

        {!sent ? (
          <>
            <View style={styles.inputWrap}>
              <Input
                dark
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!submitting}
              />
            </View>
            <Button
              label="Send reset link"
              onPress={handleReset}
              loading={submitting}
              disabled={submitting}
              fullWidth
            />
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
  safe: { flex: 1, backgroundColor: TL.bg },
  container: { flex: 1, paddingHorizontal: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 32,
  },
  backText: { fontSize: 15, color: TL.amber, fontWeight: '600' },

  heading: { fontSize: 30, fontWeight: '900', color: TL.ink, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: TL.muted, marginTop: 4, marginBottom: 28 },

  inputWrap: { marginBottom: 24 },

  successBox: {
    backgroundColor: TL.surface,
    borderWidth: 1,
    borderColor: TL.borderStrong,
    borderRadius: TL.radius,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  successIcon: { fontSize: 36, color: TL.good },
  successText: { fontSize: 18, fontWeight: '800', color: TL.ink, marginTop: 8 },
  successSub: { fontSize: 14, color: TL.muted, textAlign: 'center', marginTop: 6, lineHeight: 20 },
})
