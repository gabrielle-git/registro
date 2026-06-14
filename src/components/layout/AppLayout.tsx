import { Outlet, NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { BotaoTema } from '@/components/ui/BotaoTema'
import { useAuth } from '@/contexts/AuthContext'

const DEMO_EMAIL = 'demo@registro.app'

export function AppLayout() {
  const { sair, user } = useAuth()
  const isDemo = user?.email === DEMO_EMAIL

  const links = [
    { para: '/', label: 'Início' },
    { para: '/diario', label: 'Diário' },
    { para: '/setores', label: 'Setores' },
    { para: '/pessoas', label: 'Pessoas' },
  ]

  return (
    <div className="min-h-screen">
      {isDemo && (
        <div style={{
          backgroundColor: '#f59e0b',
          color: '#1c1917',
          textAlign: 'center',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: 500,
        }}>
          🎭 Modo demonstração — dados fictícios, somente visualização
        </div>
      )}

      <header
        className="border-b"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Registro
            </h1>
            <nav className="flex gap-1">
              {links.map(({ para, label }) => (
                <NavLink
                  key={para}
                  to={para}
                  end={para === '/'}
                  className="px-3 py-1.5 rounded-md text-sm transition-colors"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive ? 'var(--color-bg-secondary)' : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                  })}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BotaoTema />
            <button
              onClick={sair}
              title="Sair"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-tertiary)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}