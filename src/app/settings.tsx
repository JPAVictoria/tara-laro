import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import type { MutationResponse, User } from '@/types'

export default function SettingsScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo access to update your avatar.'); return }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled && result.assets[0]) setAvatarUri(result.assets[0].uri)
  }

  async function handleSave() {
    if (!displayName.trim() && !bio.trim() && !avatarUri) {
      Alert.alert('Nothing to save', 'Edit at least one field.')
      return
    }
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token || !session?.user) throw new Error('Not authenticated')

      const dbRes = await api.get<{ data: User | null }>(`/api/users/by-username/${session.user.email ?? ''}`)
      const userId = dbRes.data?.id
      if (!userId) throw new Error('User not found')

      let avatarUrl: string | undefined
      if (avatarUri) {
        const ext = avatarUri.split('.').pop() ?? 'jpg'
        const path = `avatars/${session.user.id}.${ext}`
        const response = await fetch(avatarUri)
        const blob = await response.blob()
        await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: `image/${ext}` })
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        avatarUrl = data.publicUrl
      }

      await api.patch<MutationResponse<User>>(
        `/api/users/${userId}`,
        {
          ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
          ...(bio.trim() ? { bio: bio.trim() } : {}),
          ...(avatarUrl ? { avatarUrl } : {}),
        },
        { Authorization: `Bearer ${token}` },
      )

      Alert.alert('Saved', 'Profile updated.')
      setDisplayName('')
      setBio('')
      setAvatarUri(null)
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    const { data: { session } } = await supabase.auth.getSession()
    const email = session?.user.email
    if (!email) return
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) Alert.alert('Error', error.message)
    else Alert.alert('Email sent', 'Check your inbox for a password reset link.')
  }

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>EDIT PROFILE</Text>

          <TouchableOpacity style={styles.avatarRow} onPress={pickAvatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>📷</Text>
              </View>
            )}
            <Text style={styles.avatarLabel}>Change profile photo</Text>
          </TouchableOpacity>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display name</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Enter new display name"
              placeholderTextColor="#9CA3AF"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.fieldInput, styles.bioInput]}
              placeholder="Tell us about yourself"
              placeholderTextColor="#9CA3AF"
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>ACCOUNT</Text>

          <TouchableOpacity style={styles.row} onPress={handleChangePassword}>
            <Text style={styles.rowText}>Change Password</Text>
            <Text style={styles.rowArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>DANGER ZONE</Text>

          <TouchableOpacity style={[styles.row, styles.rowDanger]} onPress={handleSignOut}>
            <Text style={styles.rowDangerText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backText: { fontSize: 22, color: '#111827', padding: 4 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#111827' },
  spacer: { width: 30 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 80, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginTop: 8 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  avatarPlaceholderText: { fontSize: 24 },
  avatarLabel: { fontSize: 14, color: '#CA8A04', fontWeight: '600' },
  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  bioInput: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#FACC15', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#111827' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB', marginVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowText: { fontSize: 15, color: '#111827' },
  rowArrow: { fontSize: 16, color: '#9CA3AF' },
  rowDanger: { borderColor: '#FCA5A5' },
  rowDangerText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
})
