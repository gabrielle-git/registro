import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SaudacaoProps {
  nome: string
  setorAtual?: string
  diasNoSetor?: number
}

export function Saudacao({ nome, setorAtual, diasNoSetor }: SaudacaoProps) {
  const agora = new Date()
  const dataFormatada = format(agora, "EEEE, d 'de' MMMM", { locale: ptBR })
  const dataCapitalizada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)

  const hora = agora.getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="mb-6">
      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        {dataCapitalizada}
      </p>
      <h2 className="text-2xl font-medium mt-1" style={{ color: 'var(--color-text-primary)' }}>
        {saudacao}, {nome}
      </h2>
      {setorAtual && diasNoSetor !== undefined && (
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          Você tá no setor{' '}
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{setorAtual}</span>{' '}
          há {diasNoSetor} {diasNoSetor === 1 ? 'dia' : 'dias'}.
        </p>
      )}
    </div>
  )
}