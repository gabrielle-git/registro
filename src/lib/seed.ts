/**
 * Popula o storage com dados iniciais na primeira vez que o app roda.
 * Útil pra demonstração; depois você pode resetar e começar do zero.
 */

import { setoresMock, pessoasMock, entradasMock } from '@/data/mocks'
import { listar, salvar } from './storage'

const FLAG_SEED = 'registro:seed-feito'

export function rodarSeedSeNecessario(): void {
  const jaFeito = localStorage.getItem(FLAG_SEED)
  if (jaFeito === 'true') return

  // Só popula se as coleções estiverem vazias (não sobrescreve dados reais)
  if (listar('setores').length === 0) {
    salvar('setores', setoresMock)
  }
  if (listar('pessoas').length === 0) {
    salvar('pessoas', pessoasMock)
  }
  if (listar('entradas').length === 0) {
    salvar('entradas', entradasMock)
  }

  localStorage.setItem(FLAG_SEED, 'true')
}

/**
 * Reseta o seed flag — útil pra forçar repopular após limpar dados.
 */
export function resetarSeedFlag(): void {
  localStorage.removeItem(FLAG_SEED)
}