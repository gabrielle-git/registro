/**
 * Migrações automáticas de dados do localStorage.
 * Quando a estrutura dos dados muda entre versões, essas funções
 * convertem dados antigos pro formato novo, evitando perda de dados.
 */

import type { Setor } from '@/types/setor'
import type { Vinculo, PapelPessoa } from '@/types/pessoa'
import { listar, salvar, limparColecao } from './storage'

const FLAG_VERSAO = 'registro:versao-schema'
const VERSAO_ATUAL = 3

// =====================================================================
// v1 → v2: Hierarquia de 3 níveis no Setor
// =====================================================================

/**
 * Schema antigo (v1) do setor — antes da hierarquia de 3 níveis.
 */
interface SetorV1 {
  id: string
  nome?: string
  nomeCompleto?: string
  departamento?: string
  ordemCronologica?: string
  dataEntrada: string
  dataSaida?: string
  contribuicoes?: string
  consideracoesGerais?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  nivel1?: unknown // pode já ter os campos novos
}

function migrarSetorV1ParaV2(antigo: SetorV1): Setor {
  if (antigo.nivel1) {
    return antigo as unknown as Setor
  }

  const dept = antigo.departamento?.trim() || 'Não informado'
  const nome = antigo.nome?.trim() || 'Não informado'

  return {
    id: antigo.id,
    nivel1: {
      sigla: dept,
      nome: dept,
      tipo: 'departamento',
    },
    nivel2: {
      sigla: nome,
      nome: antigo.nomeCompleto || nome,
      tipo: 'outro',
    },
    ordemCronologica: antigo.ordemCronologica,
    dataEntrada: antigo.dataEntrada,
    dataSaida: antigo.dataSaida,
    contribuicoes: antigo.contribuicoes,
    consideracoesGerais: antigo.consideracoesGerais,
    tags: antigo.tags,
    createdAt: antigo.createdAt,
    updatedAt: antigo.updatedAt,
  }
}

// =====================================================================
// v2 → v3: PessoaSetor vira Vinculo flexível
// (suporta setor cadastrado OU local em texto livre)
// =====================================================================

/**
 * Schema antigo (v2) do vínculo — só permitia setor cadastrado.
 * Ficava na chave 'vinculos_pessoa_setor'.
 */
interface VinculoV2 {
  id: string
  pessoaId: string
  setorId: string
  papel: PapelPessoa
  observacoesNoSetor?: string
  createdAt: string
}

function migrarVinculoV2ParaV3(antigo: VinculoV2): Vinculo {
  return {
    id: antigo.id,
    pessoaId: antigo.pessoaId,
    setorId: antigo.setorId, // mantém o vínculo a setor; localLivre fica undefined
    papel: antigo.papel,
    observacoes: antigo.observacoesNoSetor, // renomeado
    createdAt: antigo.createdAt,
  }
}

// =====================================================================
// Orquestrador
// =====================================================================

export function rodarMigracoes(): void {
  const versaoSalva = parseInt(localStorage.getItem(FLAG_VERSAO) ?? '1', 10)

  if (versaoSalva >= VERSAO_ATUAL) return

  console.log(`[migracao] Migrando do schema v${versaoSalva} pra v${VERSAO_ATUAL}...`)

  // v1 → v2: estrutura hierárquica do setor
  if (versaoSalva < 2) {
    const setoresAntigos = listar<SetorV1>('setores')
    const setoresMigrados = setoresAntigos.map(migrarSetorV1ParaV2)
    salvar('setores', setoresMigrados)
    console.log(`[migracao] ${setoresMigrados.length} setores migrados pra v2`)
  }

  // v2 → v3: vínculo flexível (renomeio de coleção + de campo)
  if (versaoSalva < 3) {
    const vinculosAntigos = listar<VinculoV2>('vinculos_pessoa_setor')
    if (vinculosAntigos.length > 0) {
      const vinculosMigrados = vinculosAntigos.map(migrarVinculoV2ParaV3)
      salvar('vinculos', vinculosMigrados)
      limparColecao('vinculos_pessoa_setor') // remove a chave antiga
      console.log(
        `[migracao] ${vinculosMigrados.length} vínculos migrados pra v3 (coleção renomeada)`
      )
    }
  }

  localStorage.setItem(FLAG_VERSAO, String(VERSAO_ATUAL))
  console.log('[migracao] Concluída ✓')
}

/**
 * Helper pra forçar reset da versão (útil pra debug).
 */
export function resetarVersaoSchema(): void {
  localStorage.removeItem(FLAG_VERSAO)
}