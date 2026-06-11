import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Pessoa } from '@/types/pessoa'

type Row = {
  id: string
  nome: string
  cargo: string | null
  observacoes: string | null
  created_at: string
}

const toPessoa = (r: Row): Pessoa => ({
  id: r.id,
  nome: r.nome,
  cargo: r.cargo ?? undefined,
  observacoes: r.observacoes ?? undefined,
  createdAt: r.created_at,
})

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('pessoas')
      .select('*')
      .order('nome')
    if (!error && data) {
      setPessoas((data as Row[]).map(toPessoa))
      setCarregando(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  const adicionarPessoa = useCallback(async (
    dados: Omit<Pessoa, 'id' | 'createdAt'>
  ): Promise<Pessoa> => {
    const { data, error } = await supabase
      .from('pessoas')
      .insert({ nome: dados.nome, cargo: dados.cargo ?? null, observacoes: dados.observacoes ?? null })
      .select()
      .single()
    if (error) throw error
    await recarregar()
    return toPessoa(data as Row)
  }, [recarregar])

  const atualizarPessoa = useCallback(async (
    id: string,
    alt: Partial<Omit<Pessoa, 'id' | 'createdAt'>>
  ) => {
    const row: Record<string, unknown> = {}
    if (alt.nome !== undefined) row.nome = alt.nome
    if (alt.cargo !== undefined) row.cargo = alt.cargo ?? null
    if (alt.observacoes !== undefined) row.observacoes = alt.observacoes ?? null
    const { error } = await supabase.from('pessoas').update(row).eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  const removerPessoa = useCallback(async (id: string) => {
    const { error } = await supabase.from('pessoas').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }, [recarregar])

  return { pessoas, carregando, adicionarPessoa, atualizarPessoa, removerPessoa, recarregar }
}