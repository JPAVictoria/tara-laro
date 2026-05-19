import { View, Text, StyleSheet } from 'react-native'
import type { User } from '@/types'
import { formatCount } from '@/utils/format'

interface ProfileHeaderProps {
  user: User
  isOwnProfile?: boolean
  onFollowPress?: () => void
  onEditPress?: () => void
}

export function ProfileHeader({ user, isOwnProfile, onEditPress, onFollowPress }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.displayName}>{user.displayName}</Text>
      <Text style={styles.username}>@{user.username}</Text>
      {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
      <View style={styles.stats}>
        <StatItem label='Posts' value={formatCount(user.postsCount)} />
        <StatItem label='Followers' value={formatCount(user.followersCount)} />
        <StatItem label='Following' value={formatCount(user.followingCount)} />
      </View>
    </View>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#FFFFFF' },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#E5E7EB', marginBottom: 12 },
  displayName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  username: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  bio: { fontSize: 14, color: '#374151', marginTop: 8, lineHeight: 20 },
  stats: { flexDirection: 'row', marginTop: 16, gap: 32 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
})
