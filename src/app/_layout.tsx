import '../global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { SplashScreen } from '@/components/splash-screen'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { OfflineBanner } from '@/components/OfflineBanner'

ExpoSplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, gcTime: 300_000, retry: 1 },
  },
})

function AppShell() {
  const { loading } = useAuth()

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#14100A' } }} />
      <SplashScreen ready={!loading} />
    </View>
  )
}

export default function RootLayout() {
  useEffect(() => {
    ExpoSplashScreen.hideAsync()
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
