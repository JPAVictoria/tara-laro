import { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestLoading, setGuestLoading] = useState(false)
  const { signInWithEmail, signInWithOAuth, signInAsGuest } = useAuth()
  const router = useRouter()

  const busy = submitting || guestLoading

  async function handleSignIn() {
    if (!email.trim() || !password) return
    setError(null)
    setSubmitting(true)
    try {
      await signInWithEmail(email.trim(), password)
      setRedirecting(true)
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

  async function handleGuest() {
    setGuestLoading(true)
    try {
      await signInAsGuest()
      setRedirecting(true)
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
      setGuestLoading(false)
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
          {/* ── Hero ── */}
          <View style={styles.hero}>
            <GamerIllustration size={152} />
            <Text style={styles.wordmark}>TaraLaro</Text>
            <Text style={styles.tagline}>your gaming world.</Text>
          </View>

          {/* ── Divider ── */}
          <View style={styles.dividerFull} />

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

            <View>
              <Input
                dark
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                error={error}
                editable={!busy}
              />
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotRow}
                disabled={busy}
              >
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── CTA ── */}
          <View style={styles.cta}>
            <Button label="Sign in" onPress={handleSignIn} loading={submitting} disabled={busy} fullWidth />
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

          {/* ── Guest ── */}
          <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} disabled={busy}>
            <Text style={styles.guestText}>{guestLoading ? 'Signing in…' : 'Continue as guest'}</Text>
          </TouchableOpacity>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text style={styles.footerMuted}>New here?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={busy}>
              <Text style={styles.link}> Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Redirect splash overlay ── */}
      {redirecting && (
        <View style={styles.overlay} pointerEvents="box-only">
          <GamerIllustration size={110} />
          <Text style={styles.overlayWordmark}>TaraLaro</Text>
          <ActivityIndicator color={TL.amber} size="large" style={styles.overlaySpinner} />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  kav: { flex: 1 },
  scroll: { flexGrow: 1 },

  hero: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  wordmark: { fontSize: 34, fontWeight: '900', color: TL.ink, letterSpacing: -1, marginTop: 8 },
  tagline: { fontSize: 13, color: TL.muted, marginTop: 2, letterSpacing: 0.2 },

  dividerFull: { height: StyleSheet.hairlineWidth, backgroundColor: TL.faint, marginHorizontal: 24, marginBottom: 28 },

  form: { paddingHorizontal: 24, gap: 16 },
  forgotRow: { alignSelf: 'flex-end', marginTop: 10 },
  link: { fontSize: 13, color: TL.amber, fontWeight: '700' },

  cta: { marginTop: 24, paddingHorizontal: 24 },

  orRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginVertical: 20 },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: TL.faint },
  orLabel: { marginHorizontal: 12, fontSize: 11, color: TL.muted },

  oauth: { flexDirection: 'row', justifyContent: 'center', gap: 16 },

  guestBtn: { alignSelf: 'center', marginTop: 20, paddingVertical: 8 },
  guestText: { fontSize: 13, color: TL.muted },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, paddingBottom: 28 },
  footerMuted: { fontSize: 13, color: TL.muted },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TL.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  overlayWordmark: { fontSize: 32, fontWeight: '900', color: TL.ink, letterSpacing: -1, marginTop: 12 },
  overlaySpinner: { marginTop: 32 },
})
