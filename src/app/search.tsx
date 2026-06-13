import { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'
import type { Game, User, Post, PaginatedResponse } from '@/types'

interface SearchResults {
  games: Game[]
  users: User[]
  posts: Post[]
}

async function search(q: string): Promise<SearchResults> {
  if (!q.trim()) return { games: [], users: [], posts: [] }
  const [games, posts, users] = await Promise.all([
    api.get<PaginatedResponse<Game>>(`/api/games?search=${encodeURIComponent(q)}`),
    api.get<PaginatedResponse<Post>>(`/api/posts?search=${encodeURIComponent(q)}`),
    api.get<{ data: User[] }>(`/api/users?search=${encodeURIComponent(q)}`),
  ])
  return {
    games: games.data,
    users: users.data,
    posts: posts.data,
  }
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.trim().length >= 2,
  })

  const sections = [
    ...(data?.games.length ? [{ title: 'Games', data: data.games, type: 'game' as const }] : []),
    ...(data?.users.length ? [{ title: 'Players', data: data.users, type: 'user' as const }] : []),
    ...(data?.posts.length ? [{ title: 'Posts', data: data.posts, type: 'post' as const }] : []),
  ]

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search games, posts, players…"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelBtn}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {isLoading && query.length >= 2 ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FACC15" />
        </View>
      ) : query.length < 2 ? (
        <View style={styles.center}>
          <Text style={styles.hint}>Type at least 2 characters to search</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hint}>No results for "{query}"</Text>
        </View>
      ) : (
        <SectionList<Game | User | Post>
          sections={sections as any}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item, section }) => {
            if (section.type === 'game') {
              const game = item as unknown as Game
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => router.push(`/games/${game.id}`)}
                >
                  <View style={styles.rowIcon}><Text style={styles.rowIconText}>🎮</Text></View>
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{game.title}</Text>
                    <Text style={styles.rowSub}>{game.genre.slice(0, 3).join(' · ')}</Text>
                  </View>
                  <Text style={styles.rowRating}>★ {game.avgRating.toFixed(1)}</Text>
                </TouchableOpacity>
              )
            }
            if (section.type === 'user') {
              const user = item as unknown as User
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => router.push(`/users/${user.username}`)}
                >
                  <View style={styles.rowIcon}><Text style={styles.rowIconText}>👤</Text></View>
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{user.displayName}</Text>
                    <Text style={styles.rowSub}>@{user.username}</Text>
                  </View>
                  <Text style={styles.rowRating}>{user.followersCount} followers</Text>
                </TouchableOpacity>
              )
            }
            const post = item as unknown as Post
            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() => router.push(`/posts/${post.id}`)}
              >
                <View style={styles.rowIcon}><Text style={styles.rowIconText}>💬</Text></View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{post.content}</Text>
                  <Text style={styles.rowSub}>by @{post.user.username}</Text>
                </View>
              </TouchableOpacity>
            )
          }}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    gap: 8,
  },
  searchIcon: { fontSize: 15 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  clearBtn: { fontSize: 14, color: '#9CA3AF', padding: 2 },
  cancelBtn: { fontSize: 15, color: '#FACC15', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  hint: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
  sectionHeader: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  rowIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  rowIconText: { fontSize: 20 },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  rowSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  rowRating: { fontSize: 13, color: '#CA8A04', fontWeight: '600' },
  listContent: { paddingBottom: 80 },
})
