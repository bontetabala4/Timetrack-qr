import { createContext, useEffect, useMemo, useState } from 'react'
import type { BackendUser } from '../services/auth'
import {
  fetchCurrentUser,
  loginWithBackend,
  logoutFromBackend,
} from '../services/auth'

type AuthContextType = {
  user: BackendUser | null
  isAuthenticated: boolean
  token: string | null
  login: (payload: { email: string; password: string }) => Promise<BackendUser>
  setAuthenticatedUser: (
    user: BackendUser | null,
    token: string | null
  ) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_USER_STORAGE_KEY = 'timetrack_admin_auth_user'
const AUTH_TOKEN_STORAGE_KEY = 'timetrack_admin_access_token'

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<BackendUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
      const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

      if (!storedToken) return

      try {
        if (storedUser) {
          setUser(JSON.parse(storedUser) as BackendUser)
        }

        const { user } = await fetchCurrentUser(storedToken)
        setUser(user)
        setToken(storedToken)
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
      } catch {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        setUser(null)
        setToken(null)
      }
    }

    void bootstrap()
  }, [])

  const login = async (payload: { email: string; password: string }) => {
    const data = await loginWithBackend(payload)

    setUser(data.user)
    setToken(data.token)

    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data.user))
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token)

    return data.user
  }

  const setAuthenticatedUser = (
    authenticatedUser: BackendUser | null,
    accessToken: string | null
  ) => {
    setUser(authenticatedUser)
    setToken(accessToken)

    if (authenticatedUser) {
      localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser)
      )
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    }

    if (accessToken) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken)
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await logoutFromBackend(token)
      }
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      setAuthenticatedUser,
      logout,
    }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}