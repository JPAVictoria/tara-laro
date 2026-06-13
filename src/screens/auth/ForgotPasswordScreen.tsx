import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GamerIllustration } from '@/components/gamer-illustration'
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
        {/* ── Back ── */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} disabled={submitting}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* ── Illustration ── */}
        <View style={styles.hero}>
          <GamerIllustration size={96} />
        </View>

        {/* ── Heading ── */}
        <Text style={styles.heading}>reset password</Text>
        <Text style={styles.subtitle}>
          {sent
            ? 'Check your inbox and tap the link to set a new password.'
            : "Enter your email and we'll send you a reset link."}
        </Text>

        {/* ── Form ── */}
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
          <>
            <View style={styles.successCard}>
              <Text style={styles.successCheck}>✓</Text>
              <Text style={styles.successTitle}>Link sent!</Text>
            </View>
            <Button
              label="Back to sign in"
              onPress={() => router.replace('/(auth)/login')}
              fullWidth
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  container: { flex: 1, paddingHorizontal: 24 },

  backRow: { paddingTop: 16, paddingBottom: 4 },
  backText: { fontSize: 15, color: TL.amber, fontWeight: '600' },

  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 8 },

  heading: { fontSize: 28, fontWeight: '900', color: TL.ink, letterSpacing: -0.5, marginTop: 8 },
  subtitle: { fontSize: 14, color: TL.muted, marginTop: 6, marginBottom: 28, lineHeight: 21 },

  inputWrap: { marginBottom: 24 },

  successCard: {
    backgroundColor: TL.surface,
    borderWidth: 1,
    borderColor: TL.borderStrong,
    borderRadius: TL.radius,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 28,
  },
  successCheck: { fontSize: 40, color: TL.good },
  successTitle: { fontSize: 17, fontWeight: '800', color: TL.ink, marginTop: 8 },
})
