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
import { Typography } from '@/components/ui/Typography'
import { OAuthButton } from '@/modules/auth'
import { LogoIcon } from '@/components/logo'
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
      // Keep submitting=true — navigation will unmount this screen
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
      // Keep guestLoading=true — navigation will unmount
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
          <View style={styles.illustrationSection}>
            <GamerIllustration size={148} />
            <Text style={styles.wordmark}>TaraLaro</Text>
          </View>

          <Text style={styles.heading}>welcome back.</Text>
          <Text style={styles.subtitle}>sign in to continue</Text>

          <View style={styles.inputs}>
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
              autoComplete="current-password"
              error={error}
              editable={!busy}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotRow}
            disabled={busy}
          >
            <Typography variant="body-sm" style={styles.link}>Forgot password?</Typography>
          </TouchableOpacity>

          <View style={styles.ctaWrap}>
            <Button label="Sign in" onPress={handleSignIn} loading={submitting} disabled={busy} fullWidth />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauth}>
            <OAuthButton dark provider="google" onPress={() => handleOAuth('google')} disabled={busy} />
            <OAuthButton dark provider="discord" onPress={() => handleOAuth('discord')} disabled={busy} />
          </View>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} disabled={busy}>
            <Text style={styles.guestText}>
              {guestLoading ? 'Signing in…' : 'Continue as guest'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerMuted}>New here?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={busy}>
              <Text style={styles.link}> Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {redirecting && (
        <View style={styles.redirectOverlay} pointerEvents="box-only">
          <LogoIcon size={64} />
          <Text style={styles.redirectWordmark}>TaraLaro</Text>
          <ActivityIndicator color={TL.amber} size="large" style={styles.redirectSpinner} />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },

  illustrationSection: { alignItems: 'center', paddingTop: 40, paddingBottom: 8 },
  wordmark: { fontSize: 28, fontWeight: '900', color: TL.ink, letterSpacing: -0.5, marginTop: 6 },

  heading: { fontSize: 30, fontWeight: '900', color: TL.ink, letterSpacing: -0.5, marginTop: 24 },
  subtitle: { fontSize: 15, color: TL.muted, marginTop: 4, marginBottom: 24 },

  inputs: { gap: 14 },
  forgotRow: { alignSelf: 'flex-end', marginTop: 10 },
  link: { color: TL.amber, fontWeight: '700', fontSize: 13 },

  ctaWrap: { marginTop: 24 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: TL.faint },
  dividerLabel: { marginHorizontal: 12, fontSize: 11, color: TL.muted },

  oauth: { flexDirection: 'row', justifyContent: 'center', gap: 16 },

  guestBtn: { alignSelf: 'center', marginTop: 24, paddingVertical: 8 },
  guestText: { fontSize: 13, color: TL.muted },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, paddingBottom: 24 },
  footerMuted: { fontSize: 13, color: TL.muted },

  redirectOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TL.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  redirectWordmark: {
    fontSize: 32,
    fontWeight: '900',
    color: TL.ink,
    letterSpacing: -0.5,
    marginTop: 12,
  },
  redirectSpinner: { marginTop: 32 },
})
