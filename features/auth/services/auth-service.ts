import { api } from '@/lib/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  userId: string
  name: string
  email: string
  token: string
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/v1/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/v1/auth/register', data),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    deleteCookie('token')
  },

  saveAuth: (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,
    }))
    setCookie('token', data.token, 1)
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) as Omit<AuthResponse, 'token'> : null
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token'),
}
