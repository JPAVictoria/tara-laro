import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated'
import { formatCount } from '@/utils/format'

interface PostActionsProps {
  likesCount: number
  commentsCount: number
  isLiked: boolean
  onLike: () => void
  onComment: () => void
  onShare?: () => void
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export function PostActions({ likesCount, commentsCount, isLiked, onLike, onComment }: PostActionsProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  function handleLike() {
    scale.value = withSequence(withSpring(1.4, { duration: 150 }), withSpring(1, { duration: 150 }))
    onLike()
  }

  return (
    <View style={styles.row}>
      <AnimatedTouchable style={[styles.action, animatedStyle]} onPress={handleLike}>
        <Text style={[styles.icon, isLiked && styles.liked]}>♥</Text>
        <Text style={styles.count}>{formatCount(likesCount)}</Text>
      </AnimatedTouchable>
      <TouchableOpacity style={styles.action} onPress={onComment}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{formatCount(commentsCount)}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingVertical: 8 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon: { fontSize: 20, color: '#6B7280' },
  liked: { color: '#FACC15' },
  count: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
})
