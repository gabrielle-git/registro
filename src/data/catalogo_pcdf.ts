/**
 * Catálogo de unidades organizacionais.
 * Estrutura atual: Câmara dos Deputados (abril/2026).
 * O catálogo sugere opções no formulário de Setor, mas o usuário
 * pode digitar qualquer unidade que não esteja listada.
 */

export type TipoUnidade =
  // Câmara dos Deputados
  | 'secretaria'
  | 'diretoria'
  | 'consultoria'
  | 'centro'
  | 'advocacia'
  | 'ouvidoria'
  | 'procuradoria'
  // Compartilhados
  | 'departamento'
  | 'coordenacao'
  | 'assessoria'
  | 'comissao'
  | 'corregedoria'
  | 'gabinete'
  | 'nucleo'
  | 'secao'
  | 'servico'
  | 'instituto'
  // Legado PCDF (compatibilidade com dados existentes no banco)
  | 'delegacia_geral'
  | 'delegacia'
  | 'divisao'
  | 'escola'
  | 'posto'
  | 'policlinica'
  | 'laboratorio'
  // Genérico
  | 'outro'

export interface UnidadeCatalogo {
  sigla: string
  nome: string
  tipo: TipoUnidade
  filhos?: UnidadeCatalogo[]
}

export const CATALOGO_PCDF: UnidadeCatalogo[] = [
  {
    sigla: 'MESA',
    nome: 'Mesa Diretora',
    tipo: 'outro',
    filhos: [
      { sigla: 'CORPAR',    nome: 'Corregedoria Parlamentar',                                             tipo: 'corregedoria' },
      { sigla: 'OUVPAR',    nome: 'Ouvidoria Parlamentar',                                                tipo: 'ouvidoria'    },
      { sigla: 'PROCPAR',   nome: 'Procuradoria Parlamentar',                                             tipo: 'procuradoria' },
      { sigla: 'CEDES',     nome: 'Centro de Estudos e Debates Estratégicos',                             tipo: 'centro'       },
      { sigla: 'COLID',     nome: 'Colégio de Líderes',                                                   tipo: 'outro'        },
      { sigla: 'CEDS',      nome: 'Comissão Especial de Documentos Sigilosos',                            tipo: 'comissao'     },
      { sigla: 'COM',       nome: 'Comissões',                                                             tipo: 'comissao'     },
      { sigla: 'CEDEP',     nome: 'Conselho de Ética e Decoro Parlamentar',                               tipo: 'outro'        },
      { sigla: 'SEMULHER',  nome: 'Secretaria da Mulher',                                                 tipo: 'secretaria'   },
      { sigla: 'SEPI',      nome: 'Secretaria da Primeira Infância, Infância, Adolescência e Juventude',  tipo: 'secretaria'   },
      { sigla: 'SERI',      nome: 'Secretaria de Relações Internacionais',                                tipo: 'secretaria'   },
      { sigla: 'SETRANSP',  nome: 'Secretaria de Transparência',                                          tipo: 'secretaria'   },
      { sigla: 'SEMLEG',    nome: 'Secretaria de Empreendedorismo Legislativo',                           tipo: 'secretaria'   },
      { sigla: 'SEINOLEG',  nome: 'Secretaria da Inovação Legislativa',                                   tipo: 'secretaria'   },
      { sigla: 'SEDEP',     nome: 'Secretaria de Defesa das Prerrogativas Parlamentares',                 tipo: 'secretaria'   },
      { sigla: 'SECOM',     nome: 'Secretaria de Comunicação Social',                                     tipo: 'secretaria'   },
      { sigla: 'SEPART',    nome: 'Secretaria de Participação, Interação e Mídias Digitais',              tipo: 'secretaria'   },
    ],
  },
  {
    sigla: 'DG',
    nome: 'Diretoria-Geral',
    tipo: 'diretoria',
    filhos: [
      { sigla: 'APG',       nome: 'Assessoria de Projetos e Gestão',                      tipo: 'assessoria'   },
      { sigla: 'ACD',       nome: 'Advocacia da Câmara dos Deputados',                    tipo: 'advocacia'    },
      { sigla: 'CONLEG',    nome: 'Consultoria-Geral',                                    tipo: 'consultoria'  },
      { sigla: 'DIRADM',    nome: 'Diretoria Administrativa',                             tipo: 'diretoria'    },
      { sigla: 'DGP',       nome: 'Diretoria de Gestão de Pessoas',                       tipo: 'diretoria'    },
      { sigla: 'DITI',      nome: 'Diretoria de Inovação e Tecnologia da Informação',     tipo: 'diretoria'    },
      { sigla: 'SECONINT',  nome: 'Secretaria de Controle Interno',                       tipo: 'secretaria'   },
      { sigla: 'CEDI',      nome: 'Centro de Documentação e Informação',                  tipo: 'centro'       },
      { sigla: 'DEAP',      nome: 'Departamento de Apoio Parlamentar',                    tipo: 'departamento' },
      { sigla: 'DEPOL',     nome: 'Departamento de Polícia Legislativa Federal',           tipo: 'departamento' },
      { sigla: 'DEROR',     nome: 'Departamento de Registro Oficial e Redação Parlamentar', tipo: 'departamento' },
    ],
  },
  {
    sigla: 'SGM',
    nome: 'Secretaria-Geral da Mesa',
    tipo: 'secretaria',
    filhos: [
      { sigla: 'DECOM', nome: 'Departamento de Comissões', tipo: 'departamento' },
    ],
  },
  {
    sigla: 'DIRADM',
    nome: 'Diretoria Administrativa',
    tipo: 'diretoria',
    filhos: [
      { sigla: 'DEFIN', nome: 'Departamento de Finanças, Orçamento e Contabilidade',  tipo: 'departamento' },
      { sigla: 'DELOG', nome: 'Departamento de Contratação e Logística',               tipo: 'departamento' },
      { sigla: 'DETEC', nome: 'Departamento Técnico',                                  tipo: 'departamento' },
    ],
  },
  {
    sigla: 'DGP',
    nome: 'Diretoria de Gestão de Pessoas',
    tipo: 'diretoria',
    filhos: [
      { sigla: 'CEFOR', nome: 'Centro de Formação, Treinamento e Aperfeiçoamento', tipo: 'centro'       },
      { sigla: 'DEAPE', nome: 'Departamento de Administração de Pessoal',           tipo: 'departamento' },
      { sigla: 'DEASA', nome: 'Departamento de Atenção à Saúde',                    tipo: 'departamento' },
    ],
  },
  {
    sigla: 'CONLEG',
    nome: 'Consultoria-Geral',
    tipo: 'consultoria',
    filhos: [
      { sigla: 'CONLE', nome: 'Consultoria Legislativa',                                tipo: 'consultoria' },
      { sigla: 'CONOF', nome: 'Consultoria de Orçamento e Fiscalização Financeira',     tipo: 'consultoria' },
    ],
  },
  {
    sigla: 'SECOM',
    nome: 'Secretaria de Comunicação Social',
    tipo: 'secretaria',
    filhos: [
      { sigla: 'DIRCO', nome: 'Diretoria Executiva de Comunicação e Mídias Digitais', tipo: 'diretoria' },
    ],
  },
  {
    sigla: 'DITI',
    nome: 'Diretoria de Inovação e Tecnologia da Informação',
    tipo: 'diretoria',
    filhos: [],
  },
  {
    sigla: 'ACD',
    nome: 'Advocacia da Câmara dos Deputados',
    tipo: 'advocacia',
    filhos: [],
  },
  {
    sigla: 'SECONINT',
    nome: 'Secretaria de Controle Interno',
    tipo: 'secretaria',
    filhos: [],
  },
]

