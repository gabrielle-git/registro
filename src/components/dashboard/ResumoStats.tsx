import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ResumoStatsProps {
  qtdSetores: number
  qtdPessoas: number
  qtdEntradas: number
  ultimaEntradaData?: string
}

export function ResumoStats({
  qtdSetores,
  qtdPessoas,
  qtdEntradas,
  ultimaEntradaData,
}: ResumoStatsProps) {
  const ultimaEntradaFormatada = ultimaEntradaData
    ? formatDistanceToNow(new Date(ultimaEntradaData), { locale: ptBR, addSuffix: true })
    : '—'

  const stats = [
    { label: 'Setores', valor: qtdSetores.toString(), tamanhoFonte: 'text-2xl' },
    { label: 'Pessoas', valor: qtdPessoas.toString(), tamanhoFonte: 'text-2xl' },
    { label: 'Entradas', valor: qtdEntradas.toString(), tamanhoFonte: 'text-2xl' },
    { label: 'Última', valor: ultimaEntradaFormatada, tamanhoFonte: 'text-sm' },
  ]

  return (
    <div className="mb-6">
      <p
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Resumo
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.map(({ label, valor, tamanhoFonte }) => (
          <div
            key={label}
            className="p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {label}
            </p>
            <p
              className={`${tamanhoFonte} font-medium mt-0.5`}
              style={{ color: 'var(--color-text-primary)' }}
            >
              {valor}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}