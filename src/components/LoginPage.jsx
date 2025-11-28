import { useState } from 'react'
import { LogIn, AlertCircle, Loader } from 'lucide-react'

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Falha ao fazer login')
        return
      }

      // Login bem-sucedido - armazenar token
      const token = import.meta.env.VITE_API_KEY
      localStorage.setItem('authToken', token)
      localStorage.setItem('isAuthenticated', 'true')

      onLoginSuccess()
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor')
      console.error('Erro no login:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1f93ff 0%, #0066cc 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#1f93ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogIn size={32} color="white" />
            </div>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            margin: '0 0 8px 0'
          }}>
            Endoclin Admin
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#718096',
            margin: '0'
          }}>
            Painel de Administração
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none',
                background: loading ? '#f7fafc' : 'white',
                cursor: loading ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1f93ff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none',
                background: loading ? '#f7fafc' : 'white',
                cursor: loading ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1f93ff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: '#fed7d7',
              border: '1px solid #fc8181',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} color="#c53030" />
              <span style={{
                fontSize: '14px',
                color: '#c53030'
              }}>
                {error}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !username || !password}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: (loading || !username || !password) ? '#cbd5e0' : '#1f93ff',
              border: 'none',
              borderRadius: '8px',
              cursor: (loading || !username || !password) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading && username && password) {
                e.target.style.background = '#1f7bcc'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && username && password) {
                e.target.style.background = '#1f93ff'
              }
            }}
          >
            {loading ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Autenticando...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#a0aec0'
        }}>
          <p style={{ margin: '0' }}>
            EndoClin - Admin © 2025
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoginPage
