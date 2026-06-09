import { Notebook, Building2, UserPlus, Star } from 'lucide-react'

export type TipoAtalho = 'entrada' | 'setor' | 'pessoa' | 'avaliacao'

interface AtalhosRapidosProps {
  aoClicar: (tipo: TipoAtalho) => void
}

export function AtalhosRapidos({ aoClicar }: AtalhosRapidosProps) {
  const atalhos = [
    {
      tipo: 'entrada' as TipoAtalho,
      icone: Notebook,
      titulo: 'Entrada de diário',
      subtitulo: 'registrar o dia',
    },
    {
      tipo: 'setor' as TipoAtalho,
      icone: Building2,
      titulo: 'Novo setor',
      subtitulo: 'mudou de lotação',
    },
    {
      tipo: 'pessoa' as TipoAtalho,
      icone: UserPlus,
      titulo: 'Nova pessoa',
      subtitulo: 'colega, chefia',
    },
    {
      tipo: 'avaliacao' as TipoAtalho,
      icone: Star,
      titulo: 'Avaliar setor',
      subtitulo: 'nota e justificativa',
    },
  ]

  return (
    <div className="mb-6">
      <p
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Adicionar
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {atalhos.map(({ tipo, icone: Icone, titulo, subtitulo }) => (
          <button
            key={tipo}
            onClick={() => aoClicar(tipo)}
            className="flex flex-col items-start p-3.5 rounded-lg text-left gap-1.5 transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Icone size={20} style={{ color: 'var(--color-text-primary)' }} />
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {titulo}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {subtitulo}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}