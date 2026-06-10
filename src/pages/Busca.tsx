import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSetores } from '@/hooks/useSetores'
import { usePessoas } from '@/hooks/usePessoas'
import { useEntradas } from '@/hooks/useEntradas'
import { caminhoHierarquia } from '@/types/setor'
import { ROTULOS_TIPO_ENTRADA } from '@/types/entrada'

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
  marginTop: '28px',
}

const card: React.CSSProperties = {
  padding: '14px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-bg-secondary)',
  border: '1px solid var(--color-border)',
  transition: 'transform 0.15s',
}

export function Busca() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const termo = query.toLowerCase()

  const { setores } = useSetores()
  const { pessoas } = usePessoas()
  const { entradas } = useEntradas()

  const setoresFiltrados = useMemo(() => {
    if (!termo) return []
    return setores.filter((s) => {
      const textos = [
        caminhoHierarquia(s),
        s.nivel1.nome,
        s.nivel2?.nome,
        s.nivel3?.nome,
        ...(s.tags ?? []),
        s.contribuicoes,
        s.consideracoesGerais,
        s.ordemCronologica,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return textos.includes(termo)
    })
  }, [setores, termo])

  const pessoasFiltradas = useMemo(() => {
    if (!termo) return []
    return pessoas.filter((p) =>
      [p.nome, p.cargo, p.observacoes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(termo)
    )
  }, [pessoas, termo])

  const entradasFiltradas = useMemo(() => {
    if (!termo) return []
    return [...entradas]
      .filter((e) =>
        [e.titulo, e.texto].filter(Boolean).join(' ').toLowerCase().includes(termo)
      )
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [entradas, termo])

  const total = setoresFiltrados.length + pessoasFiltradas.length + entradasFiltradas.length

  if (!query) {
    return (
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '24px' }}>
          Busca
        </h1>
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          border: '1px dashed var(--color-border)',
        }}>
          Use a barra de busca no início do dashboard pra pesquisar.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
        Busca
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
        {total === 0
          ? `Nenhum resultado para "${query}".`
          : `${total} resultado${total !== 1 ? 's' : ''} para "${query}"`}
      </p>

      {total === 0 && (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          border: '1px dashed var(--color-border)',
          marginTop: '16px',
        }}>
          Tente outros termos ou verifique a ortografia.
        </div>
      )}

      {setoresFiltrados.length > 0 && (
        <div>
          <div style={secaoLabel}>Setores ({setoresFiltrados.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {setoresFiltrados.map((s) => (
              <Link
                key={s.id}
                to={`/setores/${s.id}`}
                style={{ ...card, textDecoration: 'none', display: 'block' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {caminhoHierarquia(s)}
                  </span>
                  {!s.dataSaida && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                      padding: '2px 6px', borderRadius: '999px',
                      backgroundColor: '#10b981', color: 'white', whiteSpace: 'nowrap',
                    }}>
                      ATUAL
                    </span>
                  )}
                </div>
                {s.ordemCronologica && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px', fontStyle: 'italic' }}>
                    {s.ordemCronologica}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {pessoasFiltradas.length > 0 && (
        <div>
          <div style={secaoLabel}>Pessoas ({pessoasFiltradas.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {pessoasFiltradas.map((p) => (
              <Link
                key={p.id}
                to={`/pessoas/${p.id}`}
                style={{ ...card, textDecoration: 'none', display: 'block' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {p.nome}
                </div>
                {p.cargo && (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {p.cargo}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {entradasFiltradas.length > 0 && (
        <div>
          <div style={secaoLabel}>Entradas ({entradasFiltradas.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {entradasFiltradas.map((e) => (
              <div
                key={e.id}
                style={{ ...card, borderLeft: `3px solid ${CORES_TIPO[e.tipo]}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    {format(parseISO(e.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                    padding: '2px 8px', borderRadius: '999px',
                    backgroundColor: CORES_TIPO[e.tipo], color: 'white',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
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
        </div>
      )}
    </div>
  )
}