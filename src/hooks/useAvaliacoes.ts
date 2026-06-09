import { useState, useEffect, useCallback } from 'react'
import type { AvaliacaoSetor } from '@/types/avaliacao'
import { listar, adicionar, atualizar, remover, gerarId } from '@/lib/storage'

const COLECAO = 'avaliacoes'

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoSetor[]>([])

  const recarregar = useCallback(() => {
    setAvaliacoes(listar<AvaliacaoSetor>(COLECAO))
  }, [])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === `registro:${COLECAO}`) recarregar()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [recarregar])

  const adicionarAvaliacao = useCallback(
    (dados: Omit<AvaliacaoSetor, 'id'>) => {
      const nova: AvaliacaoSetor = {
        ...dados,
        id: gerarId(),
      }
      adicionar(COLECAO, nova)
      recarregar()
      return nova
    },
    [recarregar]
  )

  const atualizarAvaliacao = useCallback(
    (id: string, alteracoes: Partial<Omit<AvaliacaoSetor, 'id'>>) => {
      const atualizada = atualizar<AvaliacaoSetor>(COLECAO, id, alteracoes)
      recarregar()
      return atualizada
    },
    [recarregar]
  )

  const removerAvaliacao = useCallback(
    (id: string) => {
      const ok = remover(COLECAO, id)
      recarregar()
      return ok
    },
    [recarregar]
  )

  // Helper útil: pega avaliações de um setor específico, ordenadas por data
  const avaliacoesPorSetor = useCallback(
    (setorId: string) =>
      avaliacoes
        .filter((a) => a.setorId === setorId)
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()),
    [avaliacoes]
  )

  return {
    avaliacoes,
    adicionarAvaliacao,
    atualizarAvaliacao,
    removerAvaliacao,
    avaliacoesPorSetor,
    recarregar,
  }
}