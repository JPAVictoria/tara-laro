import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useGames } from '@/modules/games'
import { TL } from '@/constants/tl-theme'
import type { Game } from '@/types'

const MAX_IMAGES = 5

interface CreateScreenProps {
  onSubmit?: (data: { content: string; images: string[]; gameId: string | null }) => Promise<void>
  submitting?: boolean
}

export function CreateScreen({ onSubmit, submitting }: CreateScreenProps) {
  const [caption, setCaption] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showGamePicker, setShowGamePicker] = useState(false)
  const [gameSearch, setGameSearch] = useState('')
  const router = useRouter()
  const { games } = useGames()

  const filteredGames = gameSearch.trim()
    ? games.filter((g) => g.title.toLowerCase().includes(gameSearch.toLowerCase()))
    : games.slice(0, 20)

  async function pickImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to add images to your post.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.8,
    })
    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri)
      setImages((prev) => [...prev, ...newUris].slice(0, MAX_IMAGES))
    }
  }

  function removeImage(uri: string) {
    setImages((prev) => prev.filter((u) => u !== uri))
  }

  async function handlePost() {
    if (!caption.trim() && images.length === 0) {
      Alert.alert('Empty post', 'Add a caption or at least one image.')
      return
    }
    await onSubmit?.({ content: caption.trim(), images, gameId: selectedGame?.id ?? null })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>New Post</Text>
          <TouchableOpacity
            style={[styles.postBtn, (!caption.trim() && images.length === 0) && styles.postBtnDisabled]}
            onPress={handlePost}
            disabled={submitting || (!caption.trim() && images.length === 0)}
          >
            <Text style={styles.postBtnText}>{submitting ? 'Posting…' : 'Post'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.captionInput}
            placeholder="What are you playing? Share your thoughts…"
            placeholderTextColor={TL.muted}
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={500}
          />

          {images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {images.map((uri) => (
                <View key={uri} style={styles.imageWrap}>
                  <Image source={{ uri }} style={styles.previewImage} contentFit="cover" />
                  <TouchableOpacity style={styles.removeImg} onPress={() => removeImage(uri)}>
                    <Text style={styles.removeImgText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.actions}>
            {images.length < MAX_IMAGES && (
              <TouchableOpacity style={styles.actionBtn} onPress={pickImages}>
                <Text style={styles.actionIcon}>🖼</Text>
                <Text style={styles.actionLabel}>Photo ({images.length}/{MAX_IMAGES})</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowGamePicker(!showGamePicker)}>
              <Text style={styles.actionIcon}>🎮</Text>
              <Text style={styles.actionLabel}>{selectedGame ? selectedGame.title : 'Tag a game'}</Text>
              {selectedGame && (
                <TouchableOpacity onPress={() => setSelectedGame(null)}>
                  <Text style={styles.clearGame}>✕</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {showGamePicker && (
            <View style={styles.gamePicker}>
              <TextInput
                style={styles.gameSearchInput}
                placeholder="Search games…"
                placeholderTextColor={TL.muted}
                value={gameSearch}
                onChangeText={setGameSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FlatList
                data={filteredGames}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.gameRow, selectedGame?.id === item.id && styles.gameRowSelected]}
                    onPress={() => { setSelectedGame(item); setShowGamePicker(false) }}
                  >
                    <Text style={styles.gameRowTitle}>{item.title}</Text>
                  </TouchableOpacity>
                )}
                style={styles.gameList}
                scrollEnabled={false}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TL.border,
  },
  cancelText: { fontSize: 16, color: TL.muted },
  heading: { fontSize: 16, fontWeight: '700', color: TL.ink },
  postBtn: {
    backgroundColor: TL.amber,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { fontSize: 14, fontWeight: '700', color: TL.bg },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16 },
  captionInput: {
    fontSize: 16,
    color: TL.ink,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  imageRow: { flexGrow: 0 },
  imageWrap: { position: 'relative', marginRight: 8 },
  previewImage: { width: 120, height: 120, borderRadius: 10 },
  removeImg: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImgText: { color: TL.ink, fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: TL.surface2,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TL.borderStrong,
  },
  actionIcon: { fontSize: 16 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: TL.ink2 },
  clearGame: { fontSize: 12, color: TL.muted, marginLeft: 4 },
  gamePicker: {
    borderWidth: 1,
    borderColor: TL.border,
    borderRadius: TL.radiusSm,
    overflow: 'hidden',
    backgroundColor: TL.surface,
  },
  gameSearchInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: TL.ink,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TL.border,
  },
  gameList: { maxHeight: 200 },
  gameRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TL.border,
  },
  gameRowSelected: { backgroundColor: TL.amberSoft },
  gameRowTitle: { fontSize: 14, color: TL.ink },
})
