import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { CreateScreen } from '@/screens/create/CreateScreen'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import type { MutationResponse, Post } from '@/types'

async function uploadImages(userId: string, uris: string[]): Promise<string[]> {
  const urls: string[] = []
  for (const uri of uris) {
    const ext = uri.split('.').pop()?.split('?')[0] ?? 'jpg'
    const path = `posts/${userId}/${Date.now()}.${ext}`
    const response = await fetch(uri)
    const blob = await response.blob()
    const { error } = await supabase.storage
      .from('posts')
      .upload(path, blob, { contentType: `image/${ext}`, upsert: false })
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data } = supabase.storage.from('posts').getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}

export default function CreateRoute() {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  async function handleSubmit({ content, images, gameId }: { content: string; images: string[]; gameId: string | null }) {
    setSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token || !session?.user) throw new Error('Not authenticated')

      const imageUrls = images.length > 0 ? await uploadImages(session.user.id, images) : []

      const result = await api.post<MutationResponse<Post>>(
        '/api/posts',
        { content, images: imageUrls, gameId },
        { Authorization: `Bearer ${token}` },
      )

      queryClient.setQueryData(['feed'], (old: { pages: { data: Post[] }[] } | undefined) => {
        if (!old) return old
        return {
          ...old,
          pages: [
            { ...old.pages[0], data: [result.newData, ...(old.pages[0]?.data ?? [])] },
            ...old.pages.slice(1),
          ],
        }
      })

      router.back()
    } catch (e) {
      Alert.alert('Error', (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return <CreateScreen onSubmit={handleSubmit} submitting={submitting} />
}
