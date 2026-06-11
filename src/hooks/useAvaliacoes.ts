import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { AvaliacaoSetor, TipoAvaliacao } from '@/types/avaliacao'

type Row = {
  id: string
  setor_id: string
  nota: number
  tipo: TipoAvaliacao
  data: string
  justificativa: string | null
  contexto: string | null
  created_at: string
}

const toAvaliacao = (r: Row): AvaliacaoSetor => ({
  id: r.id,
  setorId: r.setor_id,
  nota: Number(r.nota),
  tipo: r.tipo,
  data: r.data,
  justificativa: r.justificativa ?? undefined,
  contexto: r.contexto ?? undefined,
  createdAt: r.created_at,
})

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoSetor[]>([])
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    const { data, error } = await supabase.from('avaliacoes').select('*').order('data')
    if (!error && data) {
      setAvaliacoes((data as Row[]).map(toAvaliacao))
      setCarregando(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  const adicionarAvaliacao = useCallback(async (
    dados: Omit<AvaliacaoSetor, 'id' | 'createdAt'>
  ): Promise<AvaliacaoSetor> => {
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert({
        setor_id: dados.setorId,
        nota: dados.nota,
        tipo: dados.tipo,
        data: dados.data,
        justificativa: dados.justificativa ?? null,
        contexto: dados.contexto ?? null,
      })
      .select()
      .single()
    if (error) throw error
    await recarregar()
    return toAvaliacao(data as Row)
  }, [recarregar])

  const atualizarAvaliacao = useCallback(async (
    id: string,
    alt: Partial<Omit<AvaliacaoSetor, 'id' | 'createdAt'>>
  ) => {
    const row: Record<string, unknown> = {}
    if (alt.nota !== undefined) row.nota = alt.nota
    if (alt.tipo !== undefined) row.tipo = alt.tipo
    if (alt.data !== undefined) row.data = alt.data
    if (alt.justificativa !== undefined) row.justificativa = alt.justificativa ?? null
    if (alt.contexto !== undefined) row.contexto = alt.contexto ?? null
    const { error } = await supabase.from('avaliacoes').update(row).eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const removerAvaliacao = useCallback(async (id: string) => {
    const { error } = await supabase.from('avaliacoes').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const avaliacoesPorSetor = useCallback(
    (setorId: string) => avaliacoes.filter((a) => a.setorId === setorId),
    [avaliacoes]
  )

  return { avaliacoes, carregando, adicionarAvaliacao, atualizarAvaliacao, removerAvaliacao, avaliacoesPorSetor, recarregar }
}