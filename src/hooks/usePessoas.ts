import { useState, useEffect, useCallback } from 'react'
import type { Pessoa } from '@/types/pessoa'
import { listar, adicionar, atualizar, remover, gerarId } from '@/lib/storage'

const COLECAO = 'pessoas'

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])

  const recarregar = useCallback(() => {
    setPessoas(listar<Pessoa>(COLECAO))
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

  const adicionarPessoa = useCallback(
    (dados: Omit<Pessoa, 'id' | 'createdAt'>) => {
      const nova: Pessoa = {
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

  const atualizarPessoa = useCallback(
    (id: string, alteracoes: Partial<Omit<Pessoa, 'id' | 'createdAt'>>) => {
      const atualizada = atualizar<Pessoa>(COLECAO, id, alteracoes)
      recarregar()
      return atualizada
    },
    [recarregar]
  )

  const removerPessoa = useCallback(
    (id: string) => {
      const ok = remover(COLECAO, id)
      recarregar()
      return ok
    },
    [recarregar]
  )

  return {
    pessoas,
    adicionarPessoa,
    atualizarPessoa,
    removerPessoa,
    recarregar,
  }
}