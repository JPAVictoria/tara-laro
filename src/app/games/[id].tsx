import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GameDetailScreen } from '@/screens/games/GameDetailScreen'

export default function GameDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>
      <GameDetailScreen gameId={id} />
    </SafeAreaView>
  )
}

import { TL } from '@/constants/tl-theme'

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: TL.ink },
})
