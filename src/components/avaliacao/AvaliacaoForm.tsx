import { useState } from 'react'
import { useAvaliacoes } from '@/hooks/useAvaliacoes'
import { useSetores } from '@/hooks/useSetores'
import { caminhoHierarquia } from '@/types/setor'
import {
  type AvaliacaoSetor,
  type TipoAvaliacao,
  TIPOS_AVALIACAO,
  ROTULOS_TIPO_AVALIACAO,
  corDaNota,
} from '@/types/avaliacao'

interface AvaliacaoFormProps {
  aoSalvar: () => void
  aoCancelar: () => void
  setorIdInicial?: string
  valoresIniciais?: AvaliacaoSetor
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

export function AvaliacaoForm({
  aoSalvar,
  aoCancelar,
  setorIdInicial,
  valoresIniciais,
}: AvaliacaoFormProps) {
  const { adicionarAvaliacao, atualizarAvaliacao } = useAvaliacoes()
  const { setores } = useSetores()

  const modoEdicao = Boolean(valoresIniciais)

  const [setorId, setSetorId] = useState(
    valoresIniciais?.setorId ?? setorIdInicial ?? ''
  )
  const [tipo, setTipo] = useState<TipoAvaliacao>(valoresIniciais?.tipo ?? 'inicial')
  const [nota, setNota] = useState(valoresIniciais?.nota ?? 7)
  const [data, setData] = useState(
    valoresIniciais?.data ?? new Date().toISOString().split('T')[0]
  )
  const [justificativa, setJustificativa] = useState(valoresIniciais?.justificativa ?? '')
  const [contexto, setContexto] = useState(valoresIniciais?.contexto ?? '')
  const [erro, setErro] = useState('')

  const setorTravado = Boolean(setorIdInicial) || modoEdicao
  const cor = corDaNota(nota)

  const aoSubmeter = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!setorId) {
      setErro('Escolha um setor pra avaliar.')
      return
    }
    if (!data) {
      setErro('A data é obrigatória.')
      return
    }

    const dados = {
      setorId,
      tipo,
      nota,
      data,
      justificativa: justificativa.trim() || undefined,
      contexto: contexto.trim() || undefined,
    }

    if (modoEdicao && valoresIniciais) {
      atualizarAvaliacao(valoresIniciais.id, dados)
    } else {
      adicionarAvaliacao({ ...dados, createdAt: new Date().toISOString() })
    }

    aoSalvar()
  }

  const radioLabelStyle = (ativo: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: ativo ? 600 : 400,
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    border: '1px solid var(--color-border)',
    backgroundColor: ativo ? 'var(--color-bg-tertiary)' : 'transparent',
  })

  return (
    <form onSubmit={aoSubmeter} className="space-y-4">
      <div>
        <label style={labelStyle}>Setor *</label>
        {setorTravado ? (
          <div style={{
            ...inputStyle,
            backgroundColor: 'var(--color-bg-tertiary)',
            opacity: 0.85,
          }}>
            {(() => {
              const s = setores.find((s) => s.id === setorId)
              return s ? caminhoHierarquia(s) : 'Setor não encontrado'
            })()}
          </div>
        ) : (
          <select
            value={setorId}
            onChange={(e) => setSetorId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Selecione um setor...</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {caminhoHierarquia(s)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label style={labelStyle}>Tipo</label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TIPOS_AVALIACAO.map((t) => (
            <label key={t} style={radioLabelStyle(tipo === t)}>
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={tipo === t}
                onChange={() => setTipo(t)}
                style={{ accentColor: 'var(--color-text-primary)' }}
              />
              {ROTULOS_TIPO_AVALIACAO[t]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Nota *</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={nota}
            onChange={(e) => setNota(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: cor }}
          />
          <span style={{
            fontSize: '32px',
            fontWeight: 700,
            color: cor,
            minWidth: '60px',
            textAlign: 'center',
          }}>
            {nota.toFixed(1)}
          </span>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Data *</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Justificativa</label>
        <textarea
          rows={3}
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          placeholder="Por que essa nota?"
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {tipo !== 'inicial' && (
        <div>
          <label style={labelStyle}>Contexto</label>
          <textarea
            rows={3}
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="O que mudou desde a última avaliação?"
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
      )}

      {erro && (
        <div style={{
          padding: '10px 12px',
          borderRadius: '6px',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          color: '#dc2626',
          fontSize: '13px',
        }}>
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
          {modoEdicao ? 'Salvar alterações' : 'Salvar avaliação'}
        </button>
      </div>
    </form>
  )
}