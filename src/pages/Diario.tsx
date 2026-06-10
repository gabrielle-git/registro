import { useState, useMemo } from 'react'
import { Plus, Search, MapPin, User, Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEntradas } from '@/hooks/useEntradas'
import { useSetores } from '@/hooks/useSetores'
import { usePessoas } from '@/hooks/usePessoas'
import {
  type EntradaDiario,
  type TipoEntrada,
  TIPOS_ENTRADA,
  ROTULOS_TIPO_ENTRADA,
} from '@/types/entrada'
import { nomeCurtoSetor } from '@/types/setor'
import { Modal } from '@/components/ui/Modal'
import { ModalConfirmacao } from '@/components/ui/ModalConfirmacao'
import { EntradaForm } from '@/components/entrada/EntradaForm'

type FiltroTipo = TipoEntrada | 'todos'

const CORES_TIPO: Record<TipoEntrada, string> = {
  dia_normal: '#6b7280',
  feedback_recebido: '#3b82f6',
  aprendizado: '#10b981',
  observacao: '#f59e0b',
  marco: '#a855f7',
}

interface ItemEntradaProps {
  entrada: EntradaDiario
  nomeSetores: string[]
  nomePessoas: string[]
  aoEditar: (e: EntradaDiario) => void
  aoExcluir: (e: EntradaDiario) => void
}

function ItemEntrada({ entrada, nomeSetores, nomePessoas, aoEditar, aoExcluir }: ItemEntradaProps) {
  const corTipo = CORES_TIPO[entrada.tipo]

  return (
    <div style={{
      padding: '16px',
      borderRadius: '10px',
      backgroundColor: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderLeft: `3px solid ${corTipo}`,
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '2px' }}>
        <button
          onClick={() => aoEditar(entrada)}
          aria-label="Editar entrada"
          style={{
            background: 'transparent', border: 'none', padding: '4px',
            cursor: 'pointer', color: 'var(--color-text-tertiary)', display: 'flex',
            opacity: 0.6, transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => aoExcluir(entrada)}
          aria-label="Excluir entrada"
          style={{
            background: 'transparent', border: 'none', padding: '4px',
            cursor: 'pointer', color: '#dc2626', display: 'flex',
            opacity: 0.6, transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px', paddingRight: '52px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
          {format(parseISO(entrada.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
          padding: '2px 8px', borderRadius: '999px',
          backgroundColor: corTipo, color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          {ROTULOS_TIPO_ENTRADA[entrada.tipo]}
        </span>
      </div>

      {entrada.titulo && (
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
          {entrada.titulo}
        </h3>
      )}

      <p style={{
        fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {entrada.texto}
      </p>

      {(nomeSetores.length > 0 || nomePessoas.length > 0) && (
        <div style={{
          marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--color-border)',
          display: 'flex', flexWrap: 'wrap', gap: '12px',
          fontSize: '12px', color: 'var(--color-text-tertiary)',
        }}>
          {nomeSetores.length > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} />
              {nomeSetores.join(', ')}
            </span>
          )}
          {nomePessoas.length > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} />
              {nomePessoas.join(', ')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function Diario() {
  const { entradas, removerEntrada } = useEntradas()
  const { setores } = useSetores()
  const { pessoas } = usePessoas()
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos')
  const [modalNovaAberto, setModalNovaAberto] = useState(false)
  const [entradaEditando, setEntradaEditando] = useState<EntradaDiario | null>(null)
  const [entradaExcluindo, setEntradaExcluindo] = useState<EntradaDiario | null>(null)

  const entradasFiltradas = useMemo(() => {
    let lista = [...entradas].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )
    if (filtroTipo !== 'todos') lista = lista.filter((e) => e.tipo === filtroTipo)
    if (busca.trim()) {
      const termo = busca.toLowerCase()
      lista = lista.filter((e) =>
        e.texto.toLowerCase().includes(termo) || e.titulo?.toLowerCase().includes(termo)
      )
    }
    return lista
  }, [entradas, filtroTipo, busca])

  const resolverNomesSetores = (ids?: string[]) => {
    if (!ids) return []
    return ids
      .map((id) => setores.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => nomeCurtoSetor(s))
  }

  const resolverNomesPessoas = (ids?: string[]) => {
    if (!ids) return []
    return ids
      .map((id) => pessoas.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => p.nome)
  }

  const chipFiltroStyle = (ativo: boolean, cor?: string): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: '999px', fontSize: '12px',
    fontWeight: ativo ? 600 : 400, cursor: 'pointer',
    border: '1px solid var(--color-border)',
    backgroundColor: ativo ? (cor || 'var(--color-text-primary)') : 'var(--color-bg-secondary)',
    color: ativo ? 'white' : 'var(--color-text-primary)',
    transition: 'all 0.15s',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Diário
        </h1>
        <button
          onClick={() => setModalNovaAberto(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
            backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg-primary)',
            border: 'none', cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          Nova entrada
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search size={16} style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)',
        }} />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar no conteúdo ou título..."
          style={{
            width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px',
            fontSize: '14px', backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        <button type="button" onClick={() => setFiltroTipo('todos')} style={chipFiltroStyle(filtroTipo === 'todos')}>
          Todos
        </button>
        {TIPOS_ENTRADA.map((t) => (
          <button key={t} type="button" onClick={() => setFiltroTipo(t)} style={chipFiltroStyle(filtroTipo === t, CORES_TIPO[t])}>
            {ROTULOS_TIPO_ENTRADA[t]}
          </button>
        ))}
      </div>

      {entradasFiltradas.length === 0 ? (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px', border: '1px dashed var(--color-border)',
        }}>
          {entradas.length === 0
            ? 'Nenhuma entrada no diário ainda. Registre o primeiro dia.'
            : 'Nenhuma entrada corresponde aos filtros.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {entradasFiltradas.map((e) => (
            <ItemEntrada
              key={e.id}
              entrada={e}
              nomeSetores={resolverNomesSetores(e.setoresIds)}
              nomePessoas={resolverNomesPessoas(e.pessoasIds)}
              aoEditar={setEntradaEditando}
              aoExcluir={setEntradaExcluindo}
            />
          ))}
        </div>
      )}

      <Modal aberto={modalNovaAberto} aoFechar={() => setModalNovaAberto(false)} titulo="Nova entrada de diário" larguraMax="640px">
        <EntradaForm aoSalvar={() => setModalNovaAberto(false)} aoCancelar={() => setModalNovaAberto(false)} />
      </Modal>

      <Modal aberto={Boolean(entradaEditando)} aoFechar={() => setEntradaEditando(null)} titulo="Editar entrada" larguraMax="640px">
        {entradaEditando && (
          <EntradaForm aoSalvar={() => setEntradaEditando(null)} aoCancelar={() => setEntradaEditando(null)} valoresIniciais={entradaEditando} />
        )}
      </Modal>

      <ModalConfirmacao
        aberto={Boolean(entradaExcluindo)}
        aoFechar={() => setEntradaExcluindo(null)}
        aoConfirmar={() => {
          if (entradaExcluindo) {
            removerEntrada(entradaExcluindo.id)
            setEntradaExcluindo(null)
          }
        }}
        titulo="Excluir entrada"
        mensagem="Tem certeza que quer excluir esta entrada do diário? Essa ação não pode ser desfeita."
      />
    </div>
  )
}