import { Outlet, NavLink } from 'react-router-dom'
import { BotaoTema } from '@/components/ui/BotaoTema'

export function AppLayout() {
  const links = [
    { para: '/', label: 'Início' },
    { para: '/diario', label: 'Diário' },
    { para: '/setores', label: 'Setores' },
    { para: '/pessoas', label: 'Pessoas' },
  ]

  return (
    <div className="min-h-screen">
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
          <BotaoTema />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}