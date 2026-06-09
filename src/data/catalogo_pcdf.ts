/**
 * Catálogo de unidades organizacionais da PCDF.
 * Extraído da Lista Telefônica oficial (abril/2026).
 *
 * Usado pelo formulário de Setor pra sugerir siglas e nomes durante o cadastro,
 * mas o usuário pode adicionar qualquer unidade nova que não esteja aqui.
 */

export type TipoUnidade =
  | 'delegacia_geral'
  | 'corregedoria'
  | 'departamento'
  | 'divisao'
  | 'coordenacao'
  | 'delegacia'
  | 'instituto'
  | 'secao'
  | 'servico'
  | 'nucleo'
  | 'gabinete'
  | 'assessoria'
  | 'comissao'
  | 'escola'
  | 'posto'
  | 'policlinica'
  | 'laboratorio'
  | 'outro'

export interface UnidadeCatalogo {
  sigla: string
  nome: string
  tipo: TipoUnidade
  filhos?: UnidadeCatalogo[]
}

export const CATALOGO_PCDF: UnidadeCatalogo[] = [
  {
    sigla: 'DGPC',
    nome: 'Delegacia-Geral de Polícia Civil',
    tipo: 'delegacia_geral',
    filhos: [
      { sigla: 'GABDG', nome: 'Gabinete do Delegado Geral', tipo: 'gabinete' },
      { sigla: 'ASSESP/DGPC', nome: 'Assessoria Especial da Delegacia-Geral', tipo: 'assessoria' },
      { sigla: 'ASS/INST', nome: 'Assessoria Institucional', tipo: 'assessoria' },
      { sigla: 'ASCOM', nome: 'Assessoria de Comunicação', tipo: 'assessoria' },
      { sigla: 'CPD', nome: 'Comissão Permanente de Disciplina', tipo: 'comissao' },
      { sigla: 'DGDOC', nome: 'Divisão de Gestão de Documentos e Apoio Administrativo', tipo: 'divisao' },
      { sigla: 'DPSI', nome: 'Divisão de Proteção e Segurança Institucional', tipo: 'divisao' },
    ],
  },
  {
    sigla: 'CGP',
    nome: 'Corregedoria-Geral de Polícia Civil',
    tipo: 'corregedoria',
    filhos: [
      { sigla: 'DIPAD', nome: 'Divisão de Procedimentos Administrativos Disciplinares', tipo: 'divisao' },
      { sigla: 'DC', nome: 'Divisão de Correição', tipo: 'divisao' },
      { sigla: 'DM', nome: 'Divisão de Monitoramento', tipo: 'divisao' },
      { sigla: 'DIP', nome: 'Divisão de Investigação Policial', tipo: 'divisao' },
    ],
  },
  {
    sigla: 'DGI',
    nome: 'Departamento de Inteligência, Tecnologia e Gestão da Informação',
    tipo: 'departamento',
    filhos: [
      { sigla: 'CI', nome: 'Coordenação de Inteligência', tipo: 'coordenacao' },
      { sigla: 'DE', nome: 'Delegacia Eletrônica', tipo: 'delegacia' },
      { sigla: 'DATE', nome: 'Divisão de Análise Técnica e Estatística', tipo: 'divisao' },
      { sigla: 'DITEC', nome: 'Divisão de Tecnologia', tipo: 'divisao' },
      { sigla: 'DITEL', nome: 'Divisão de Telecomunicações', tipo: 'divisao' },
      { sigla: 'LABLD', nome: 'Laboratório de Tecnologia contra Lavagem de Dinheiro', tipo: 'laboratorio' },
    ],
  },
  {
    sigla: 'DAG',
    nome: 'Departamento de Administração Geral',
    tipo: 'departamento',
    filhos: [
      { sigla: 'DOF', nome: 'Divisão de Orçamento e Finanças', tipo: 'divisao' },
      { sigla: 'SECON', nome: 'Serviço de Contratos, Convênios e Gestão de Atas de Registro de Preços', tipo: 'servico' },
      { sigla: 'SICOD', nome: 'Serviço de Instrução e Contratação Direta', tipo: 'servico' },
      { sigla: 'DIRAT', nome: 'Divisão de Recuperação de Ativos', tipo: 'divisao' },
      { sigla: 'SEAAB', nome: 'Serviço de Alienação de Ativos e Bens', tipo: 'servico' },
      { sigla: 'SELAB', nome: 'Serviço de Logística e Administração de Bens', tipo: 'servico' },
      { sigla: 'DITRAN', nome: 'Divisão de Transportes', tipo: 'divisao' },
      { sigla: 'DRM', nome: 'Divisão de Recursos Materiais', tipo: 'divisao' },
      { sigla: 'DASG', nome: 'Divisão de Apoio e Serviços Gerais', tipo: 'divisao' },
      { sigla: 'DAE', nome: 'Divisão de Arquitetura e Engenharia', tipo: 'divisao' },
      { sigla: 'CPL', nome: 'Comissão Permanente de Licitação', tipo: 'comissao' },
      { sigla: 'DIPROJ', nome: 'Divisão de Projetos', tipo: 'divisao' },
    ],
  },
  {
    sigla: 'DGP',
    nome: 'Departamento de Gestão de Pessoas',
    tipo: 'departamento',
    filhos: [
      { sigla: 'DPDE', nome: 'Divisão de Planejamento, Desenvolvimento e Estatística', tipo: 'divisao' },
      { sigla: 'DICAD', nome: 'Divisão de Cadastro', tipo: 'divisao' },
      { sigla: 'DIPAG', nome: 'Divisão de Pagamento', tipo: 'divisao' },
      { sigla: 'DIAP', nome: 'Divisão de Aposentadorias e Pensões', tipo: 'divisao' },
      { sigla: 'POLI', nome: 'Policlínica', tipo: 'policlinica' },
    ],
  },
  {
    sigla: 'DPC',
    nome: 'Departamento de Polícia Circunscricional',
    tipo: 'departamento',
    filhos: [
      { sigla: '01ª DP', nome: '1ª Delegacia de Polícia — Asa Sul', tipo: 'delegacia' },
      { sigla: '02ª DP', nome: '2ª Delegacia de Polícia — Asa Norte', tipo: 'delegacia' },
      { sigla: '03ª DP', nome: '3ª Delegacia de Polícia — Cruzeiro Velho', tipo: 'delegacia' },
      { sigla: '04ª DP', nome: '4ª Delegacia de Polícia — Guará II', tipo: 'delegacia' },
      { sigla: '05ª DP', nome: '5ª Delegacia de Polícia — Setor de Grandes Áreas Norte', tipo: 'delegacia' },
      { sigla: '06ª DP', nome: '6ª Delegacia de Polícia — Paranoá', tipo: 'delegacia' },
      { sigla: '08ª DP', nome: '8ª Delegacia de Polícia — Setor Complementar de Indústria e Abastecimento', tipo: 'delegacia' },
      { sigla: '09ª DP', nome: '9ª Delegacia de Polícia — Lago Norte', tipo: 'delegacia' },
      { sigla: '10ª DP', nome: '10ª Delegacia de Polícia — Lago Sul', tipo: 'delegacia' },
      { sigla: '11ª DP', nome: '11ª Delegacia de Polícia — Núcleo Bandeirante', tipo: 'delegacia' },
      { sigla: '12ª DP', nome: '12ª Delegacia de Polícia — Taguatinga Norte', tipo: 'delegacia' },
      { sigla: '13ª DP', nome: '13ª Delegacia de Polícia — Sobradinho', tipo: 'delegacia' },
      { sigla: '14ª DP', nome: '14ª Delegacia de Polícia — Gama', tipo: 'delegacia' },
      { sigla: '15ª DP', nome: '15ª Delegacia de Polícia — Ceilândia Centro', tipo: 'delegacia' },
      { sigla: '16ª DP', nome: '16ª Delegacia de Polícia — Planaltina', tipo: 'delegacia' },
      { sigla: '17ª DP', nome: '17ª Delegacia de Polícia — Taguatinga Norte', tipo: 'delegacia' },
      { sigla: '18ª DP', nome: '18ª Delegacia de Polícia — Brazlândia', tipo: 'delegacia' },
      { sigla: '19ª DP', nome: '19ª Delegacia de Polícia — Setor P Norte - Ceilândia', tipo: 'delegacia' },
      { sigla: '20ª DP', nome: '20ª Delegacia de Polícia — Gama', tipo: 'delegacia' },
      { sigla: '21ª DP', nome: '21ª Delegacia de Polícia — Taguatinga Sul', tipo: 'delegacia' },
      { sigla: '23ª DP', nome: '23ª Delegacia de Polícia — Setor P Sul - Ceilândia', tipo: 'delegacia' },
      { sigla: '24ª DP', nome: '24ª Delegacia de Polícia — Setor O - Ceilândia', tipo: 'delegacia' },
      { sigla: '26ª DP', nome: '26ª Delegacia de Polícia — Samambaia Norte', tipo: 'delegacia' },
      { sigla: '27ª DP', nome: '27ª Delegacia de Polícia — Recanto das Emas', tipo: 'delegacia' },
      { sigla: '29ª DP', nome: '29ª Delegacia de Polícia — Riacho Fundo', tipo: 'delegacia' },
      { sigla: '30ª DP', nome: '30ª Delegacia de Polícia — São Sebastião', tipo: 'delegacia' },
      { sigla: '31ª DP', nome: '31ª Delegacia de Polícia — Planaltina', tipo: 'delegacia' },
      { sigla: '32ª DP', nome: '32ª Delegacia de Polícia — Samambaia Sul', tipo: 'delegacia' },
      { sigla: '33ª DP', nome: '33ª Delegacia de Polícia — Santa Maria', tipo: 'delegacia' },
      { sigla: '35ª DP', nome: '35ª Delegacia de Polícia — Sobradinho II', tipo: 'delegacia' },
      { sigla: '38ª DP', nome: '38ª Delegacia de Polícia — Vicente Pires', tipo: 'delegacia' },
    ],
  },
  {
    sigla: 'DEPATE',
    nome: 'Departamento de Atividades Especiais',
    tipo: 'departamento',
    filhos: [
      { sigla: 'DALOP', nome: 'Divisão de Apoio Logístico Operacional', tipo: 'divisao' },
      { sigla: 'DOE', nome: 'Divisão de Operações Especiais', tipo: 'divisao' },
      { sigla: 'DOA', nome: 'Divisão de Operações Aéreas', tipo: 'divisao' },
      { sigla: 'DAME', nome: 'Divisão de Controle de Armas, Munições e Explosivos', tipo: 'divisao' },
      { sigla: 'DCPI', nome: 'Divisão de Capturas e Polícia Interestadual', tipo: 'divisao' },
      { sigla: 'DCCP', nome: 'Divisão de Controle e Custódia de Presos', tipo: 'divisao' },
    ],
  },
  {
    sigla: 'DPE',
    nome: 'Departamento de Polícia Especializada',
    tipo: 'departamento',
    filhos: [
      { sigla: 'CORD', nome: 'Coordenação de Repressão às Drogas', tipo: 'coordenacao' },
      { sigla: 'CHPP', nome: 'Coordenação de Repressão a Homicídio e de Proteção à Pessoa', tipo: 'coordenacao' },
      { sigla: 'CORF', nome: 'Coordenação de Repressão aos Crimes contra o Consumidor, a Propriedade Imaterial e a Fraudes', tipo: 'coordenacao' },
      { sigla: 'CORPATRI', nome: 'Coordenação de Repressão aos Crimes Patrimoniais', tipo: 'coordenacao' },
      { sigla: 'DCA I', nome: 'Delegacia da Criança e do Adolescente I', tipo: 'delegacia' },
      { sigla: 'DCA II', nome: 'Delegacia da Criança e do Adolescente II', tipo: 'delegacia' },
      { sigla: 'DEAM I', nome: 'Delegacia Especial de Atendimento à Mulher I', tipo: 'delegacia' },
      { sigla: 'DEAM II', nome: 'Delegacia Especial de Atendimento à Mulher II', tipo: 'delegacia' },
      { sigla: 'CEPEMA', nome: 'Coordenação Especial de Proteção ao Meio Ambiente, à Ordem Urbanística e ao Animal', tipo: 'coordenacao' },
      { sigla: 'DEMA', nome: 'Delegacia de Combate à Ocupação Irregular do Solo e aos Crimes contra a Ordem Urbanística e o Meio Ambiente', tipo: 'delegacia' },
      { sigla: 'DRCA', nome: 'Delegacia de Repressão aos Crimes contra os Animais', tipo: 'delegacia' },
      { sigla: 'DPCA', nome: 'Delegacia Especial de Proteção à Criança e ao Adolescente', tipo: 'delegacia' },
      { sigla: 'DECRIN', nome: 'Delegacia Especial de Repressão aos Crimes por Discriminação Racial, Religiosa, ou por Orientação Sexual, ou contra a Pessoa Idosa ou com Deficiência', tipo: 'delegacia' },
    ],
  },
  {
    sigla: 'DPT',
    nome: 'Departamento de Polícia Técnica',
    tipo: 'departamento',
    filhos: [
      { sigla: 'IML', nome: 'Instituto de Medicina Legal', tipo: 'instituto' },
      { sigla: 'IML II', nome: 'Instituto de Medicina Legal II', tipo: 'instituto' },
      { sigla: 'IC', nome: 'Instituto de Criminalística', tipo: 'instituto' },
      { sigla: 'II', nome: 'Instituto de Identificação', tipo: 'instituto' },
      { sigla: 'IPDNA', nome: 'Instituto de Pesquisa de DNA Forense', tipo: 'instituto' },
    ],
  },
  {
    sigla: 'DECOR',
    nome: 'Departamento de Combate à Corrupção e ao Crime Organizado',
    tipo: 'departamento',
    filhos: [
      { sigla: 'DOT', nome: 'Delegacia de Repressão aos Crimes contra a Ordem Tributária', tipo: 'delegacia' },
      { sigla: 'DRACO', nome: 'Delegacia de Repressão ao Crime Organizado', tipo: 'delegacia' },
      { sigla: 'DRCC', nome: 'Delegacia Especial de Repressão aos Crimes Cibernéticos', tipo: 'delegacia' },
      { sigla: 'DRCOR', nome: 'Delegacia de Repressão à Corrupção', tipo: 'delegacia' },
    ],
  },
  {
    sigla: 'ESPC',
    nome: 'Escola Superior de Polícia Civil',
    tipo: 'escola',
    filhos: [
      { sigla: 'DTE', nome: 'Divisão Técnica de Ensino', tipo: 'divisao' },
      { sigla: 'DAE', nome: 'Divisão de Apoio ao Ensino', tipo: 'divisao' },
      { sigla: 'DGC', nome: 'Divisão de Gestão de Concursos', tipo: 'divisao' },
    ],
  },
  {
    sigla: 'PPAERO',
    nome: 'Posto Policial do Aeroporto',
    tipo: 'posto',
    filhos: [],
  },
]

