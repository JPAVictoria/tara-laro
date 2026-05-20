import { View } from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '@/modules/auth/hooks/use-auth'

export default function Index() {
  const { session, loading, onboardingComplete } = useAuth()

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FACC15' }} />
  if (!session) return <Redirect href="/(auth)/login" />
  if (!onboardingComplete) return <Redirect href="/onboarding/setup" />
  return <Redirect href="/(tabs)" />
}
