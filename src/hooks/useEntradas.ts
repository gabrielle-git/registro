import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { EntradaDiario, TipoEntrada } from '@/types/entrada'

type Row = {
  id: string
  data: string
  titulo: string | null
  texto: string
  tipo: TipoEntrada
  setores_ids: string[] | null
  pessoas_ids: string[] | null
  created_at: string
}

const toEntrada = (r: Row): EntradaDiario => ({
  id: r.id,
  data: r.data,
  titulo: r.titulo ?? undefined,
  texto: r.texto,
  tipo: r.tipo,
  setoresIds: r.setores_ids?.length ? r.setores_ids : undefined,
  pessoasIds: r.pessoas_ids?.length ? r.pessoas_ids : undefined,
  createdAt: r.created_at,
})

export function useEntradas() {
  const [entradas, setEntradas] = useState<EntradaDiario[]>([])
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('entradas')
      .select('*')
      .order('data', { ascending: false })
    if (!error && data) {
      setEntradas((data as Row[]).map(toEntrada))
      setCarregando(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  const adicionarEntrada = useCallback(async (
    dados: Omit<EntradaDiario, 'id' | 'createdAt'>
  ): Promise<EntradaDiario> => {
    const { data, error } = await supabase
      .from('entradas')
      .insert({
        data: dados.data,
        titulo: dados.titulo ?? null,
        texto: dados.texto,
        tipo: dados.tipo,
        setores_ids: dados.setoresIds ?? [],
        pessoas_ids: dados.pessoasIds ?? [],
      })
      .select()
      .single()
    if (error) throw error
    await recarregar()
    return toEntrada(data as Row)
  }, [recarregar])

  const atualizarEntrada = useCallback(async (
    id: string,
    alt: Partial<Omit<EntradaDiario, 'id' | 'createdAt'>>
  ) => {
    const row: Record<string, unknown> = {}
    if (alt.data !== undefined) row.data = alt.data
    if (alt.titulo !== undefined) row.titulo = alt.titulo ?? null
    if (alt.texto !== undefined) row.texto = alt.texto
    if (alt.tipo !== undefined) row.tipo = alt.tipo
    if (alt.setoresIds !== undefined) row.setores_ids = alt.setoresIds ?? []
    if (alt.pessoasIds !== undefined) row.pessoas_ids = alt.pessoasIds ?? []
    const { error } = await supabase.from('entradas').update(row).eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const removerEntrada = useCallback(async (id: string) => {
    const { error } = await supabase.from('entradas').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  return { entradas, carregando, adicionarEntrada, atualizarEntrada, removerEntrada, recarregar }
}