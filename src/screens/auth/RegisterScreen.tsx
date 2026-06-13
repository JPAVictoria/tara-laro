import { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OAuthButton } from '@/modules/auth'
import { GamerIllustration } from '@/components/gamer-illustration'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { TL } from '@/constants/tl-theme'

export function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUpWithEmail, signInWithOAuth } = useAuth()
  const router = useRouter()

  const busy = submitting

  async function handleRegister() {
    if (!email.trim() || !password || !confirm) return
    if (password !== confirm) { setError("Passwords don't match"); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError(null)
    setSubmitting(true)
    try {
      const hasSession = await signUpWithEmail(email.trim(), password)
      if (hasSession) {
        router.replace('/onboarding/setup')
      } else {
        setSubmitting(false)
        Alert.alert(
          'Check your email',
          'We sent a confirmation link to ' + email.trim() + '. Click it to finish creating your account.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
        )
      }
    } catch (e) {
      setError((e as Error).message)
      setSubmitting(false)
    }
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    try {
      await signInWithOAuth(provider)
    } catch (e) {
      Alert.alert('OAuth Error', (e as Error).message)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!busy}
        >
          {/* ── Back ── */}
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => router.back()} disabled={busy}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* ── Hero ── */}
          <View style={styles.hero}>
            <GamerIllustration size={112} />
            <Text style={styles.wordmark}>TaraLaro</Text>
          </View>

          {/* ── Section label ── */}
          <Text style={styles.sectionLabel}>CREATE ACCOUNT</Text>

          {/* ── Form ── */}
          <View style={styles.form}>
            <Input
              dark
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!busy}
            />
            <Input
              dark
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              editable={!busy}
            />
            <Input
              dark
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
              error={error}
              editable={!busy}
            />
          </View>

          {/* ── CTA ── */}
          <View style={styles.cta}>
            <Button label="Create account" onPress={handleRegister} loading={submitting} disabled={busy} fullWidth />
          </View>

          {/* ── Or divider ── */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orLabel}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* ── OAuth ── */}
          <View style={styles.oauth}>
            <OAuthButton dark provider="google" onPress={() => handleOAuth('google')} disabled={busy} />
            <OAuthButton dark provider="discord" onPress={() => handleOAuth('discord')} disabled={busy} />
          </View>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text style={styles.footerMuted}>Already have one?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')} disabled={busy}>
              <Text style={styles.link}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  kav: { flex: 1 },
  scroll: { flexGrow: 1 },

  backRow: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4 },
  backText: { fontSize: 15, color: TL.amber, fontWeight: '600' },

  hero: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  wordmark: { fontSize: 26, fontWeight: '900', color: TL.ink, letterSpacing: -0.5, marginTop: 6 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TL.muted,
    letterSpacing: 1.2,
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
  },

  form: { paddingHorizontal: 24, gap: 14 },
  cta: { marginTop: 24, paddingHorizontal: 24 },

  orRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginVertical: 20 },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: TL.faint },
  orLabel: { marginHorizontal: 12, fontSize: 11, color: TL.muted },

  oauth: { flexDirection: 'row', justifyContent: 'center', gap: 16 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, paddingBottom: 28 },
  footerMuted: { fontSize: 13, color: TL.muted },
  link: { fontSize: 13, color: TL.amber, fontWeight: '700' },


})
