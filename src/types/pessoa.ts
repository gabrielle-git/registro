/**
 * Tipos do domínio Pessoa.
 *
 * Pessoa é uma entidade independente: cadastra uma vez, referencia em vários
 * lugares (entradas de diário, vínculos). Quando migrarmos pro Supabase,
 * isso vira a tabela `pessoas`.
 *
 * Vinculo é a tabela de junção: representa "encontrei essa pessoa em tal lugar
 * com tal papel". O "lugar" pode ser:
 *   - um Setor cadastrado (setorId) — caso eu tenha passado por lá
 *   - um local em texto livre (localLivre) — outro setor da PCDF, outro órgão,
 *     faculdade, curso, qualquer coisa
 *
 * Antes era "PessoaSetor" e exigia um setor cadastrado, mas isso não dava conta
 * de amizades feitas em lugares onde a Gabrielle não trabalhou.
 */

export interface Pessoa {
  id: string
  nome: string
  cargo?: string
  observacoes?: string // texto livre, cresce com o tempo
  createdAt: string
}

export type PapelPessoa =
  | 'chefe'
  | 'coordenador'
  | 'diretor'
  | 'colega'
  | 'amizade'
  | 'outro'

/**
 * Vínculo entre uma Pessoa e um Local.
 *
 * Invariante: setorId OU localLivre deve estar preenchido (não ambos vazios,
 * não ambos preenchidos). A validação fica na camada de UI / form.
 */
export interface Vinculo {
  id: string
  pessoaId: string

  // Modo A: setor que a Gabrielle passou (referência ao Setor cadastrado)
  setorId?: string

  // Modo B: local em texto livre (sigla PCDF não cadastrada, outro órgão,
  // faculdade, curso, etc)
  localLivre?: string

  papel: PapelPessoa
  observacoes?: string
  createdAt: string
}

/**
 * Rótulos amigáveis pros papéis (pra mostrar em dropdowns/UI).
 */
export const ROTULOS_PAPEL: Record<PapelPessoa, string> = {
  chefe: 'Chefe',
  coordenador: 'Coordenador(a)',
  diretor: 'Diretor(a)',
  colega: 'Colega',
  amizade: 'Amizade',
  outro: 'Outro',
}

export const PAPEIS: PapelPessoa[] = Object.keys(ROTULOS_PAPEL) as PapelPessoa[]

/**
 * Helper: verifica se um vínculo é a um setor cadastrado.
 */
export function vinculoEhSetor(v: Vinculo): boolean {
  return Boolean(v.setorId)
}

/**
 * Helper: verifica se um vínculo é a um local externo (texto livre).
 */
export function vinculoEhExterno(v: Vinculo): boolean {
  return Boolean(v.localLivre)
}