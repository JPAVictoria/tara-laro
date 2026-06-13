import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import type { MutationResponse } from '@/types'

interface FollowResult {
  followerId: string
  followeeId: string
  following: boolean
}

export function useFollow(userId: string, initiallyFollowing = false) {
  const [following, setFollowing] = useState(initiallyFollowing)
  const [loading, setLoading] = useState(false)

  async function toggleFollow() {
    setLoading(true)
    const prev = following
    setFollowing(!prev)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')
      const res = await api.post<MutationResponse<FollowResult>>(
        `/api/users/${userId}/follow`,
        {},
        { Authorization: `Bearer ${token}` },
      )
      setFollowing(res.newData.following)
    } catch {
      setFollowing(prev)
    } finally {
      setLoading(false)
    }
  }

  return { following, loading, toggleFollow }
}
