const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data?: T
  timestamp: string
}

export interface PagedApiResponse<T = unknown> {
  status: number
  message: string
  data: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  timestamp: string
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request(
  endpoint: string,
  options: RequestInit = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const body = await response.json()

  if (!response.ok) {
    const isAuthEndpoint = endpoint.startsWith('/v1/auth/')
    if (response.status === 401 && !isAuthEndpoint && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      window.location.href = '/login'
    }
    throw new ApiError(response.status, body.message || 'Erro inesperado', body.data)
  }

  return body
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'GET' }) as Promise<ApiResponse<T>>,

  getPaged: <T>(endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'GET' }) as Promise<PagedApiResponse<T>>,

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }) as Promise<ApiResponse<T>>,

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }) as Promise<ApiResponse<T>>,

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'DELETE' }) as Promise<ApiResponse<T>>,
}
