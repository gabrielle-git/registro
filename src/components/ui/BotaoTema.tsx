import { Sun, Moon, Monitor } from 'lucide-react'
import { useTema } from '@/hooks/useTema'

export function BotaoTema() {
  const { tema, setTema } = useTema()

  const opcoes = [
    { valor: 'claro' as const, icone: Sun, label: 'Claro' },
    { valor: 'auto' as const, icone: Monitor, label: 'Auto' },
    { valor: 'escuro' as const, icone: Moon, label: 'Escuro' },
  ]

  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-lg"
      style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
    >
      {opcoes.map(({ valor, icone: Icone, label }) => {
        const ativo = tema === valor
        return (
          <button
            key={valor}
            onClick={() => setTema(valor)}
            aria-label={`Tema ${label}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              backgroundColor: ativo ? 'var(--color-bg-primary)' : 'transparent',
              color: ativo ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}
          >
            <Icone size={14} />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}