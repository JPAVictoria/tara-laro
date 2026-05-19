const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error ?? `Request failed: ${res.status}`)
  }

  return json as T
}

export const api = {
  get: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'GET', headers }),

  post: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), headers }),

  patch: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), headers }),

  delete: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'DELETE', headers }),
}
