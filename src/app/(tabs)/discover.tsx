import { useGames } from '@/modules/games'
import { DiscoverScreen } from '@/screens/discover/DiscoverScreen'

export default function DiscoverRoute() {
  const { games, isLoading } = useGames()
  return <DiscoverScreen games={games} isLoading={isLoading} />
}
