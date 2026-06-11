import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Vinculo, PapelPessoa } from '@/types/pessoa'

type Row = {
  id: string
  pessoa_id: string
  setor_id: string | null
  local_livre: string | null
  papel: PapelPessoa
  observacoes: string | null
  created_at: string
}

const toVinculo = (r: Row): Vinculo => ({
  id: r.id,
  pessoaId: r.pessoa_id,
  setorId: r.setor_id ?? undefined,
  localLivre: r.local_livre ?? undefined,
  papel: r.papel,
  observacoes: r.observacoes ?? undefined,
  createdAt: r.created_at,
})

export function useVinculos() {
  const [vinculos, setVinculos] = useState<Vinculo[]>([])
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    const { data, error } = await supabase.from('vinculos').select('*')
    if (!error && data) {
      setVinculos((data as Row[]).map(toVinculo))
      setCarregando(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  const adicionarVinculo = useCallback(async (
    dados: Omit<Vinculo, 'id' | 'createdAt'>
  ): Promise<Vinculo> => {
    const { data, error } = await supabase
      .from('vinculos')
      .insert({
        pessoa_id: dados.pessoaId,
        setor_id: dados.setorId ?? null,
        local_livre: dados.localLivre ?? null,
        papel: dados.papel,
        observacoes: dados.observacoes ?? null,
      })
      .select()
      .single()
    if (error) throw error
    await recarregar()
    return toVinculo(data as Row)
  }, [recarregar])

  const atualizarVinculo = useCallback(async (
    id: string,
    alt: Partial<Omit<Vinculo, 'id' | 'createdAt'>>
  ) => {
    const row: Record<string, unknown> = {}
    if (alt.setorId !== undefined) row.setor_id = alt.setorId ?? null
    if (alt.localLivre !== undefined) row.local_livre = alt.localLivre ?? null
    if (alt.papel !== undefined) row.papel = alt.papel
    if (alt.observacoes !== undefined) row.observacoes = alt.observacoes ?? null
    const { error } = await supabase.from('vinculos').update(row).eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const removerVinculo = useCallback(async (id: string) => {
    const { error } = await supabase.from('vinculos').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const vinculosDaPessoa = useCallback(
    (pessoaId: string) => vinculos.filter((v) => v.pessoaId === pessoaId),
    [vinculos]
  )

  const vinculosDoSetor = useCallback(
    (setorId: string) => vinculos.filter((v) => v.setorId === setorId),
    [vinculos]
  )

  return { vinculos, carregando, adicionarVinculo, atualizarVinculo, removerVinculo, vinculosDaPessoa, vinculosDoSetor, recarregar }
}