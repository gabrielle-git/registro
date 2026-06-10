import { useState } from 'react'
import { useEntradas } from '@/hooks/useEntradas'
import { useSetores } from '@/hooks/useSetores'
import { usePessoas } from '@/hooks/usePessoas'
import {
  type EntradaDiario,
  type TipoEntrada,
  TIPOS_ENTRADA,
  ROTULOS_TIPO_ENTRADA,
} from '@/types/entrada'
import { caminhoHierarquia } from '@/types/setor'

interface EntradaFormProps {
  aoSalvar: () => void
  aoCancelar: () => void
  valoresIniciais?: EntradaDiario
}

export function EntradaForm({ aoSalvar, aoCancelar, valoresIniciais }: EntradaFormProps) {
  const { adicionarEntrada, atualizarEntrada } = useEntradas()
  const { setores } = useSetores()
  const { pessoas } = usePessoas()

  const modoEdicao = Boolean(valoresIniciais)

  const [data, setData] = useState(
    valoresIniciais?.data ?? new Date().toISOString().split('T')[0]
  )
  const [tipo, setTipo] = useState<TipoEntrada>(valoresIniciais?.tipo ?? 'dia_normal')
  const [titulo, setTitulo] = useState(valoresIniciais?.titulo ?? '')
  const [texto, setTexto] = useState(valoresIniciais?.texto ?? '')
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>(
    valoresIniciais?.setoresIds ?? []
  )
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<string[]>(
    valoresIniciais?.pessoasIds ?? []
  )
  const [erro, setErro] = useState('')

  const toggleSetor = (id: string) => {
    setSetoresSelecionados((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    )
  }

  const togglePessoa = (id: string) => {
    setPessoasSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    )
  }

  const aoSubmeter = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!data) {
      setErro('A data é obrigatória.')
      return
    }
    if (!texto.trim()) {
      setErro('O conteúdo da entrada é obrigatório.')
      return
    }

    const dados = {
      data,
      tipo,
      titulo: titulo.trim() || undefined,
      texto: texto.trim(),
      setoresIds: setoresSelecionados.length > 0 ? setoresSelecionados : undefined,
      pessoasIds: pessoasSelecionadas.length > 0 ? pessoasSelecionadas : undefined,
    }

    if (modoEdicao && valoresIniciais) {
      atualizarEntrada(valoresIniciais.id, dados)
    } else {
      adicionarEntrada(dados)
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

  const secaoLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
    display: 'block',
  }

  const chipStyle = (selecionado: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: selecionado ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid var(--color-border)',
    backgroundColor: selecionado
      ? 'var(--color-text-primary)'
      : 'var(--color-bg-secondary)',
    color: selecionado
      ? 'var(--color-bg-primary)'
      : 'var(--color-text-primary)',
  })

  return (
    <form onSubmit={aoSubmeter} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
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
          <label style={labelStyle}>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoEntrada)}
            style={inputStyle}
          >
            {TIPOS_ENTRADA.map((t) => (
              <option key={t} value={t}>
                {ROTULOS_TIPO_ENTRADA[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Opcional, um resumo rápido..."
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Conteúdo *</label>
        <textarea
          rows={6}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Como foi o dia? O que aconteceu, o que aprendeu, o que sentiu..."
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          autoFocus
        />
      </div>

      <div>
        <span style={secaoLabelStyle}>Setores mencionados</span>
        {setores.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhum setor cadastrado ainda.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {setores.map((s) => {
              const selecionado = setoresSelecionados.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSetor(s.id)}
                  style={chipStyle(selecionado)}
                >
                  {caminhoHierarquia(s)}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <span style={secaoLabelStyle}>Pessoas mencionadas</span>
        {pessoas.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhuma pessoa cadastrada ainda.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {pessoas.map((p) => {
              const selecionada = pessoasSelecionadas.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePessoa(p.id)}
                  style={chipStyle(selecionada)}
                >
                  {p.nome}
                </button>
              )
            })}
          </div>
        )}
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
          {modoEdicao ? 'Salvar alterações' : 'Salvar entrada'}
        </button>
      </div>
    </form>
  )
}