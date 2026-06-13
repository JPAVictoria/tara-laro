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
import { LogoIcon } from '@/components/logo'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { TL } from '@/constants/tl-theme'

export function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
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
      await signUpWithEmail(email.trim(), password)
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

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!busy}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} disabled={busy}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <LogoIcon size={36} />
          </View>

          <Text style={styles.heading}>create account.</Text>
          <Text style={styles.subtitle}>join the gaming community</Text>

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

          <View style={styles.ctaWrap}>
            <Button label="Create account" onPress={handleRegister} loading={submitting} disabled={busy} fullWidth />
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

          <View style={styles.footer}>
            <Text style={styles.footerMuted}>Already have one?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')} disabled={busy}>
              <Text style={styles.link}> Sign in</Text>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 28,
  },
  backText: { fontSize: 15, color: TL.amber, fontWeight: '600' },

  heading: { fontSize: 30, fontWeight: '900', color: TL.ink, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: TL.muted, marginTop: 4, marginBottom: 24 },

  inputs: { gap: 14 },
  ctaWrap: { marginTop: 24 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: TL.faint },
  dividerLabel: { marginHorizontal: 12, fontSize: 11, color: TL.muted },

  oauth: { flexDirection: 'row', justifyContent: 'center', gap: 16 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, paddingBottom: 24 },
  footerMuted: { fontSize: 13, color: TL.muted },
  link: { fontSize: 13, color: TL.amber, fontWeight: '700' },

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
