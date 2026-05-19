import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabaseServer = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    // SAFE: ws is runtime-compatible with WebSocket; type variance mismatch is in constructor signatures only
    realtime: { transport: ws as unknown as typeof WebSocket },
  },
)

export async function getRequestUser(request: Request) {
  const auth = request.headers.get('Authorization')
  const token = auth?.replace('Bearer ', '')
  if (!token) return null

  const { data: { user } } = await supabaseServer.auth.getUser(token)
  return user ?? null
}
