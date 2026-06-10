import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { usePessoas } from '@/hooks/usePessoas'
import { useSetores } from '@/hooks/useSetores'
import { useVinculos } from '@/hooks/useVinculos'
import {
  type Pessoa,
  type PapelPessoa,
  PAPEIS,
  ROTULOS_PAPEL,
} from '@/types/pessoa'
import { caminhoHierarquia } from '@/types/setor'
import { listarTodasSiglas } from '@/data/catalogo_pcdf'
import { Autocomplete, type OpcaoAutocomplete } from '@/components/ui/Autocomplete'

interface PessoaFormProps {
  aoSalvar: () => void
  aoCancelar: () => void
  valoresIniciais?: Pessoa
}

type TipoLocal = 'setor' | 'externo'

interface VinculoEditavel {
  id: string
  tipoLocal: TipoLocal
  setorId: string
  localLivre: string
  papel: PapelPessoa
  observacoes: string
}

function novoVinculoVazio(tipoPadrao: TipoLocal): VinculoEditavel {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipoLocal: tipoPadrao,
    setorId: '',
    localLivre: '',
    papel: 'colega',
    observacoes: '',
  }
}

export function PessoaForm({ aoSalvar, aoCancelar, valoresIniciais }: PessoaFormProps) {
  const { adicionarPessoa, atualizarPessoa } = usePessoas()
  const { setores } = useSetores()
  const { adicionarVinculo } = useVinculos()

  const modoEdicao = Boolean(valoresIniciais)

  const [nome, setNome] = useState(valoresIniciais?.nome ?? '')
  const [cargo, setCargo] = useState(valoresIniciais?.cargo ?? '')
  const [observacoesPessoa, setObservacoesPessoa] = useState(valoresIniciais?.observacoes ?? '')
  const [vinculos, setVinculos] = useState<VinculoEditavel[]>([])
  const [erro, setErro] = useState('')

  const opcoesCatalogo: OpcaoAutocomplete[] = listarTodasSiglas().map((u) => ({
    valor: u.sigla,
    rotulo: u.sigla,
    descricao: u.nome,
  }))

  const tipoPadraoNovo: TipoLocal = setores.length > 0 ? 'setor' : 'externo'

  const adicionarBlocoVinculo = () => {
    setVinculos((atual) => [...atual, novoVinculoVazio(tipoPadraoNovo)])
  }

  const removerBlocoVinculo = (id: string) => {
    setVinculos((atual) => atual.filter((v) => v.id !== id))
  }

  const atualizarVinculoEditavel = (
    id: string,
    alteracoes: Partial<Omit<VinculoEditavel, 'id'>>
  ) => {
    setVinculos((atual) =>
      atual.map((v) => (v.id === id ? { ...v, ...alteracoes } : v))
    )
  }

  const aoSubmeter = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('O nome é obrigatório.')
      return
    }

    if (!modoEdicao) {
      for (const v of vinculos) {
        if (v.tipoLocal === 'setor' && !v.setorId) {
          setErro('Você adicionou um vínculo do tipo "Setor que eu passei" mas não escolheu o setor.')
          return
        }
        if (v.tipoLocal === 'externo' && !v.localLivre.trim()) {
          setErro('Você adicionou um vínculo do tipo "Outro lugar" mas não preencheu qual.')
          return
        }
      }
    }

    const dadosPessoa = {
      nome: nome.trim(),
      cargo: cargo.trim() || undefined,
      observacoes: observacoesPessoa.trim() || undefined,
    }

    if (modoEdicao && valoresIniciais) {
      atualizarPessoa(valoresIniciais.id, dadosPessoa)
    } else {
      const pessoaCriada = adicionarPessoa(dadosPessoa)
      vinculos.forEach((v) => {
        adicionarVinculo({
          pessoaId: pessoaCriada.id,
          setorId: v.tipoLocal === 'setor' ? v.setorId : undefined,
          localLivre: v.tipoLocal === 'externo' ? v.localLivre.trim() : undefined,
          papel: v.papel,
          observacoes: v.observacoes.trim() || undefined,
        })
      })
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

  const radioLabelStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
  }

  return (
    <form onSubmit={aoSubmeter} className="space-y-4">
      <div>
        <label style={labelStyle}>Nome *</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Dra. Helena"
          style={inputStyle}
          autoFocus
        />
      </div>

      <div>
        <label style={labelStyle}>Cargo</label>
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          placeholder="Ex: Chefe da SAAEI, Escrivã, Agente..."
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Observações</label>
        <textarea
          rows={3}
          value={observacoesPessoa}
          onChange={(e) => setObservacoesPessoa(e.target.value)}
          placeholder="Qualquer coisa que valha lembrar dessa pessoa..."
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {!modoEdicao && (
        <div style={{ paddingTop: '8px' }}>
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
            Onde você encontrou essa pessoa
          </p>

          {vinculos.length === 0 && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                marginBottom: '8px',
              }}
            >
              Opcional. Pode ser um setor que você passou, outra unidade da PCDF,
              outro órgão, faculdade, curso... ou deixar pra depois.
            </p>
          )}

          {vinculos.map((v, idx) => {
            const semSetoresCadastrados = setores.length === 0

            return (
              <div
                key={v.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Vínculo {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removerBlocoVinculo(v.id)}
                    aria-label="Remover vínculo"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: 'var(--color-text-tertiary)',
                      display: 'flex',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px dashed var(--color-border)',
                  }}
                >
                  <label
                    style={{
                      ...radioLabelStyle,
                      opacity: semSetoresCadastrados ? 0.4 : 1,
                      cursor: semSetoresCadastrados ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name={`tipo-${v.id}`}
                      checked={v.tipoLocal === 'setor'}
                      onChange={() => atualizarVinculoEditavel(v.id, { tipoLocal: 'setor' })}
                      disabled={semSetoresCadastrados}
                    />
                    Setor que eu passei
                  </label>
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name={`tipo-${v.id}`}
                      checked={v.tipoLocal === 'externo'}
                      onChange={() => atualizarVinculoEditavel(v.id, { tipoLocal: 'externo' })}
                    />
                    Outro lugar
                  </label>
                </div>

                {v.tipoLocal === 'setor' ? (
                  <div style={{ marginBottom: '8px' }}>
                    <label style={labelStyle}>Setor</label>
                    <select
                      value={v.setorId}
                      onChange={(e) =>
                        atualizarVinculoEditavel(v.id, { setorId: e.target.value })
                      }
                      style={inputStyle}
                      disabled={semSetoresCadastrados}
                    >
                      <option value="">Selecione um setor...</option>
                      {setores.map((s) => (
                        <option key={s.id} value={s.id}>
                          {caminhoHierarquia(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div style={{ marginBottom: '8px' }}>
                    <label style={labelStyle}>Onde</label>
                    <Autocomplete
                      valor={v.localLivre}
                      aoMudar={(valor) =>
                        atualizarVinculoEditavel(v.id, { localLivre: valor })
                      }
                      opcoes={opcoesCatalogo}
                      placeholder="Ex: DECRIN, PMDF, ESPC, Faculdade UnB..."
                    />
                  </div>
                )}

                <div style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>Papel</label>
                  <select
                    value={v.papel}
                    onChange={(e) =>
                      atualizarVinculoEditavel(v.id, {
                        papel: e.target.value as PapelPessoa,
                      })
                    }
                    style={inputStyle}
                  >
                    {PAPEIS.map((p) => (
                      <option key={p} value={p}>
                        {ROTULOS_PAPEL[p]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Observações</label>
                  <textarea
                    rows={2}
                    value={v.observacoes}
                    onChange={(e) =>
                      atualizarVinculoEditavel(v.id, { observacoes: e.target.value })
                    }
                    placeholder="Ex: muito acessível, ajudou na adaptação..."
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )
          })}

          <button
            type="button"
            onClick={adicionarBlocoVinculo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              backgroundColor: 'transparent',
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            Adicionar vínculo
          </button>
        </div>
      )}

      {modoEdicao && (
        <p style={{
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
          padding: '8px 12px',
          backgroundColor: 'var(--color-bg-tertiary)',
          borderRadius: '6px',
        }}>
          Os vínculos dessa pessoa não são editados aqui. O gerenciamento granular
          de vínculos será adicionado em breve.
        </p>
      )}

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
          {modoEdicao ? 'Salvar alterações' : 'Salvar pessoa'}
        </button>
      </div>
    </form>
  )
}