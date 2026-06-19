import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SaudacaoProps {
  nome: string
  setorAtual?: string  // caminho sistema: /DPE/CHPP/SAAEI
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
        }}>
          {dataCapitalizada}
        </span>

        {setorAtual && (
          <>
            <span style={{ color: 'var(--color-border)', fontSize: '14px' }}>·</span>
            <span style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              color: 'var(--color-accent)',
              letterSpacing: '0.03em',
              fontWeight: 500,
            }}>
              {setorAtual}
            </span>
            {diasNoSetor !== undefined && (
              <>
                <span style={{ color: 'var(--color-border)', fontSize: '14px' }}>·</span>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'monospace',
                }}>
                  {diasNoSetor} {diasNoSetor === 1 ? 'dia' : 'dias'}
                </span>
              </>
            )}
          </>
        )}
      </div>

      <h2 style={{
        fontSize: '24px',
        fontWeight: 500,
        margin: 0,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.01em',
      }}>
        {saudacao}, {nome}
      </h2>
    </div>
  )
}