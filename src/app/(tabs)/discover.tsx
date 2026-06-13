import { useLocalSearchParams } from 'expo-router'
import { useGames } from '@/modules/games'
import { DiscoverScreen } from '@/screens/discover/DiscoverScreen'

export default function DiscoverRoute() {
  const { genre } = useLocalSearchParams<{ genre?: string }>()
  const { games, isLoading } = useGames(genre ? { genre } : undefined)
  return <DiscoverScreen games={games} isLoading={isLoading} initialGenre={genre} />
}
