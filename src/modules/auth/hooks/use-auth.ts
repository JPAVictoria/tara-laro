// Placeholder — implemented on Day 5
export function useAuth() {
  return {
    session: null,
    user: null,
    loading: true,
    signInWithEmail: async (_email: string, _password: string) => {},
    signUpWithEmail: async (_email: string, _password: string) => {},
    signInWithOAuth: async (_provider: 'google' | 'discord') => {},
    signOut: async () => {},
  }
}
