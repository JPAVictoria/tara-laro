import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 52, xl: 84 }

interface AvatarProps {
  uri?: string | null
  initials?: string
  size?: AvatarSize
}

export function Avatar({ uri, initials, size = 'md' }: AvatarProps) {
  const dim = sizes[size]
  const radius = dim / 2
  const fontSize = Math.round(dim * 0.36)

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: dim, height: dim, borderRadius: radius }}
        contentFit='cover'
        transition={200}
      />
    )
  }

  return (
    <View style={[styles.fallback, { width: dim, height: dim, borderRadius: radius }]}>
      <Text style={[styles.initials, { fontSize }]}>{(initials ?? '?').slice(0, 2).toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: '#FEF08A', alignItems: 'center', justifyContent: 'center' },
  initials: { fontWeight: '700', color: '#CA8A04' },
})
