import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { GameCard } from '@/modules/games'
import { NewsCard, useNews } from '@/modules/news'
import type { Game } from '@/types'

const GENRES = ['All', 'RPG', 'Action', 'Indie', 'Roguelike', 'Simulation', 'Souls-like']

interface DiscoverScreenProps {
  games: Game[]
  isLoading: boolean
}

export function DiscoverScreen({ games, isLoading }: DiscoverScreenProps) {
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')
  const router = useRouter()
  const { articles } = useNews()

  const filtered = games.filter((g) => {
    const matchesSearch = search.trim()
      ? g.title.toLowerCase().includes(search.toLowerCase())
      : true
    const matchesGenre = activeGenre === 'All' ? true : g.genre.includes(activeGenre)
    return matchesSearch && matchesGenre
  })

  const trending = [...games].sort((a, b) => b.avgRating - a.avgRating).slice(0, 8)
  const newReleases = [...games]
    .filter((g) => g.releaseDate != null)
    .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
    .slice(0, 8)

  const showSections = !search.trim() && activeGenre === 'All'

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search games…"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreRow}
      >
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genreChip, activeGenre === g && styles.genreChipActive]}
            onPress={() => setActiveGenre(g)}
          >
            <Text style={[styles.genreChipText, activeGenre === g && styles.genreChipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FACC15" />
        </View>
      ) : showSections ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {articles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gaming News</Text>
              <FlatList
                horizontal
                data={articles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NewsCard article={item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}
          <Section title="Trending Games" games={trending} onPress={(id) => router.push(`/games/${id}`)} />
          <Section title="New Releases" games={newReleases} onPress={(id) => router.push(`/games/${id}`)} />
          <Section title="All Games" games={games} onPress={(id) => router.push(`/games/${id}`)} />
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard game={item} onPress={() => router.push(`/games/${item.id}`)} />
          )}
          contentContainerStyle={styles.flatContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No games found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

function Section({
  title,
  games,
  onPress,
}: {
  title: string
  games: Game[]
  onPress: (id: string) => void
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard game={item} onPress={() => onPress(item.id)} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  clearBtn: { fontSize: 14, color: '#9CA3AF', padding: 4 },
  genreScroll: { flexGrow: 0 },
  genreRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genreChipActive: { backgroundColor: '#FACC15', borderColor: '#FACC15' },
  genreChipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  genreChipTextActive: { color: '#111827' },
  scroll: { flex: 1 },
  content: { paddingBottom: 80 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', paddingHorizontal: 16, marginBottom: 12 },
  horizontalList: { paddingHorizontal: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 14, color: '#6B7280' },
  flatContent: { paddingHorizontal: 12, paddingBottom: 80 },
  row: { gap: 8, marginBottom: 8 },
})
