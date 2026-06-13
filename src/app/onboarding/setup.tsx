import { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Typography } from '@/components/ui/Typography'
import { Avatar } from '@/components/ui/Avatar'
import { GamerIllustration } from '@/components/gamer-illustration'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import { TL } from '@/constants/tl-theme'
import type { MutationResponse } from '@/types'

export default function OnboardingSetupScreen() {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ displayName?: string; username?: string }>({})
  const { user, completeOnboarding } = useAuth()
  const router = useRouter()

  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to set a profile picture.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri)
    }
  }

  function validate() {
    const e: typeof errors = {}
    if (!displayName.trim()) e.displayName = 'Display name is required'
    if (!username.trim()) e.username = 'Username is required'
    else if (!/^[a-z0-9_]{3,20}$/.test(username.trim())) {
      e.username = '3–20 characters: letters, numbers, underscores'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate() || !user) return
    setSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      let avatarUrl: string | null = null
      if (avatarUri) {
        const ext = avatarUri.split('.').pop() ?? 'jpg'
        const path = `avatars/${user.id}.${ext}`
        const response = await fetch(avatarUri)
        const blob = await response.blob()
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, blob, { upsert: true, contentType: `image/${ext}` })
        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path)
          avatarUrl = data.publicUrl
        }
      }

      await api.post<MutationResponse<unknown>>('/api/users', {
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        avatarUrl,
      }, token ? { Authorization: `Bearer ${token}` } : {})

      await completeOnboarding()
      router.replace('/(tabs)')
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoRow}>
            <GamerIllustration size={48} />
          </View>

          <Typography variant="h2" style={{ color: TL.ink }}>set up your profile.</Typography>
          <Typography variant="body" muted style={[styles.subtitle, { color: TL.muted }]}>
            This is how the community will see you.
          </Typography>

          <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <Avatar size="xl" initials={displayName.trim().slice(0, 2) || '?'} />
            )}
            <View style={styles.avatarBadge}>
              <Typography variant="caption" style={styles.avatarBadgeText}>Edit</Typography>
            </View>
          </TouchableOpacity>

          <View style={styles.inputs}>
            <Input
              dark
              label="Display name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              placeholder="Your name"
              error={errors.displayName}
            />
            <Input
              dark
              label="Username"
              value={username}
              onChangeText={(t) => setUsername(t.toLowerCase())}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="yourhandle"
              error={errors.username}
            />
          </View>

          <View style={styles.ctaWrap}>
            <Button label="Let's go!" onPress={handleSubmit} loading={submitting} fullWidth />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  logoRow: { alignItems: 'flex-end', paddingTop: 16, paddingBottom: 28 },
  subtitle: { marginTop: 4, marginBottom: 32 },
  avatarWrap: { alignSelf: 'center', marginBottom: 32, position: 'relative' },
  avatarImg: { width: 84, height: 84, borderRadius: 42 },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: TL.amber,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  avatarBadgeText: { color: TL.bg, fontWeight: '700' },
  inputs: { gap: 14 },
  ctaWrap: { marginTop: 28, paddingBottom: 16 },
})
