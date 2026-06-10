import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Star, Pencil } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSetores } from '@/hooks/useSetores'
import { usePessoas } from '@/hooks/usePessoas'
import { useEntradas } from '@/hooks/useEntradas'
import { useVinculos } from '@/hooks/useVinculos'
import { useAvaliacoes } from '@/hooks/useAvaliacoes'
import { caminhoHierarquia } from '@/types/setor'
import { ROTULOS_PAPEL } from '@/types/pessoa'
import { ROTULOS_TIPO_ENTRADA } from '@/types/entrada'
import {
  type AvaliacaoSetor,
  ROTULOS_TIPO_AVALIACAO,
  CORES_TIPO_AVALIACAO,
  corDaNota,
} from '@/types/avaliacao'
import { Modal } from '@/components/ui/Modal'
import { AvaliacaoForm } from '@/components/avaliacao/AvaliacaoForm'
import { SetorForm } from '@/components/setor/SetorForm'

const CORES_TIPO_ENTRADA: Record<string, string> = {
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

export function FichaSetor() {
  const { id } = useParams<{ id: string }>()
  const { setores } = useSetores()
  const { pessoas } = usePessoas()
  const { entradas } = useEntradas()
  const { vinculosDoSetor } = useVinculos()
  const { avaliacoesPorSetor } = useAvaliacoes()
  const [modalNovaAvaliacaoAberto, setModalNovaAvaliacaoAberto] = useState(false)
  const [modalEditarSetorAberto, setModalEditarSetorAberto] = useState(false)
  const [avaliacaoEditando, setAvaliacaoEditando] = useState<AvaliacaoSetor | null>(null)

  const setor = setores.find((s) => s.id === id)

  if (!setor) {
    return (
      <div>
        <Link to="/setores" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', textDecoration: 'none' }}>
          ← Voltar pra Setores
        </Link>
        <div style={{ marginTop: '24px', padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
          Setor não encontrado.
        </div>
      </div>
    )
  }

  const ehAtual = !setor.dataSaida
  const diasTotais = differenceInDays(
    setor.dataSaida ? parseISO(setor.dataSaida) : new Date(),
    parseISO(setor.dataEntrada)
  )
  const nivelMaisEspecifico = setor.nivel3 || setor.nivel2 || setor.nivel1
  const mostrarNomeCompleto =
    nivelMaisEspecifico.nome && nivelMaisEspecifico.nome !== nivelMaisEspecifico.sigla

  const vinculos = vinculosDoSetor(setor.id)
  const entradasDoSetor = entradas
    .filter((e) => e.setoresIds?.includes(setor.id))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const avaliacoes = [...avaliacoesPorSetor(setor.id)].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  )

  return (
    <div>
      <Link
        to="/setores"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {caminhoHierarquia(setor)}
            </h1>
            {ehAtual && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: '#10b981',
                color: 'white',
              }}>
                ATUAL
              </span>
            )}
          </div>
          {mostrarNomeCompleto && (
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)' }}>
              {nivelMaisEspecifico.nome}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setModalEditarSetorAberto(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Pencil size={14} />
            Editar
          </button>
          <button
            onClick={() => setModalNovaAvaliacaoAberto(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg-primary)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Star size={14} />
            Avaliar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '16px', marginBottom: '32px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={13} />
          {format(parseISO(setor.dataEntrada), "dd 'de' MMM yyyy", { locale: ptBR })}
          {setor.dataSaida && ` → ${format(parseISO(setor.dataSaida), "dd 'de' MMM yyyy", { locale: ptBR })}`}
          {ehAtual && ' → ainda em curso'}
        </span>
        <span>{diasTotais} dia{diasTotais !== 1 ? 's' : ''}</span>
        {setor.ordemCronologica && <span>{setor.ordemCronologica}</span>}
      </div>

      {(setor.contribuicoes || setor.consideracoesGerais) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {setor.contribuicoes && (
            <div style={card}>
              <div style={secaoLabel}>Contribuições</div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {setor.contribuicoes}
              </p>
            </div>
          )}
          {setor.consideracoesGerais && (
            <div style={card}>
              <div style={secaoLabel}>Considerações gerais</div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {setor.consideracoesGerais}
              </p>
            </div>
          )}
        </div>
      )}

      {setor.tags && setor.tags.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={secaoLabel}>Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {setor.tags.map((t) => (
              <span key={t} style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <div style={secaoLabel}>
          Avaliações {avaliacoes.length > 0 && `(${avaliacoes.length})`}
        </div>
        {avaliacoes.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhuma avaliação registrada. Clique em "Avaliar" pra registrar a primeira.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {avaliacoes.map((a) => {
              const corTipo = CORES_TIPO_AVALIACAO[a.tipo]
              const corN = corDaNota(a.nota)
              return (
                <div key={a.id} style={{ ...card, borderLeft: `3px solid ${corTipo}`, position: 'relative' }}>
                  <button
                    onClick={() => setAvaliacaoEditando(a)}
                    aria-label="Editar avaliação"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: 'var(--color-text-tertiary)',
                      display: 'flex',
                      opacity: 0.6,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
                  >
                    <Pencil size={14} />
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                          padding: '2px 8px', borderRadius: '999px',
                          backgroundColor: corTipo, color: 'white', textTransform: 'uppercase',
                        }}>
                          {ROTULOS_TIPO_AVALIACAO[a.tipo]}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                          {format(parseISO(a.data), "dd 'de' MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      {a.justificativa && (
                        <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.5, marginTop: '6px', whiteSpace: 'pre-wrap' }}>
                          {a.justificativa}
                        </p>
                      )}
                      {a.contexto && (
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.5,
                          marginTop: '6px',
                          paddingTop: '6px',
                          borderTop: '1px dashed var(--color-border)',
                          fontStyle: 'italic',
                          whiteSpace: 'pre-wrap',
                        }}>
                          {a.contexto}
                        </p>
                      )}
                    </div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: corN,
                      minWidth: '54px',
                      textAlign: 'right',
                    }}>
                      {a.nota.toFixed(1)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={secaoLabel}>
          Pessoas vinculadas {vinculos.length > 0 && `(${vinculos.length})`}
        </div>
        {vinculos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhuma pessoa vinculada a esse setor.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {vinculos.map((v) => {
              const pessoa = pessoas.find((p) => p.id === v.pessoaId)
              if (!pessoa) return null
              return (
                <Link
                  key={v.id}
                  to={`/pessoas/${pessoa.id}`}
                  style={{ ...card, textDecoration: 'none', display: 'block' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-text-secondary)',
                    }}>
                      <User size={16} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {pessoa.nome}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                        {ROTULOS_PAPEL[v.papel]}
                      </div>
                    </div>
                  </div>
                  {v.observacoes && (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                      {v.observacoes}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <div style={secaoLabel}>
          Entradas de diário {entradasDoSetor.length > 0 && `(${entradasDoSetor.length})`}
        </div>
        {entradasDoSetor.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Nenhuma entrada menciona esse setor ainda.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {entradasDoSetor.map((e) => (
              <div key={e.id} style={{ ...card, borderLeft: `3px solid ${CORES_TIPO_ENTRADA[e.tipo]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    {format(parseISO(e.data), "dd 'de' MMM yyyy", { locale: ptBR })}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                    padding: '2px 8px', borderRadius: '999px',
                    backgroundColor: CORES_TIPO_ENTRADA[e.tipo], color: 'white', textTransform: 'uppercase',
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

      <Modal
        aberto={modalNovaAvaliacaoAberto}
        aoFechar={() => setModalNovaAvaliacaoAberto(false)}
        titulo="Avaliar setor"
        larguraMax="640px"
      >
        <AvaliacaoForm
          aoSalvar={() => setModalNovaAvaliacaoAberto(false)}
          aoCancelar={() => setModalNovaAvaliacaoAberto(false)}
          setorIdInicial={setor.id}
        />
      </Modal>

      <Modal
        aberto={Boolean(avaliacaoEditando)}
        aoFechar={() => setAvaliacaoEditando(null)}
        titulo="Editar avaliação"
        larguraMax="640px"
      >
        {avaliacaoEditando && (
          <AvaliacaoForm
            aoSalvar={() => setAvaliacaoEditando(null)}
            aoCancelar={() => setAvaliacaoEditando(null)}
            valoresIniciais={avaliacaoEditando}
          />
        )}
      </Modal>

      <Modal
        aberto={modalEditarSetorAberto}
        aoFechar={() => setModalEditarSetorAberto(false)}
        titulo="Editar setor"
        larguraMax="640px"
      >
        <SetorForm
          aoSalvar={() => setModalEditarSetorAberto(false)}
          aoCancelar={() => setModalEditarSetorAberto(false)}
          valoresIniciais={setor}
        />
      </Modal>
    </div>
  )
}