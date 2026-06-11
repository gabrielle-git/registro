import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Setor } from '@/types/setor'

type Row = {
  id: string
  nivel1: Setor['nivel1']
  nivel2: Setor['nivel2'] | null
  nivel3: Setor['nivel3'] | null
  ordem_cronologica: string | null
  data_entrada: string
  data_saida: string | null
  contribuicoes: string | null
  consideracoes_gerais: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

const toSetor = (r: Row): Setor => ({
  id: r.id,
  nivel1: r.nivel1,
  nivel2: r.nivel2 ?? undefined,
  nivel3: r.nivel3 ?? undefined,
  ordemCronologica: r.ordem_cronologica ?? undefined,
  dataEntrada: r.data_entrada,
  dataSaida: r.data_saida ?? undefined,
  contribuicoes: r.contribuicoes ?? undefined,
  consideracoesGerais: r.consideracoes_gerais ?? undefined,
  tags: r.tags ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
})

const toRow = (d: Omit<Setor, 'id' | 'createdAt' | 'updatedAt'>) => ({
  nivel1: d.nivel1,
  nivel2: d.nivel2 ?? null,
  nivel3: d.nivel3 ?? null,
  ordem_cronologica: d.ordemCronologica ?? null,
  data_entrada: d.dataEntrada,
  data_saida: d.dataSaida ?? null,
  contribuicoes: d.contribuicoes ?? null,
  consideracoes_gerais: d.consideracoesGerais ?? null,
  tags: d.tags ?? null,
})

export function useSetores() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('setores')
      .select('*')
      .order('data_entrada', { ascending: false })
    if (!error && data) {
      setSetores((data as Row[]).map(toSetor))
      setCarregando(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  const adicionarSetor = useCallback(async (
    dados: Omit<Setor, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Setor> => {
    const { data, error } = await supabase.from('setores').insert(toRow(dados)).select().single()
    if (error) throw error
    await recarregar()
    return toSetor(data as Row)
  }, [recarregar])

  const atualizarSetor = useCallback(async (
    id: string,
    alt: Partial<Omit<Setor, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    const row: Record<string, unknown> = {}
    if (alt.nivel1 !== undefined) row.nivel1 = alt.nivel1
    if (alt.nivel2 !== undefined) row.nivel2 = alt.nivel2 ?? null
    if (alt.nivel3 !== undefined) row.nivel3 = alt.nivel3 ?? null
    if (alt.ordemCronologica !== undefined) row.ordem_cronologica = alt.ordemCronologica ?? null
    if (alt.dataEntrada !== undefined) row.data_entrada = alt.dataEntrada
    if (alt.dataSaida !== undefined) row.data_saida = alt.dataSaida ?? null
    if (alt.contribuicoes !== undefined) row.contribuicoes = alt.contribuicoes ?? null
    if (alt.consideracoesGerais !== undefined) row.consideracoes_gerais = alt.consideracoesGerais ?? null
    if (alt.tags !== undefined) row.tags = alt.tags ?? null
    const { error } = await supabase.from('setores').update(row).eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const removerSetor = useCallback(async (id: string) => {
    const { error } = await supabase.from('setores').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  return { setores, carregando, adicionarSetor, atualizarSetor, removerSetor, recarregar }
}