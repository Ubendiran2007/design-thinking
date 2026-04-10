import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContextObject'

const AUTH_STORAGE_KEY = 'pgts-auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    return saved ? JSON.parse(saved) : { isAuthenticated: false, role: 'user', name: '' }
  })

  const login = (user) => {
    const nextAuth = { isAuthenticated: true, ...user }
    setAuth(nextAuth)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
  }

  const logout = () => {
    const nextAuth = { isAuthenticated: false, role: 'user', name: '' }
    setAuth(nextAuth)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
  }

  const value = useMemo(() => ({ auth, login, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
