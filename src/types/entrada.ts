/**
 * Tipos do domínio EntradaDiario.
 *
 * Uma entrada é um "registro do dia" — pode ser um relato de dia normal,
 * um feedback que recebeu, um aprendizado novo, uma observação ou um
 * marco importante. Pode mencionar setores e pessoas, criando os
 * cruzamentos que vão alimentar buscas e timelines depois.
 */

export type TipoEntrada =
  | 'dia_normal'
  | 'feedback_recebido'
  | 'aprendizado'
  | 'observacao'
  | 'marco'

export interface EntradaDiario {
  id: string
  data: string // ISO date (YYYY-MM-DD)
  titulo?: string
  texto: string
  tipo: TipoEntrada
  setoresIds?: string[] // ids de Setor mencionados
  pessoasIds?: string[] // ids de Pessoa mencionadas
  createdAt: string
}

/**
 * Rótulos amigáveis pros tipos (pra mostrar em dropdowns / cards).
 */
export const ROTULOS_TIPO_ENTRADA: Record<TipoEntrada, string> = {
  dia_normal: 'Dia normal',
  feedback_recebido: 'Feedback recebido',
  aprendizado: 'Aprendizado',
  observacao: 'Observação',
  marco: 'Marco',
}

export const TIPOS_ENTRADA: TipoEntrada[] = Object.keys(
  ROTULOS_TIPO_ENTRADA
) as TipoEntrada[]