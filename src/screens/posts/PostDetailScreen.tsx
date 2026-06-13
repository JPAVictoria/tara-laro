import { View, FlatList, StyleSheet, ActivityIndicator, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import { PostCard } from '@/modules/feed'
import { CommentItem } from '@/modules/posts'
import type { Post, Comment, ApiResponse, MutationResponse } from '@/types'
import { useState } from 'react'

interface PostWithComments extends Post {
  comments: Comment[]
}

async function fetchPost(id: string): Promise<PostWithComments> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  const res = await api.get<ApiResponse<PostWithComments>>(
    `/api/posts/${id}`,
    token ? { Authorization: `Bearer ${token}` } : {},
  )
  if (!res.data) throw new Error(res.error ?? 'Post not found')
  return res.data
}

interface PostDetailScreenProps {
  postId: string
}

export function PostDetailScreen({ postId }: PostDetailScreenProps) {
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
  })

  async function handleComment() {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    const text = commentText.trim()
    setCommentText('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')
      const res = await api.post<MutationResponse<Comment>>(
        `/api/posts/${postId}/comments`,
        { content: text },
        { Authorization: `Bearer ${token}` },
      )
      queryClient.setQueryData(['post', postId], (old: PostWithComments | undefined) => {
        if (!old) return old
        return { ...old, comments: [...old.comments, res.newData], commentsCount: old.commentsCount + 1 }
      })
    } catch {
      setCommentText(text)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FACC15" />
      </View>
    )
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Post not found</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={post.comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={<PostCard post={post} />}
        ListFooterComponent={<View style={{ height: 80 }} />}
        style={styles.list}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment…"
          placeholderTextColor="#9CA3AF"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          editable={!submitting}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!commentText.trim() || submitting) && styles.sendBtnDisabled]}
          onPress={handleComment}
          disabled={!commentText.trim() || submitting}
        >
          <Text style={styles.sendBtnText}>{submitting ? '…' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  error: { color: '#6B7280', fontSize: 16 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  sendBtn: {
    backgroundColor: '#FACC15',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { fontWeight: '700', fontSize: 14, color: '#111827' },
})