export const ROTULOS_TIPO: Record<TipoUnidade, string> = {
  // Câmara
  secretaria:    'Secretaria',
  diretoria:     'Diretoria',
  consultoria:   'Consultoria',
  centro:        'Centro',
  advocacia:     'Advocacia',
  ouvidoria:     'Ouvidoria',
  procuradoria:  'Procuradoria',
  // Compartilhados
  departamento:  'Departamento',
  coordenacao:   'Coordenação',
  assessoria:    'Assessoria',
  comissao:      'Comissão',
  corregedoria:  'Corregedoria',
  gabinete:      'Gabinete',
  nucleo:        'Núcleo',
  secao:         'Seção',
  servico:       'Serviço',
  instituto:     'Instituto',
  // Legado PCDF
  delegacia_geral: 'Delegacia-Geral',
  delegacia:     'Delegacia',
  divisao:       'Divisão',
  escola:        'Escola',
  posto:         'Posto',
  policlinica:   'Policlínica',
  laboratorio:   'Laboratório',
  // Genérico
  outro:         'Outro',
}

export const TIPOS_UNIDADE: TipoUnidade[] = Object.keys(ROTULOS_TIPO) as TipoUnidade[]

export function buscarTopo(sigla: string): UnidadeCatalogo | undefined {
  return CATALOGO_PCDF.find((u) => u.sigla.toLowerCase() === sigla.toLowerCase())
}

export function filhosDe(siglaTopo: string): UnidadeCatalogo[] {
  return buscarTopo(siglaTopo)?.filhos ?? []
}

export function listarTodasSiglas(): UnidadeCatalogo[] {
  const lista: UnidadeCatalogo[] = []
  for (const top of CATALOGO_PCDF) {
    lista.push(top)
    if (top.filhos) lista.push(...top.filhos)
  }
  return lista
}