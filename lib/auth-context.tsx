"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "./types"

type AuthState = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("proman_auth")
    if (saved) {
      try {
        const { token: t, user: u } = JSON.parse(saved)
        setToken(t)
        setUser(u)
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const login = (t: string, u: User) => {
    setToken(t)
    setUser(u)
    localStorage.setItem("proman_auth", JSON.stringify({ token: t, user: u }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("proman_auth")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
