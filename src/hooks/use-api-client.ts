import { supabase } from '@/lib/supabase'
import { api } from '@/utils/api'

async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
}

export function useApiClient() {
  return {
    get: <T>(path: string) => authHeaders().then(h => api.get<T>(path, h)),
    post: <T>(path: string, body: unknown) => authHeaders().then(h => api.post<T>(path, body, h)),
    patch: <T>(path: string, body: unknown) => authHeaders().then(h => api.patch<T>(path, body, h)),
    delete: <T>(path: string) => authHeaders().then(h => api.delete<T>(path, h)),
  }
}
