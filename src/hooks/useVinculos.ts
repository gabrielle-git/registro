import { useState, useEffect, useCallback } from 'react'
import type { Vinculo } from '@/types/pessoa'
import { listar, adicionar, atualizar, remover, gerarId } from '@/lib/storage'

const COLECAO = 'vinculos'

/**
 * Hook pra gerenciar vínculos entre pessoas e locais.
 * Cada vínculo diz: "encontrei essa pessoa nesse lugar com esse papel".
 *
 * O lugar pode ser um Setor cadastrado (setorId) OU um local em texto livre
 * (localLivre). Uma mesma pessoa pode ter vários vínculos (foi chefe num
 * setor, virou amiga num curso, etc).
 */
export function useVinculos() {
  const [vinculos, setVinculos] = useState<Vinculo[]>([])

  const recarregar = useCallback(() => {
    setVinculos(listar<Vinculo>(COLECAO))
  }, [])

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

  const adicionarVinculo = useCallback(
    (dados: Omit<Vinculo, 'id' | 'createdAt'>) => {
      const novo: Vinculo = {
        ...dados,
        id: gerarId(),
        createdAt: new Date().toISOString(),
      }
      adicionar(COLECAO, novo)
      recarregar()
      return novo
    },
    [recarregar]
  )

  const atualizarVinculo = useCallback(
    (id: string, alteracoes: Partial<Omit<Vinculo, 'id' | 'createdAt'>>) => {
      const atualizado = atualizar<Vinculo>(COLECAO, id, alteracoes)
      recarregar()
      return atualizado
    },
    [recarregar]
  )

  const removerVinculo = useCallback(
    (id: string) => {
      const ok = remover(COLECAO, id)
      recarregar()
      return ok
    },
    [recarregar]
  )

  /**
   * Helpers de consulta — facilitam o uso nas telas de detalhe.
   */
  const vinculosDaPessoa = useCallback(
    (pessoaId: string) => vinculos.filter((v) => v.pessoaId === pessoaId),
    [vinculos]
  )

  const vinculosDoSetor = useCallback(
    (setorId: string) => vinculos.filter((v) => v.setorId === setorId),
    [vinculos]
  )

  /**
   * Lista todos os "locais livres" únicos cadastrados — útil pra
   * autocomplete em formulários futuros ("já tem alguém da DECRIN").
   */
  const locaisLivresUsados = useCallback((): string[] => {
    const conj = new Set<string>()
    vinculos.forEach((v) => {
      if (v.localLivre) conj.add(v.localLivre)
    })
    return Array.from(conj).sort()
  }, [vinculos])

  return {
    vinculos,
    adicionarVinculo,
    atualizarVinculo,
    removerVinculo,
    vinculosDaPessoa,
    vinculosDoSetor,
    locaisLivresUsados,
    recarregar,
  }
}