import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PostDetailScreen } from '@/screens/posts/PostDetailScreen'
import { TL } from '@/constants/tl-theme'

export default function PostDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Post</Text>
        <View style={styles.spacer} />
      </View>
      <PostDetailScreen postId={id} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TL.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TL.border,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: TL.ink },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: TL.ink },
  spacer: { width: 30 },
})
