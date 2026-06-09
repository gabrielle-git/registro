import type { Setor } from '@/types/setor'
import type { Pessoa } from '@/types/pessoa'
import type { EntradaDiario } from '@/types/entrada'

export const setoresMock: Setor[] = [
  {
    id: 's1',
    nivel1: { sigla: 'DEPATE', nome: 'Departamento de Atividades Especiais', tipo: 'departamento' },
    nivel2: { sigla: 'DOA', nome: 'Divisão de Operações Aéreas', tipo: 'divisao' },
    nivel3: { sigla: 'SAAEI', nome: 'Seção de Apoio Administrativo, Estatística e Informática', tipo: 'secao' },
    ordemCronologica: 'Quarto mês',
    dataEntrada: '2026-02-02',
    contribuicoes: 'Atendimento interno; organização de planilhas de estatística mensal.',
    consideracoesGerais:
      'Setor receptivo depois da primeira semana. Lanche coletivo às quintas. Fofoca moderada, nada tóxico. A chefe não micromaneja, mas cobra prazo.',
    tags: ['administrativo', 'informática'],
    createdAt: '2026-02-02T08:00:00Z',
    updatedAt: '2026-05-16T18:00:00Z',
  },
  {
    id: 's2',
    nivel1: { sigla: 'DPC', nome: 'Departamento de Polícia Circunscricional', tipo: 'departamento' },
    nivel2: { sigla: '05ª DP', nome: '5ª Delegacia de Polícia — Setor de Grandes Áreas Norte', tipo: 'delegacia' },
    ordemCronologica: 'Terceiro mês',
    dataEntrada: '2025-11-03',
    dataSaida: '2026-01-30',
    contribuicoes: 'Atendimento ao público; auxílio em oitivas.',
    consideracoesGerais: 'Movimento intenso, equipe simpática mas cansada. Aprendi muito sobre TCO.',
    tags: ['operacional', 'atendimento'],
    createdAt: '2025-11-03T08:00:00Z',
    updatedAt: '2026-01-30T18:00:00Z',
  },
]

export const pessoasMock: Pessoa[] = [
  { id: 'p1', nome: 'Dra. Helena', cargo: 'Chefe da SAAEI', createdAt: '2026-02-05' },
  { id: 'p2', nome: 'Marina', cargo: 'Analista', observacoes: 'Faz bolo de cenoura nas quintas. Virou amiga.', createdAt: '2026-02-10' },
  { id: 'p3', nome: 'Rodrigo', cargo: 'TI do setor', createdAt: '2026-02-12' },
]

export const entradasMock: EntradaDiario[] = [
  {
    id: 'e1',
    data: '2026-05-16',
    texto: 'Marina trouxe bolo de cenoura, dia tranquilo.',
    tipo: 'dia_normal',
    setoresIds: ['s1'],
    pessoasIds: ['p2'],
    createdAt: '2026-05-16T18:00:00Z',
  },
  {
    id: 'e2',
    data: '2026-05-14',
    texto: 'Mexi no SIGO pela primeira vez, anotei o passo a passo.',
    tipo: 'aprendizado',
    setoresIds: ['s1'],
    createdAt: '2026-05-14T17:30:00Z',
  },
  {
    id: 'e3',
    data: '2026-05-12',
    texto: 'Dra. Helena elogiou minha organização na reunião.',
    tipo: 'feedback_recebido',
    setoresIds: ['s1'],
    pessoasIds: ['p1'],
    createdAt: '2026-05-12T16:00:00Z',
  },
]
