import { useState, useEffect } from 'react'
import { db } from './lib/db'
import { Users, LogOut } from 'lucide-react'
import GestaoProfissionais from './GestaoProfissionais'
import LoginPage from './components/LoginPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profissionais, setProfissionais] = useState([])
  const [profissionaisConfig, setProfissionaisConfig] = useState({})

  // Verificar autenticação ao carregar
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(isAuth)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      carregarProfissionais()
    }
  }, [isAuthenticated])

  const carregarProfissionais = async () => {
    try {
      const { data, error } = await db.select('profissionais', {
        filters: { ativo: true }
      })

      if (error) throw error
      
      // Criar mapa de configurações por nome_exibicao
      const configMap = {}
      data?.forEach(prof => {
        configMap[prof.nome_exibicao] = prof.config_atendimento || {
          duracao_consulta: 30,
          primeira_consulta_duracao: 60,
          retorno_duracao: 30
        }
      })
      setProfissionaisConfig(configMap)
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('authToken')
      
      // Fazer logout no backend
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => {
        // Ignorar erros no logout (pode falhar se backend estiver offline)
      })
    } finally {
      // Limpar localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      setIsAuthenticated(false)
    }
  }

  // Se não autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} color="#1f93ff" />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748' }}>
            Endoclin Admin
          </h1>
        </div>

        <nav style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
          {/* Divisor */}
          <div style={{
            height: '24px',
            width: '1px',
            background: '#e2e8f0',
            margin: '0 10px'
          }} />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#fee',
              color: '#c53030',
              border: '2px solid #fc8181',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#fed7d7'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fee'
            }}
          >
            <LogOut size={18} />
            Sair
          </button>
        </nav>
      </header>

      {/* Conteúdo */}
      <main style={{ padding: '30px 40px' }}>
        <GestaoProfissionais />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '20px',
        textAlign: 'center',
        color: '#718096',
        fontSize: '14px'
      }}>
        <p>EndoClin - Admin © 2025</p>
      </footer>
    </div>
  )
}

export default App
