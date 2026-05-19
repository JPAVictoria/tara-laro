import { createClient } from '@supabase/supabase-js'

const supabaseServer = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function getRequestUser(request: Request) {
  const auth = request.headers.get('Authorization')
  const token = auth?.replace('Bearer ', '')
  if (!token) return null

  const { data: { user } } = await supabaseServer.auth.getUser(token)
  return user ?? null
}
