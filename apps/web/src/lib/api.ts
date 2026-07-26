const API_URL = import.meta.env.VITE_API_URL

interface ApiSuccessBody<T> {
  success: true
  statusCode: number
  message: string
  data: T
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface ApiErrorBody {
  success: false
  statusCode: number
  message: string
  errors?: unknown
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  })

  const body = (await res.json().catch(() => null)) as
    | ApiSuccessBody<T>
    | ApiErrorBody
    | null

  if (!res.ok || !body || body.success === false) {
    throw new Error(body?.message ?? res.statusText ?? "Request failed")
  }

  return body.data
}
