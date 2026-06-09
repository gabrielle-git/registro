import type { TipoUnidade } from '@/data/catalogo_pcdf'

/**
 * Um nível da hierarquia onde o setor está.
 * Pode vir do catálogo (PCDF) ou ser custom (digitado pelo usuário).
 */
export interface NivelHierarquia {
  sigla: string
  nome?: string
  tipo: TipoUnidade
}

export interface Setor {
  id: string

  // Hierarquia: do mais geral pro mais específico
  // nivel1 é sempre obrigatório (departamento/órgão)
  // nivel2 e nivel3 são opcionais
  nivel1: NivelHierarquia
  nivel2?: NivelHierarquia
  nivel3?: NivelHierarquia

  // Metadados
  ordemCronologica?: string // "Quarto mês"
  dataEntrada: string // ISO date
  dataSaida?: string

  // Conteúdo livre
  contribuicoes?: string
  consideracoesGerais?: string
  tags?: string[]

  createdAt: string
  updatedAt: string
}

/**
 * Helper: retorna o "nome curto" do setor pra exibir em listas/cards.
 * Pega o nível mais específico que existe.
 */
export function nomeCurtoSetor(setor: Setor): string {
  return setor.nivel3?.sigla ?? setor.nivel2?.sigla ?? setor.nivel1.sigla
}

/**
 * Helper: retorna o "caminho hierárquico" do setor.
 * Ex: "DPE › CHPP › SAAEI"
 */
export function caminhoHierarquia(setor: Setor): string {
  const partes = [setor.nivel1.sigla]
  if (setor.nivel2) partes.push(setor.nivel2.sigla)
  if (setor.nivel3) partes.push(setor.nivel3.sigla)
  return partes.join(' › ')
}
