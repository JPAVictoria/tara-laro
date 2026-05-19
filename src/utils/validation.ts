export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

export function getPasswordError(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export function getUsernameError(username: string): string | null {
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (username.length > 20) return 'Username must be 20 characters or fewer'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers, and underscores allowed'
  return null
}
