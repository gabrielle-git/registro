import type { NivelHierarquia } from '@/types/setor'
import {
  type TipoUnidade,
  type UnidadeCatalogo,
  ROTULOS_TIPO,
  TIPOS_UNIDADE,
} from '@/data/catalogo_pcdf'
import { Autocomplete, type OpcaoAutocomplete } from '@/components/ui/Autocomplete'

interface SeletorNivelProps {
  rotulo: string
  valor: NivelHierarquia | undefined
  aoMudar: (novo: NivelHierarquia | undefined) => void
  opcoesDoCatalogo: UnidadeCatalogo[]
  tipoPadrao?: TipoUnidade
  obrigatorio?: boolean
  desabilitado?: boolean
}

export function SeletorNivel({
  rotulo,
  valor,
  aoMudar,
  opcoesDoCatalogo,
  tipoPadrao = 'outro',
  obrigatorio,
  desabilitado,
}: SeletorNivelProps) {
  // Converte catálogo em formato do Autocomplete
  const opcoes: OpcaoAutocomplete[] = opcoesDoCatalogo.map((u) => ({
    valor: u.sigla,
    rotulo: u.sigla,
    descricao: u.nome,
  }))

  const aoMudarSigla = (sigla: string, opcao?: OpcaoAutocomplete) => {
    if (sigla.trim() === '') {
      aoMudar(undefined)
      return
    }

    // Se selecionou do catálogo, encontra os dados originais
    const doCatalogo = opcoesDoCatalogo.find((u) => u.sigla === sigla)

    aoMudar({
      sigla,
      nome: doCatalogo?.nome ?? valor?.nome ?? opcao?.descricao,
      tipo: doCatalogo?.tipo ?? valor?.tipo ?? tipoPadrao,
    })
  }

  const aoMudarNome = (nome: string) => {
    if (!valor) return
    aoMudar({ ...valor, nome: nome.trim() || undefined })
  }

  const aoMudarTipo = (tipo: TipoUnidade) => {
    if (!valor) return
    aoMudar({ ...valor, tipo })
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    outline: 'none',
  }

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border)',
        opacity: desabilitado ? 0.5 : 1,
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--color-text-secondary)',
          marginBottom: '8px',
        }}
      >
        {rotulo} {obrigatorio && '*'}
      </p>

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>Sigla</label>
        <Autocomplete
          valor={valor?.sigla ?? ''}
          aoMudar={aoMudarSigla}
          opcoes={opcoes}
          placeholder={obrigatorio ? 'Ex: DPE' : 'Opcional'}
          disabled={desabilitado}
        />
      </div>

      {valor && (
        <>
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Nome completo</label>
            <input
              type="text"
              value={valor.nome ?? ''}
              onChange={(e) => aoMudarNome(e.target.value)}
              placeholder="Ex: Departamento de Polícia Especializada"
              style={inputStyle}
              disabled={desabilitado}
            />
          </div>

          <div>
            <label style={labelStyle}>Tipo</label>
            <select
              value={valor.tipo}
              onChange={(e) => aoMudarTipo(e.target.value as TipoUnidade)}
              style={inputStyle}
              disabled={desabilitado}
            >
              {TIPOS_UNIDADE.map((t) => (
                <option key={t} value={t}>
                  {ROTULOS_TIPO[t]}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  )
}
