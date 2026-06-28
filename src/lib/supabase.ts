import 'react-native-url-polyfill/auto'
import { Platform } from 'react-native'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// AsyncStorage accesses `window` at import time, which breaks Node.js SSR during
// `expo export --platform web`. Use localStorage on web, AsyncStorage on native,
// and no storage when window is absent (SSR pre-render).
const getStorage = () => {
  if (typeof window === 'undefined') return undefined
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) =>
        Promise.resolve(void localStorage.setItem(key, value)),
      removeItem: (key: string) =>
        Promise.resolve(void localStorage.removeItem(key)),
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-async-storage/async-storage').default
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
})
