import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { EntradaDiario } from '@/types/entrada'
import type { Setor } from '@/types/setor'
import { nomeCurtoSetor } from '@/types/setor'

interface UltimasEntradasProps {
  entradas: EntradaDiario[]
  setores: Setor[]
}

export function UltimasEntradas({ entradas, setores }: UltimasEntradasProps) {
  // Pega só as 5 mais recentes, ordenadas por data desc
  const recentes = [...entradas]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5)

  const nomeSetor = (setorId: string) => {
    const setor = setores.find((s) => s.id === setorId)
    return setor ? nomeCurtoSetor(setor) : 'Setor desconhecido'
  }

  return (
    <div>
      <p
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Últimas entradas
      </p>
      <div
        className="rounded-lg p-3"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
        }}
      >
        {recentes.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Nenhuma entrada ainda. Comece registrando seu dia!
          </p>
        ) : (
          recentes.map((entrada, idx) => {
            const setorNome = entrada.setoresIds?.[0]
              ? nomeSetor(entrada.setoresIds[0])
              : null
            const dataFormatada = format(new Date(entrada.data), 'dd/MM', { locale: ptBR })

            return (
              <div
                key={entrada.id}
                className="py-2"
                style={{
                  borderTop:
                    idx === 0 ? 'none' : '0.5px solid var(--color-border)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>{dataFormatada} ·</span>{' '}
                  {setorNome && (
                    <span style={{ fontWeight: 500 }}>{setorNome} — </span>
                  )}
                  {entrada.texto}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}