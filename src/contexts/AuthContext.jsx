import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticação ao carregar
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    const savedToken = localStorage.getItem('authToken')
    
    setIsAuthenticated(isAuth)
    setToken(savedToken)
    setLoading(false)
  }, [])

  const login = (authToken) => {
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('isAuthenticated', 'true')
    setToken(authToken)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => {
        // Ignorar erros
      })
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
