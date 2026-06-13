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
import { TL } from '@/constants/tl-theme'
import type { Game } from '@/types'

const GENRES = ['All', 'RPG', 'Action', 'Indie', 'Roguelike', 'Simulation', 'Souls-like']

interface DiscoverScreenProps {
  games: Game[]
  isLoading: boolean
  initialGenre?: string
}

export function DiscoverScreen({ games, isLoading, initialGenre }: DiscoverScreenProps) {
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState(initialGenre ?? 'All')
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
          <ActivityIndicator color={TL.amber} />
        </View>
      ) : showSections ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {articles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gaming News</Text>
              <FlatList
                horizontal
                data={articles}
                keyExtractor={(item) => item.url}
                renderItem={({ item }) => <NewsCard article={item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}
          <Section
            title="Trending Games"
            games={trending}
            onPress={(id) => router.push(`/games/${id}`)}
            onSeeAll={() => router.push('/search')}
          />
          <Section
            title="New Releases"
            games={newReleases}
            onPress={(id) => router.push(`/games/${id}`)}
            onSeeAll={() => router.push('/search')}
          />
          <Section
            title="All Games"
            games={games}
            onPress={(id) => router.push(`/games/${id}`)}
            onSeeAll={() => router.push('/search')}
          />
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
  onSeeAll,
}: {
  title: string
  games: Game[]
  onPress: (id: string) => void
  onSeeAll?: () => void
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        )}
      </View>
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
  safe: { flex: 1, backgroundColor: TL.bg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TL.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TL.borderStrong,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: TL.ink },
  clearBtn: { fontSize: 14, color: TL.faint, padding: 4 },
  genreScroll: { flexGrow: 0 },
  genreRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TL.surface,
    borderWidth: 1,
    borderColor: TL.borderStrong,
  },
  genreChipActive: { backgroundColor: TL.amber, borderColor: TL.amber },
  genreChipText: { fontSize: 13, fontWeight: '600', color: TL.muted },
  genreChipTextActive: { color: TL.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 80 },
  section: { marginTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TL.ink },
  seeAll: { fontSize: 13, fontWeight: '600', color: TL.amber },
  horizontalList: { paddingHorizontal: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 14, color: TL.muted },
  flatContent: { paddingHorizontal: 12, paddingBottom: 80 },
  row: { gap: 8, marginBottom: 8 },
})
