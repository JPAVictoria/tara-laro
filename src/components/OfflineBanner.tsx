import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, AppState, type AppStateStatus } from 'react-native'

async function checkOnline(): Promise<boolean> {
  try {
    const res = await fetch('https://www.google.com', { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    async function poll() {
      const online = await checkOnline()
      setIsOffline(!online)
    }

    void poll()
    interval = setInterval(() => { void poll() }, 10_000)

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') void poll()
    })

    return () => {
      clearInterval(interval)
      sub.remove()
    }
  }, [])

  if (!isOffline) return null

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>📡 No internet connection</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: { fontSize: 13, color: '#F9FAFB', fontWeight: '600' },
})
