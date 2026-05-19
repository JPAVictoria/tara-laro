import AsyncStorage from '@react-native-async-storage/async-storage'

export const StorageKeys = {
  SESSION: 'session',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  PREFERRED_GENRES: 'preferred_genres',
} as const

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key)
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.clear()
}
