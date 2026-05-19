import '../global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { SplashScreen } from '@/components/splash-screen'
import { useAuth } from '@/modules/auth/hooks/use-auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, gcTime: 300_000, retry: 1 },
  },
})

function AuthGate() {
  const { session, loading, onboardingComplete } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const seg0 = segments[0] as string
    const inAuth = seg0 === '(auth)'
    const inOnboarding = seg0 === 'onboarding'

    if (!session) {
      // SAFE: cast needed because generated route types don't yet include new route groups
      if (!inAuth) router.replace('/(auth)/login' as never)
    } else if (!onboardingComplete) {
      if (!inOnboarding) router.replace('/onboarding/setup' as never)
    } else if (inAuth || inOnboarding) {
      router.replace('/(tabs)' as never)
    }
  }, [session, loading, onboardingComplete])

  return null
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }} />
      <SplashScreen />
    </QueryClientProvider>
  )
}
