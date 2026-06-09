import { useState, useMemo } from 'react'
import { Plus, Search, User } from 'lucide-react'
import { usePessoas } from '@/hooks/usePessoas'
import { useVinculos } from '@/hooks/useVinculos'
import type { Pessoa } from '@/types/pessoa'
import { Modal } from '@/components/ui/Modal'
import { PessoaForm } from '@/components/pessoa/PessoaForm'

function CardPessoa({ pessoa, qtdVinculos }: { pessoa: Pessoa; qtdVinculos: number }) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '10px',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          flexShrink: 0,
        }}>
          <User size={20} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {pessoa.nome}
          </h3>
          {pessoa.cargo && (
            <p style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {pessoa.cargo}
            </p>
          )}
        </div>
      </div>

      {pessoa.observacoes && (
        <p style={{
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
          marginBottom: '10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {pessoa.observacoes}
        </p>
      )}

      <div style={{
        paddingTop: '10px',
        borderTop: '1px dashed var(--color-border)',
        fontSize: '12px',
        color: 'var(--color-text-tertiary)',
      }}>
        {qtdVinculos === 0 ? 'Sem vínculos cadastrados' : `${qtdVinculos} vínculo${qtdVinculos > 1 ? 's' : ''}`}
      </div>
    </div>
  )
}

export function Pessoas() {
  const { pessoas } = usePessoas()
  const { vinculosDaPessoa } = useVinculos()
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  const pessoasFiltradas = useMemo(() => {
    const ordenadas = [...pessoas].sort((a, b) => a.nome.localeCompare(b.nome))
    if (!busca.trim()) return ordenadas
    const termo = busca.toLowerCase()
    return ordenadas.filter((p) =>
      p.nome.toLowerCase().includes(termo) ||
      p.cargo?.toLowerCase().includes(termo) ||
      p.observacoes?.toLowerCase().includes(termo)
    )
  }, [pessoas, busca])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Pessoas
        </h1>
        <button
          onClick={() => setModalAberto(true)}
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
          }}
        >
          <Plus size={14} />
          Nova pessoa
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-tertiary)',
        }} />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, cargo ou observação..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            outline: 'none',
          }}
        />
      </div>

      {pessoasFiltradas.length === 0 ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          border: '1px dashed var(--color-border)',
        }}>
          {pessoas.length === 0
            ? 'Nenhuma pessoa cadastrada ainda. Comece adicionando a primeira.'
            : `Nenhuma pessoa corresponde a "${busca}".`}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
        }}>
          {pessoasFiltradas.map((p) => (
            <CardPessoa
              key={p.id}
              pessoa={p}
              qtdVinculos={vinculosDaPessoa(p.id).length}
            />
          ))}
        </div>
      )}

      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo="Nova pessoa"
        larguraMax="640px"
      >
        <PessoaForm
          aoSalvar={() => setModalAberto(false)}
          aoCancelar={() => setModalAberto(false)}
        />
      </Modal>
    </div>
  )
}