import '../global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { SplashScreen } from '@/components/splash-screen'
import { useAuth } from '@/modules/auth/hooks/use-auth'

ExpoSplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, gcTime: 300_000, retry: 1 },
  },
})

function AppShell() {
  const { loading } = useAuth()

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FACC15' } }} />
      <SplashScreen ready={!loading} />
    </>
  )
}

export default function RootLayout() {
  useEffect(() => {
    ExpoSplashScreen.hideAsync()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  )
}
