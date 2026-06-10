import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Briefcase, MapPin, Globe, Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { usePessoas } from '@/hooks/usePessoas'
import { useSetores } from '@/hooks/useSetores'
import { useEntradas } from '@/hooks/useEntradas'
import { useVinculos } from '@/hooks/useVinculos'
import { caminhoHierarquia } from '@/types/setor'
import { ROTULOS_PAPEL } from '@/types/pessoa'
import { ROTULOS_TIPO_ENTRADA } from '@/types/entrada'
import { Modal } from '@/components/ui/Modal'
import { ModalConfirmacao } from '@/components/ui/ModalConfirmacao'
import { PessoaForm } from '@/components/pessoa/PessoaForm'

const CORES_TIPO: Record<string, string> = {
  dia_normal: '#6b7280',
  feedback_recebido: '#3b82f6',
  aprendizado: '#10b981',
  observacao: '#f59e0b',
  marco: '#a855f7',
}

const secaoLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--color-text-secondary)',
  marginBottom: '10px',
}

const card: React.CSSProperties = {
  padding: '14px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-bg-secondary)',
  border: '1px solid var(--color-border)',
}

export function FichaPessoa() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pessoas, removerPessoa } = usePessoas()
  const { setores } = useSetores()
  const { entradas, atualizarEntrada } = useEntradas()
  const { vinculosDaPessoa, removerVinculo } = useVinculos()
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)

  const pessoa = pessoas.find((p) => p.id === id)

  if (!pessoa) {
    return (
      <div>
        <Link to="/pessoas" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', textDecoration: 'none' }}>
          ← Voltar pra Pessoas
        </Link>
        <div style={{ marginTop: '24px', padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
          Pessoa não encontrada.
        </div>
      </div>
    )
  }

  const vinculos = vinculosDaPessoa(pessoa.id)
  const entradasDaPessoa = entradas
    .filter((e) => e.pessoasIds?.includes(pessoa.id))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const confirmarExcluirPessoa = () => {
    vinculos.forEach((v) => removerVinculo(v.id))
    entradas
      .filter((e) => e.pessoasIds?.includes(pessoa.id))
      .forEach((e) => {
        const novas = (e.pessoasIds ?? []).filter((pid) => pid !== pessoa.id)
        atualizarEntrada(e.id, { pessoasIds: novas.length > 0 ? novas : undefined })
      })
    removerPessoa(pessoa.id)
    navigate('/pessoas')
  }

  return (
    <div>
      <Link
        to="/pessoas"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: 'var(--color-text-secondary)',
          textDecoration: 'none', marginBottom: '20px',
        }}
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            backgroundColor: 'var(--color-bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-secondary)', flexShrink: 0,
          }}>
            <User size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {pessoa.nome}
            </h1>
            {pessoa.cargo && (
              <p style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '2px',
              }}>
                <Briefcase size={13} />
                {pessoa.cargo}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setModalExcluirAberto(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#dc2626',
              border: '1px solid rgba(220, 38, 38, 0.3)', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Trash2 size={14} />
            Excluir
          </button>
          <button
            onClick={() => setModalEditarAberto(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Pencil size={14} />
            Editar
          </button>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '32px' }}>
        Cadastrada em {format(parseISO(pessoa.createdAt), "dd 'de' MMM yyyy", { locale: ptBR })}
      </div>

      {pessoa.observacoes && (
        <div style={{ ...card, marginBottom: '32px' }}>
          <div style={secaoLabel}>Observações</div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {pessoa.observacoes}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <div style={secaoLabel}>
          Onde você encontrou {vinculos.length > 0 && `(${vinculos.length})`}
        </div>
        {vinculos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhum vínculo cadastrado.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {vinculos.map((v) => {
              const ehSetorCadastrado = Boolean(v.setorId)
              const setor = v.setorId ? setores.find((s) => s.id === v.setorId) : null
              const local = ehSetorCadastrado
                ? (setor ? caminhoHierarquia(setor) : 'Setor removido')
                : (v.localLivre || 'Sem local')

              const conteudo = (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      {ehSetorCadastrado ? <MapPin size={13} /> : <Globe size={13} />}
                      <span style={{
                        fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {local}
                      </span>
                    </div>
                    {!ehSetorCadastrado && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px',
                        padding: '2px 6px', borderRadius: '4px',
                        backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        Outro
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: v.observacoes ? '6px' : 0 }}>
                    {ROTULOS_PAPEL[v.papel]}
                  </div>
                  {v.observacoes && (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                      {v.observacoes}
                    </p>
                  )}
                </>
              )

              return ehSetorCadastrado && setor ? (
                <Link key={v.id} to={`/setores/${setor.id}`} style={{ ...card, textDecoration: 'none', display: 'block' }}>
                  {conteudo}
                </Link>
              ) : (
                <div key={v.id} style={card}>{conteudo}</div>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <div style={secaoLabel}>
          Citada em {entradasDaPessoa.length > 0 && `(${entradasDaPessoa.length})`}
        </div>
        {entradasDaPessoa.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhuma entrada do diário menciona essa pessoa ainda.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {entradasDaPessoa.map((e) => (
              <div key={e.id} style={{ ...card, borderLeft: `3px solid ${CORES_TIPO[e.tipo]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    {format(parseISO(e.data), "dd 'de' MMM yyyy", { locale: ptBR })}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                    padding: '2px 8px', borderRadius: '999px',
                    backgroundColor: CORES_TIPO[e.tipo], color: 'white', textTransform: 'uppercase',
                  }}>
                    {ROTULOS_TIPO_ENTRADA[e.tipo]}
                  </span>
                </div>
                {e.titulo && (
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    {e.titulo}
                  </h4>
                )}
                <p style={{
                  fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {e.texto}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal aberto={modalEditarAberto} aoFechar={() => setModalEditarAberto(false)} titulo="Editar pessoa" larguraMax="640px">
        <PessoaForm aoSalvar={() => setModalEditarAberto(false)} aoCancelar={() => setModalEditarAberto(false)} valoresIniciais={pessoa} />
      </Modal>

      <ModalConfirmacao
        aberto={modalExcluirAberto}
        aoFechar={() => setModalExcluirAberto(false)}
        aoConfirmar={confirmarExcluirPessoa}
        titulo="Excluir pessoa"
        mensagem={`Tem certeza que quer excluir "${pessoa.nome}"? Isso também remove todos os vínculos dessa pessoa. Essa ação não pode ser desfeita.`}
      />
    </div>
  )
}