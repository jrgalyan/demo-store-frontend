import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { UserApi } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ctrl = new AbortController()
    // Attempt to hydrate from session cookie
    UserApi.me(ctrl.signal)
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  async function login({ email, password }) {
    setError(null)
    await UserApi.login({ email, password })
    // Backend sets HttpOnly cookie. Re-fetch profile
    const u = await UserApi.me()
    setUser(u)
    return u
  }

  async function register(payload) {
    setError(null)
    const u = await UserApi.register(payload)
    return u
  }

  function logout() {
    // No logout endpoint specified; clear client state only
    setUser(null)
  }

  const value = useMemo(() => ({ user, setUser, loading, error, setError, login, register, logout }), [user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
