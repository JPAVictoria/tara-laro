import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'
import { getItem, setItem, removeItem, StorageKeys } from '@/utils/storage'
import type { MutationResponse, User } from '@/types'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        const done = await getItem<boolean>(StorageKeys.ONBOARDING_COMPLETE)
        setOnboardingComplete(done ?? false)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setOnboardingComplete(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const done = await getItem<boolean>(StorageKeys.ONBOARDING_COMPLETE)
    setOnboardingComplete(done ?? false)
  }

  async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signInWithOAuth(provider: 'google' | 'discord') {
    const redirectTo = Linking.createURL('auth/callback')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    })
    if (error) throw error
    if (!data.url) throw new Error('No OAuth URL returned')

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
    if (result.type === 'success') {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url)
      if (exchangeError) throw exchangeError
    }
  }

  async function signOut() {
    await removeItem(StorageKeys.ONBOARDING_COMPLETE)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function signInAsGuest() {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    if (!data.user) throw new Error('Guest sign-in failed')

    const { data: { session } } = await supabase.auth.getSession()
    const shortId = data.user.id.slice(0, 6)
    const headers: HeadersInit = session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}

    await api.post<MutationResponse<User>>('/api/users', {
      username: `guest_${shortId}`,
      displayName: 'Guest',
    }, headers)

    await setItem(StorageKeys.ONBOARDING_COMPLETE, true)
    setOnboardingComplete(true)
  }

  async function completeOnboarding() {
    await setItem(StorageKeys.ONBOARDING_COMPLETE, true)
    setOnboardingComplete(true)
  }

  return {
    session,
    user: session?.user ?? null,
    loading,
    onboardingComplete,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signInAsGuest,
    signOut,
    completeOnboarding,
  }
}
