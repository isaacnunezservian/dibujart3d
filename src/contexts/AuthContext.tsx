import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar si ya está autenticado (localStorage)
    const authStatus = localStorage.getItem('tigre-admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (password: string): Promise<boolean> => {
    // Contraseña hardcodeada por simplicidad - en producción usar JWT/OAuth
    if (password === '1234') {
      setIsAuthenticated(true)
      localStorage.setItem('tigre-admin-auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('tigre-admin-auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
