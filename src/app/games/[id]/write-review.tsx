import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import { RatingStars } from '@/modules/games'
import type { MutationResponse, Review } from '@/types'

export default function WriteReviewScreen() {
  const { id: gameId } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (rating === 0) { Alert.alert('Rating required', 'Please select a star rating.'); return }
    if (!content.trim()) { Alert.alert('Review required', 'Please write a short review.'); return }

    setSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      await api.post<MutationResponse<Review>>(
        '/api/reviews',
        { gameId, rating, content: content.trim() },
        { Authorization: `Bearer ${token}` },
      )

      void queryClient.invalidateQueries({ queryKey: ['game', gameId] })
      router.back()
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Write a Review</Text>
          <TouchableOpacity
            style={[styles.submitBtn, (!rating || !content.trim()) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting || !rating || !content.trim()}
          >
            <Text style={styles.submitBtnText}>{submitting ? '…' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <Text style={[styles.star, star <= rating && styles.starFilled]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your thoughts about this game…"
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{content.length}/1000</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  cancelText: { fontSize: 16, color: '#6B7280' },
  heading: { fontSize: 16, fontWeight: '700', color: '#111827' },
  submitBtn: { backgroundColor: '#FACC15', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 7 },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  starBtn: { padding: 4 },
  star: { fontSize: 36, color: '#E5E7EB' },
  starFilled: { color: '#FACC15' },
  reviewInput: {
    height: 180,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  charCount: { fontSize: 11, color: '#9CA3AF', textAlign: 'right' },
})
