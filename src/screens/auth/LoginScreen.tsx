import { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Typography } from '@/components/ui/Typography'
import { OAuthButton } from '@/modules/auth'
import { LogoWordmark } from '@/components/logo'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { Colors } from '@/constants/theme'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestLoading, setGuestLoading] = useState(false)
  const { signInWithEmail, signInWithOAuth, signInAsGuest } = useAuth()
  const router = useRouter()

  async function handleSignIn() {
    if (!email.trim() || !password) return
    setError(null)
    setSubmitting(true)
    try {
      await signInWithEmail(email.trim(), password)
    } catch (e) {
      setError((e as Error).message)
    } finally {
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
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
    } finally {
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
        >
          <View style={styles.logoSection}>
            <LogoWordmark iconSize={56} />
          </View>

          <Typography variant="h2">welcome back.</Typography>
          <Typography variant="body" muted style={styles.subtitle}>Sign in to continue</Typography>

          <View style={styles.inputs}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              error={error}
            />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotRow}>
            <Typography variant="body-sm" style={styles.link}>Forgot password?</Typography>
          </TouchableOpacity>

          <View style={styles.ctaWrap}>
            <Button label="Sign in" onPress={handleSignIn} loading={submitting} fullWidth />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Typography variant="caption" style={styles.dividerLabel}>or</Typography>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauth}>
            <OAuthButton provider="google" onPress={() => handleOAuth('google')} />
            <OAuthButton provider="discord" onPress={() => handleOAuth('discord')} />
          </View>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} disabled={guestLoading}>
            <Typography variant="body-sm" style={styles.guestText}>
              {guestLoading ? 'Signing in…' : 'Continue as guest'}
            </Typography>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Typography variant="body-sm" muted>New here?</Typography>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Typography variant="body-sm" style={styles.link}> Create account</Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  logoSection: { alignItems: 'center', paddingTop: 48, paddingBottom: 36 },
  subtitle: { marginTop: 4, marginBottom: 24 },
  inputs: { gap: 14 },
  forgotRow: { alignSelf: 'flex-end', marginTop: 10 },
  link: { color: Colors.primaryDark, fontWeight: '700' },
  ctaWrap: { marginTop: 24 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.muted },
  dividerLabel: { marginHorizontal: 12 },
  oauth: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  guestBtn: { alignSelf: 'center', marginTop: 24, paddingVertical: 8 },
  guestText: { color: Colors.text2 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, paddingBottom: 16 },
})
