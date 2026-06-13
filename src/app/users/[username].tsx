import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { ProfileHeader } from '@/modules/profile'
import { PostGrid } from '@/modules/profile'
import type { User, ApiResponse, PaginatedResponse, Post } from '@/types'

async function fetchUserByUsername(username: string): Promise<User | null> {
  const res = await api.get<ApiResponse<User>>(`/api/users/by-username/${encodeURIComponent(username)}`)
  return res.data
}

async function fetchUserPosts(userId: string): Promise<Post[]> {
  const res = await api.get<PaginatedResponse<Post>>(`/api/posts?userId=${userId}`)
  return res.data
}

export default function PublicProfileRoute() {
  const { username } = useLocalSearchParams<{ username: string }>()
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUserByUsername(username),
  })

  const { data: posts = [] } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: () => fetchUserPosts(user!.id),
    enabled: !!user?.id,
  })

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>@{username}</Text>
        <View style={styles.spacer} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FACC15" />
        </View>
      ) : !user ? (
        <View style={styles.center}>
          <Text style={styles.notFound}>User not found</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <ProfileHeader user={user} isOwnProfile={false} />
          <PostGrid posts={posts} onPostPress={(post) => router.push(`/posts/${post.id}`)} />
        </ScrollView>
      )}
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
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: '#111827' },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#111827' },
  spacer: { width: 30 },
  scroll: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  notFound: { fontSize: 16, color: '#6B7280' },
})
