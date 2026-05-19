import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { NewsArticle } from '@/types'
import { formatRelativeTime, truncate } from '@/utils/format'

interface NewsCardProps {
  article: NewsArticle
  onPress?: () => void
}

export function NewsCard({ article, onPress }: NewsCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.thumbnail} />
      <View style={styles.body}>
        <Text style={styles.source}>{article.source}</Text>
        <Text style={styles.title} numberOfLines={2}>{truncate(article.title, 80)}</Text>
        <Text style={styles.time}>{formatRelativeTime(article.publishedAt)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { width: 240, marginRight: 12, backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB' },
  thumbnail: { width: '100%', height: 130, backgroundColor: '#E5E7EB' },
  body: { padding: 12 },
  source: { fontSize: 11, fontWeight: '600', color: '#CA8A04', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 13, fontWeight: '600', color: '#111827', lineHeight: 18 },
  time: { fontSize: 11, color: '#9CA3AF', marginTop: 6 },
})
