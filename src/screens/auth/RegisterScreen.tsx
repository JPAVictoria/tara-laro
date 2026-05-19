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
import { LogoIcon } from '@/components/logo'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { Colors } from '@/constants/theme'

export function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUpWithEmail, signInWithOAuth } = useAuth()
  const router = useRouter()

  async function handleRegister() {
    if (!email.trim() || !password || !confirm) return
    if (password !== confirm) { setError("Passwords don't match"); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError(null)
    setSubmitting(true)
    try {
      await signUpWithEmail(email.trim(), password)
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

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Typography variant="body" style={styles.backText}>← Back</Typography>
            </TouchableOpacity>
            <LogoIcon size={40} />
          </View>

          <Typography variant="h2">create account.</Typography>
          <Typography variant="body" muted style={styles.subtitle}>Join the gaming community</Typography>

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
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
              error={error}
            />
          </View>

          <View style={styles.ctaWrap}>
            <Button label="Create account" onPress={handleRegister} loading={submitting} fullWidth />
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

          <View style={styles.footer}>
            <Typography variant="body-sm" muted>Already have one?</Typography>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Typography variant="body-sm" style={styles.link}> Sign in</Typography>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 32 },
  backText: { color: Colors.text2 },
  subtitle: { marginTop: 4, marginBottom: 24 },
  inputs: { gap: 14 },
  ctaWrap: { marginTop: 24 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.muted },
  dividerLabel: { marginHorizontal: 12 },
  oauth: { gap: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingBottom: 16 },
  link: { color: Colors.primaryDark, fontWeight: '700' },
})
