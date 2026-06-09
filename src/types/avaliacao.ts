export type TipoAvaliacao = 'inicial' | 'revisao' | 'final'

export interface AvaliacaoSetor {
  id: string
  setorId: string
  nota: number
  tipo: TipoAvaliacao
  data: string
  justificativa?: string
  contexto?: string
  createdAt: string
}

export const ROTULOS_TIPO_AVALIACAO: Record<TipoAvaliacao, string> = {
  inicial: 'Inicial',
  revisao: 'Revisão',
  final: 'Final',
}

export const TIPOS_AVALIACAO: TipoAvaliacao[] = Object.keys(
  ROTULOS_TIPO_AVALIACAO
) as TipoAvaliacao[]

export const CORES_TIPO_AVALIACAO: Record<TipoAvaliacao, string> = {
  inicial: '#3b82f6',
  revisao: '#f59e0b',
  final: '#a855f7',
}

export function corDaNota(nota: number): string {
  if (nota <= 3) return '#dc2626'
  if (nota <= 6) return '#f59e0b'
  if (nota <= 8) return '#3b82f6'
  return '#10b981'
}