import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import type { User } from '@/types'
import { formatCount } from '@/utils/format'
import { useFollow } from '../hooks/use-follow'

interface ProfileHeaderProps {
  user: User
  isOwnProfile?: boolean
  onFollowPress?: () => void
  onEditPress?: () => void
}

export function ProfileHeader({ user, isOwnProfile, onEditPress }: ProfileHeaderProps) {
  const { following, loading, toggleFollow } = useFollow(user.id)

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} contentFit="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{user.displayName.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <Text style={styles.displayName}>{user.displayName}</Text>
      <Text style={styles.username}>@{user.username}</Text>
      {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

      <View style={styles.stats}>
        <StatItem label="Posts" value={formatCount(user.postsCount)} />
        <StatItem label="Followers" value={formatCount(user.followersCount)} />
        <StatItem label="Following" value={formatCount(user.followingCount)} />
      </View>

      <View style={styles.actions}>
        {isOwnProfile ? (
          <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.followBtn, following && styles.followingBtn]}
            onPress={toggleFollow}
            disabled={loading}
          >
            <Text style={[styles.followBtnText, following && styles.followingBtnText]}>
              {loading ? '…' : following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
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
  container: { padding: 16, backgroundColor: '#FFFFFF', alignItems: 'center' },
  avatarWrap: { width: 84, height: 84, borderRadius: 42, overflow: 'hidden', marginBottom: 12, backgroundColor: '#FACC15' },
  avatarImg: { width: 84, height: 84 },
  avatarPlaceholder: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 32, fontWeight: '700', color: '#111827' },
  displayName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  username: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  bio: { fontSize: 14, color: '#374151', marginTop: 8, lineHeight: 20, textAlign: 'center', paddingHorizontal: 16 },
  stats: { flexDirection: 'row', marginTop: 16, gap: 32 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  actions: { marginTop: 14, width: '100%' },
  followBtn: {
    backgroundColor: '#FACC15',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  followBtnText: { fontWeight: '700', fontSize: 15, color: '#111827' },
  followingBtnText: { color: '#6B7280' },
  editBtn: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editBtnText: { fontWeight: '700', fontSize: 15, color: '#111827' },
})
