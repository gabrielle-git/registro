import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSetores } from '@/hooks/useSetores'
import { useVinculos } from '@/hooks/useVinculos'
import { caminhoHierarquia, type Setor } from '@/types/setor'
import { Modal } from '@/components/ui/Modal'
import { SetorForm } from '@/components/setor/SetorForm'

function formatarData(iso: string): string {
  return format(parseISO(iso), "dd 'de' MMM yyyy", { locale: ptBR })
}

function CardSetor({ setor, qtdVinculos }: { setor: Setor; qtdVinculos: number }) {
  const ehAtual = !setor.dataSaida
  const nivelMaisEspecifico = setor.nivel3 || setor.nivel2 || setor.nivel1
  const mostrarNomeCompleto =
    nivelMaisEspecifico.nome &&
    nivelMaisEspecifico.nome !== nivelMaisEspecifico.sigla

  return (
    <Link
      to={`/setores/${setor.id}`}
      style={{
        textDecoration: 'none',
        display: 'block',
        padding: '16px',
        borderRadius: '10px',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {caminhoHierarquia(setor)}
        </h3>
        {ehAtual && (
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: '#10b981',
            color: 'white',
          }}>
            ATUAL
          </span>
        )}
      </div>

      {mostrarNomeCompleto && (
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
          {nivelMaisEspecifico.nome}
        </p>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: 'var(--color-text-tertiary)',
        marginTop: '12px',
      }}>
        <Calendar size={12} />
        {formatarData(setor.dataEntrada)}
        {setor.dataSaida && ` → ${formatarData(setor.dataSaida)}`}
      </div>

      {setor.ordemCronologica && (
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
          {setor.ordemCronologica}
        </p>
      )}

      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px dashed var(--color-border)',
        fontSize: '12px',
        color: 'var(--color-text-tertiary)',
      }}>
        {qtdVinculos === 0 ? 'Nenhuma pessoa vinculada' : `${qtdVinculos} pessoa${qtdVinculos > 1 ? 's' : ''} vinculada${qtdVinculos > 1 ? 's' : ''}`}
      </div>
    </Link>
  )
}

export function Setores() {
  const { setores } = useSetores()
  const { vinculosDoSetor } = useVinculos()
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  const setoresFiltrados = useMemo(() => {
    const ordenados = [...setores].sort((a, b) =>
      new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime()
    )
    if (!busca.trim()) return ordenados
    const termo = busca.toLowerCase()
    return ordenados.filter((s) => {
      const caminho = caminhoHierarquia(s).toLowerCase()
      const nomes = [s.nivel1.nome, s.nivel2?.nome, s.nivel3?.nome]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return caminho.includes(termo) || nomes.includes(termo)
    })
  }, [setores, busca])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Setores
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
          Novo setor
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
          placeholder="Buscar por sigla ou nome..."
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

      {setoresFiltrados.length === 0 ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          border: '1px dashed var(--color-border)',
        }}>
          {setores.length === 0
            ? 'Nenhum setor cadastrado ainda. Comece adicionando o primeiro.'
            : `Nenhum setor corresponde a "${busca}".`}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {setoresFiltrados.map((s) => (
            <CardSetor
              key={s.id}
              setor={s}
              qtdVinculos={vinculosDoSetor(s.id).length}
            />
          ))}
        </div>
      )}

      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo="Novo setor"
        larguraMax="640px"
      >
        <SetorForm
          aoSalvar={() => setModalAberto(false)}
          aoCancelar={() => setModalAberto(false)}
        />
      </Modal>
    </div>
  )
}