/**
 * Rótulos amigáveis pros tipos de unidade (pra mostrar em dropdowns).
 */
export const ROTULOS_TIPO: Record<TipoUnidade, string> = {
  delegacia_geral: 'Delegacia-Geral',
  corregedoria: 'Corregedoria',
  departamento: 'Departamento',
  divisao: 'Divisão',
  coordenacao: 'Coordenação',
  delegacia: 'Delegacia',
  instituto: 'Instituto',
  secao: 'Seção',
  servico: 'Serviço',
  nucleo: 'Núcleo',
  gabinete: 'Gabinete',
  assessoria: 'Assessoria',
  comissao: 'Comissão',
  escola: 'Escola',
  posto: 'Posto',
  policlinica: 'Policlínica',
  laboratorio: 'Laboratório',
  outro: 'Outro',
}

/**
 * Lista completa de tipos possíveis (pra dropdowns).
 */
export const TIPOS_UNIDADE: TipoUnidade[] = Object.keys(ROTULOS_TIPO) as TipoUnidade[]

/**
 * Busca uma unidade top-level por sigla.
 */
export function buscarTopo(sigla: string): UnidadeCatalogo | undefined {
  return CATALOGO_PCDF.find((u) => u.sigla.toLowerCase() === sigla.toLowerCase())
}

/**
 * Lista os filhos de uma unidade top-level.
 */
export function filhosDe(siglaTopo: string): UnidadeCatalogo[] {
  return buscarTopo(siglaTopo)?.filhos ?? []
}

/**
 * Retorna TODAS as siglas do catálogo (top-level + filhos) numa lista plana.
 * Útil pra alimentar campos de Autocomplete em "outro local".
 *
 * Cada item mantém o tipo original (departamento, divisão, delegacia, etc).
 */
export function listarTodasSiglas(): UnidadeCatalogo[] {
  const lista: UnidadeCatalogo[] = []
  for (const top of CATALOGO_PCDF) {
    lista.push(top)
    if (top.filhos) {
      lista.push(...top.filhos)
    }
  }
  return lista
}