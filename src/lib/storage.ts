/**
 * Camada de armazenamento abstrata.
 * Hoje usa localStorage. Quando migrarmos pro Supabase, só trocamos o miolo
 * dessas funções (a interface pública continua a mesma).
 */

const PREFIXO = 'registro:'

function chave(colecao: string): string {
  return `${PREFIXO}${colecao}`
}

/**
 * Lê uma coleção inteira do storage.
 * Retorna array vazio se não existir.
 */
export function listar<T>(colecao: string): T[] {
  try {
    const raw = localStorage.getItem(chave(colecao))
    if (!raw) return []
    return JSON.parse(raw) as T[]
  } catch (err) {
    console.error(`Erro ao ler coleção "${colecao}":`, err)
    return []
  }
}

/**
 * Salva uma coleção inteira no storage (substitui).
 */
export function salvar<T>(colecao: string, dados: T[]): void {
  try {
    localStorage.setItem(chave(colecao), JSON.stringify(dados))
  } catch (err) {
    console.error(`Erro ao salvar coleção "${colecao}":`, err)
  }
}

/**
 * Adiciona um item a uma coleção.
 */
export function adicionar<T extends { id: string }>(colecao: string, item: T): T {
  const atuais = listar<T>(colecao)
  const novos = [...atuais, item]
  salvar(colecao, novos)
  return item
}

/**
 * Atualiza um item por id.
 */
export function atualizar<T extends { id: string }>(
  colecao: string,
  id: string,
  alteracoes: Partial<T>
): T | null {
  const atuais = listar<T>(colecao)
  const idx = atuais.findIndex((item) => item.id === id)
  if (idx === -1) return null

  const atualizado = { ...atuais[idx], ...alteracoes }
  const novos = [...atuais]
  novos[idx] = atualizado
  salvar(colecao, novos)
  return atualizado
}

/**
 * Remove um item por id.
 */
export function remover(colecao: string, id: string): boolean {
  const atuais = listar<{ id: string }>(colecao)
  const novos = atuais.filter((item) => item.id !== id)
  if (novos.length === atuais.length) return false
  salvar(colecao, novos)
  return true
}

/**
 * Busca um item por id.
 */
export function buscar<T extends { id: string }>(colecao: string, id: string): T | null {
  const atuais = listar<T>(colecao)
  return atuais.find((item) => item.id === id) ?? null
}

/**
 * Gera um ID único simples baseado em timestamp + aleatório.
 * Quando migrarmos pro Supabase, vamos usar UUID nativo do Postgres.
 */
export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Apaga uma coleção inteira (útil pra reset/debug).
 */
export function limparColecao(colecao: string): void {
  localStorage.removeItem(chave(colecao))
}

/**
 * Apaga TODOS os dados do app (útil pra reset total).
 */
export function limparTudo(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIXO))
  keys.forEach((k) => localStorage.removeItem(k))
}