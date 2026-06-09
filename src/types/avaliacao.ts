export interface AvaliacaoSetor {
  id: string
  setorId: string
  nota: number // 0 a 10
  tipo: 'inicial' | 'revisao' | 'final'
  data: string
  justificativa?: string
  contexto?: string
}