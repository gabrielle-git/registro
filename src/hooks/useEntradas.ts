import { useState, useEffect, useCallback } from 'react'
import type { EntradaDiario } from '@/types/entrada'
import { listar, adicionar, atualizar, remover, gerarId } from '@/lib/storage'

const COLECAO = 'entradas'

export function useEntradas() {
  const [entradas, setEntradas] = useState<EntradaDiario[]>([])

  const recarregar = useCallback(() => {
    setEntradas(listar<EntradaDiario>(COLECAO))
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

  const adicionarEntrada = useCallback(
    (dados: Omit<EntradaDiario, 'id' | 'createdAt'>) => {
      const nova: EntradaDiario = {
        ...dados,
        id: gerarId(),
        createdAt: new Date().toISOString(),
      }
      adicionar(COLECAO, nova)
      recarregar()
      return nova
    },
    [recarregar]
  )

  const atualizarEntrada = useCallback(
    (id: string, alteracoes: Partial<Omit<EntradaDiario, 'id' | 'createdAt'>>) => {
      const atualizada = atualizar<EntradaDiario>(COLECAO, id, alteracoes)
      recarregar()
      return atualizada
    },
    [recarregar]
  )

  const removerEntrada = useCallback(
    (id: string) => {
      const ok = remover(COLECAO, id)
      recarregar()
      return ok
    },
    [recarregar]
  )

  return {
    entradas,
    adicionarEntrada,
    atualizarEntrada,
    removerEntrada,
    recarregar,
  }
}