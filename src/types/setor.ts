import type { TipoUnidade } from '@/data/catalogo_pcdf'

export type { TipoUnidade }

export interface NivelHierarquia {
  sigla: string
  nome?: string
  tipo: TipoUnidade
}

export interface Setor {
  id: string
  nivel1: NivelHierarquia
  nivel2?: NivelHierarquia
  nivel3?: NivelHierarquia
  ordemCronologica?: string
  dataEntrada: string
  dataSaida?: string
  contribuicoes?: string
  consideracoesGerais?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export function nomeCurtoSetor(setor: Setor): string {
  return setor.nivel3?.sigla || setor.nivel2?.sigla || setor.nivel1.sigla
}

export function caminhoHierarquia(setor: Setor): string {
  const partes = [setor.nivel1.sigla, setor.nivel2?.sigla, setor.nivel3?.sigla]
    .filter((s): s is string => Boolean(s))
  return partes.join(' › ')
}

export function caminhoSistema(setor: Setor): string {
  const partes = [setor.nivel1.sigla, setor.nivel2?.sigla, setor.nivel3?.sigla]
    .filter((s): s is string => Boolean(s))
  return '/' + partes.join('/')
}