import { useState } from 'react'
import type { Setor, NivelHierarquia } from '@/types/setor'
import { CATALOGO_PCDF, filhosDe, type UnidadeCatalogo } from '@/data/catalogo_pcdf'
import { useSetores } from '@/hooks/useSetores'
import { SeletorNivel } from './SeletorNivel'

interface SetorFormProps {
  aoSalvar: () => void
  aoCancelar: () => void
  valoresIniciais?: Setor
}

export function SetorForm({ aoSalvar, aoCancelar, valoresIniciais }: SetorFormProps) {
  const { adicionarSetor, atualizarSetor } = useSetores()

  const modoEdicao = Boolean(valoresIniciais)

  const [nivel1, setNivel1] = useState<NivelHierarquia | undefined>(
    valoresIniciais?.nivel1
  )
  const [nivel2, setNivel2] = useState<NivelHierarquia | undefined>(
    valoresIniciais?.nivel2
  )
  const [nivel3, setNivel3] = useState<NivelHierarquia | undefined>(
    valoresIniciais?.nivel3
  )

  const [ordemCronologica, setOrdemCronologica] = useState(
    valoresIniciais?.ordemCronologica ?? ''
  )
  const [dataEntrada, setDataEntrada] = useState(
    valoresIniciais?.dataEntrada ?? new Date().toISOString().split('T')[0]
  )
  const [dataSaida, setDataSaida] = useState(valoresIniciais?.dataSaida ?? '')
  const [contribuicoes, setContribuicoes] = useState(
    valoresIniciais?.contribuicoes ?? ''
  )
  const [consideracoesGerais, setConsideracoesGerais] = useState(
    valoresIniciais?.consideracoesGerais ?? ''
  )
  const [tagsTexto, setTagsTexto] = useState(
    valoresIniciais?.tags?.join(', ') ?? ''
  )
  const [erro, setErro] = useState('')

  const opcoesNivel2: UnidadeCatalogo[] = nivel1?.sigla
    ? filhosDe(nivel1.sigla)
    : []

  const opcoesNivel3: UnidadeCatalogo[] = []

  const aoMudarNivel1 = (novo: NivelHierarquia | undefined) => {
    setNivel1(novo)
    if (!novo || novo.sigla !== nivel1?.sigla) {
      setNivel2(undefined)
      setNivel3(undefined)
    }
  }

  const aoSubmeter = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!nivel1 || !nivel1.sigla.trim()) {
      setErro('Você precisa preencher pelo menos o nível 1 (Departamento/Órgão).')
      return
    }

    if (!dataEntrada) {
      setErro('Data de entrada é obrigatória.')
      return
    }

    const tags = tagsTexto
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const dados: Omit<Setor, 'id' | 'createdAt' | 'updatedAt'> = {
      nivel1,
      nivel2,
      nivel3,
      ordemCronologica: ordemCronologica.trim() || undefined,
      dataEntrada,
      dataSaida: dataSaida || undefined,
      contribuicoes: contribuicoes.trim() || undefined,
      consideracoesGerais: consideracoesGerais.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    }

    if (modoEdicao && valoresIniciais) {
      atualizarSetor(valoresIniciais.id, dados)
    } else {
      adicionarSetor(dados)
    }

    aoSalvar()
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
    <form onSubmit={aoSubmeter} className="space-y-4">
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            marginBottom: '12px',
            lineHeight: 1.5,
          }}
        >
          Cadastra a hierarquia do mais geral pro mais específico. Só o nível 1 é
          obrigatório — preenche os outros se fizer sentido pro lugar.
        </p>
      </div>

      <SeletorNivel
        rotulo="Nível 1 — Departamento / Órgão"
        valor={nivel1}
        aoMudar={aoMudarNivel1}
        opcoesDoCatalogo={CATALOGO_PCDF}
        obrigatorio
      />

      <SeletorNivel
        rotulo="Nível 2 — Divisão / Coordenação / Instituto..."
        valor={nivel2}
        aoMudar={setNivel2}
        opcoesDoCatalogo={opcoesNivel2}
        desabilitado={!nivel1}
      />

      <SeletorNivel
        rotulo="Nível 3 — Seção / Serviço (sua lotação específica)"
        valor={nivel3}
        aoMudar={setNivel3}
        opcoesDoCatalogo={opcoesNivel3}
        tipoPadrao="secao"
        desabilitado={!nivel1}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Data de entrada *</label>
          <input
            type="date"
            value={dataEntrada}
            onChange={(e) => setDataEntrada(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Data de saída</label>
          <input
            type="date"
            value={dataSaida}
            onChange={(e) => setDataSaida(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Ordem cronológica</label>
        <input
          type="text"
          value={ordemCronologica}
          onChange={(e) => setOrdemCronologica(e.target.value)}
          placeholder="Ex: Quarto mês"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Contribuições</label>
        <textarea
          rows={3}
          value={contribuicoes}
          onChange={(e) => setContribuicoes(e.target.value)}
          placeholder="O que você fez aqui, suas atribuições..."
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        <label style={labelStyle}>Considerações gerais</label>
        <textarea
          rows={4}
          value={consideracoesGerais}
          onChange={(e) => setConsideracoesGerais(e.target.value)}
          placeholder="Como é o setor, as pessoas, recepção, clima, lanche, fofoca..."
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        <label style={labelStyle}>Tags (separadas por vírgula)</label>
        <input
          type="text"
          value={tagsTexto}
          onChange={(e) => setTagsTexto(e.target.value)}
          placeholder="Ex: administrativo, informática"
          style={inputStyle}
        />
      </div>

      {erro && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#dc2626',
            fontSize: '13px',
          }}
        >
          {erro}
        </div>
      )}

      <div
        className="flex justify-end gap-2 pt-4"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button
          type="button"
          onClick={aoCancelar}
          className="px-4 py-2 rounded-md text-sm transition-colors hover:opacity-70"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-bg-primary)',
          }}
        >
          {modoEdicao ? 'Salvar alterações' : 'Salvar setor'}
        </button>
      </div>
    </form>
  )
}