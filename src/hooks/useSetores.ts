import { useState, useEffect, useCallback } from 'react'
import type { Setor } from '@/types/setor'
import { listar, adicionar, atualizar, remover, gerarId } from '@/lib/storage'

const COLECAO = 'setores'

export function useSetores() {
  const [setores, setSetores] = useState<Setor[]>([])

  // Recarrega do storage
  const recarregar = useCallback(() => {
    setSetores(listar<Setor>(COLECAO))
  }, [])

  // Carrega ao montar o componente
  useEffect(() => {
    recarregar()
  }, [recarregar])

  // Escuta mudanças no localStorage (útil se abrir em outra aba)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === `registro:${COLECAO}`) recarregar()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [recarregar])

  const adicionarSetor = useCallback(
    (dados: Omit<Setor, 'id' | 'createdAt' | 'updatedAt'>) => {
      const agora = new Date().toISOString()
      const novo: Setor = {
        ...dados,
        id: gerarId(),
        createdAt: agora,
        updatedAt: agora,
      }
      adicionar(COLECAO, novo)
      recarregar()
      return novo
    },
    [recarregar]
  )

  const atualizarSetor = useCallback(
    (id: string, alteracoes: Partial<Omit<Setor, 'id' | 'createdAt'>>) => {
      const atualizado = atualizar<Setor>(COLECAO, id, {
        ...alteracoes,
        updatedAt: new Date().toISOString(),
      })
      recarregar()
      return atualizado
    },
    [recarregar]
  )

  const removerSetor = useCallback(
    (id: string) => {
      const ok = remover(COLECAO, id)
      recarregar()
      return ok
    },
    [recarregar]
  )

  return {
    setores,
    adicionarSetor,
    atualizarSetor,
    removerSetor,
    recarregar,
  }
}