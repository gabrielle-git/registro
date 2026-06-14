import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import ws from 'ws'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  realtime: { transport: ws }
})

async function main() {
  console.log('🔑 Entrando como demo...')
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: 'demo@registro.app', password: 'demo123456',
  })
  if (error || !session) {
    console.error('❌ Login falhou:', error?.message)
    console.log('→ Crie o usuário demo@registro.app em Authentication → Users → Add user → Auto Confirm')
    process.exit(1)
  }
  const uid = session.user.id
  console.log('✅ Logado:', session.user.email)

  console.log('\n📁 Inserindo setores...')
  const { data: setores } = await supabase.from('setores').insert([
    {
      user_id: uid,
      nivel1: { sigla: 'DPE', nome: 'Departamento de Polícia Especializada', tipo: 'departamento' },
      nivel2: { sigla: 'CHPP', nome: 'Coordenação de Repressão a Homicídio e de Proteção à Pessoa', tipo: 'coordenacao' },
      nivel3: { sigla: 'SAAEI', nome: 'Seção de Apoio Administrativo e Estatístico', tipo: 'secao' },
      ordem_cronologica: 'Primeiro mês',
      data_entrada: '2026-03-01',
      data_saida: '2026-03-31',
      contribuicoes: 'Organização de documentos e lançamento de dados no SIGO. Participei de reunião de alinhamento sobre fluxo de ocorrências.',
      consideracoes_gerais: 'Equipe muito acolhedora. Ritmo intenso mas organizado. Aprendi bastante sobre o sistema SIGO.',
      tags: ['administrativo', 'SIGO'],
    },
    {
      user_id: uid,
      nivel1: { sigla: 'DAG', nome: 'Departamento de Administração Geral', tipo: 'departamento' },
      nivel2: { sigla: 'DITEC', nome: 'Divisão de Tecnologia', tipo: 'divisao' },
      nivel3: null,
      ordem_cronologica: 'Segundo mês',
      data_entrada: '2026-04-01',
      data_saida: '2026-04-30',
      contribuicoes: 'Desenvolvi scripts de automação de relatórios. Criei dashboard de acompanhamento de chamados.',
      consideracoes_gerais: 'Ambiente técnico. Pessoal jovem e prestativo. Aprendi sobre a infraestrutura de TI da PCDF.',
      tags: ['TI', 'automação'],
    },
    {
      user_id: uid,
      nivel1: { sigla: 'DGP', nome: 'Departamento de Gestão de Pessoas', tipo: 'departamento' },
      nivel2: { sigla: 'DICAD', nome: 'Divisão de Cadastro', tipo: 'divisao' },
      nivel3: null,
      ordem_cronologica: 'Terceiro mês',
      data_entrada: '2026-05-01',
      data_saida: null,
      contribuicoes: 'Auxiliando na atualização cadastral de servidores. Atendimento para dúvidas de documentação.',
      consideracoes_gerais: 'Setor atual. Demanda alta de atendimento presencial. Equipe experiente.',
      tags: ['RH', 'cadastro'],
    },
  ]).select()
  console.log('✅', setores?.length, 'setores')

  console.log('\n👥 Inserindo pessoas...')
  const { data: pessoas } = await supabase.from('pessoas').insert([
    { user_id: uid, nome: 'Dra. Marina Rezende', cargo: 'Chefe da SAAEI', observacoes: 'Extremamente organizada e didática. Indicou os melhores cursos da ESPC.' },
    { user_id: uid, nome: 'Agente Carlos Mendonça', cargo: 'Agente de Polícia', observacoes: 'Virou amigo. Me ensinou o SIGO no primeiro dia. Ótimo senso de humor.' },
    { user_id: uid, nome: 'Papiloscopista Fábio Torres', cargo: 'Papiloscopista', observacoes: 'Conhece todos os sistemas internos. Me ajudou com a infraestrutura de rede.' },
    { user_id: uid, nome: 'Investigadora Raquel Santos', cargo: 'Investigadora de Polícia', observacoes: 'Colega do terceiro setor. Trabalha com muita dedicação.' },
  ]).select()
  console.log('✅', pessoas?.length, 'pessoas')

  if (!setores || !pessoas) { console.error('❌ Falha ao inserir dados base'); process.exit(1) }
  const [s1, s2, s3] = setores
  const [marina, carlos, fabio, raquel] = pessoas

  console.log('\n🔗 Inserindo vínculos...')
  await supabase.from('vinculos').insert([
    { user_id: uid, pessoa_id: marina.id, setor_id: s1.id, papel: 'chefe' },
    { user_id: uid, pessoa_id: carlos.id, setor_id: s1.id, papel: 'colega', observacoes: 'Me ensinou os processos do dia a dia.' },
    { user_id: uid, pessoa_id: fabio.id, setor_id: s2.id, papel: 'colega' },
    { user_id: uid, pessoa_id: raquel.id, setor_id: s3.id, papel: 'colega' },
    { user_id: uid, pessoa_id: carlos.id, local_livre: 'ESPC', papel: 'amizade', observacoes: 'Nos encontramos num curso de capacitação.' },
  ])
  console.log('✅ vínculos')

  console.log('\n📝 Inserindo entradas...')
  await supabase.from('entradas').insert([
    { user_id: uid, data: '2026-03-03', tipo: 'dia_normal', titulo: 'Primeiro dia na SAAEI', texto: 'Fui recebida pela Dra. Marina que me apresentou para a equipe. Passei a manhã lendo os procedimentos internos e à tarde tive meu primeiro contato com o SIGO. Sistema complexo mas bem documentado.', setores_ids: [s1.id], pessoas_ids: [marina.id, carlos.id] },
    { user_id: uid, data: '2026-03-15', tipo: 'aprendizado', titulo: 'Entendi o fluxo de ocorrências', texto: 'Finalmente entendi o fluxo completo: registro → triagem → distribuição → conclusão. O Carlos me explicou com paciência e desenhamos um fluxograma juntos.', setores_ids: [s1.id], pessoas_ids: [carlos.id] },
    { user_id: uid, data: '2026-04-07', tipo: 'marco', titulo: 'Primeiro script em produção', texto: 'O script de automação entrou em produção hoje. Economiza cerca de 3 horas por semana da equipe. Fábio fez o deploy e disse que estava bem estruturado. Momento de orgulho.', setores_ids: [s2.id], pessoas_ids: [fabio.id] },
    { user_id: uid, data: '2026-04-22', tipo: 'feedback_recebido', titulo: 'Feedback positivo da chefia', texto: 'Recebi feedback do chefe da DITEC. Destacou proatividade e qualidade técnica. Sugeriu especialização em automação com Python pois há demanda crescente na PCDF.', setores_ids: [s2.id], pessoas_ids: [] },
    { user_id: uid, data: '2026-05-12', tipo: 'observacao', titulo: 'Diferença de cultura entre setores', texto: 'Já quase 3 meses de rotação e a diferença de cultura entre os setores é enorme. SAAEI é muito protocolar. DITEC é horizontal e ágil. DICAD é equilíbrio.', setores_ids: [s1.id, s2.id, s3.id], pessoas_ids: [] },
  ])
  console.log('✅ entradas')

  console.log('\n⭐ Inserindo avaliações...')
  await supabase.from('avaliacoes').insert([
    { user_id: uid, setor_id: s1.id, nota: 7.5, tipo: 'inicial', data: '2026-03-05', justificativa: 'Boa recepção, processos bem definidos. Complexidade do SIGO é um desafio.' },
    { user_id: uid, setor_id: s1.id, nota: 8.5, tipo: 'final', data: '2026-03-31', justificativa: 'Saindo com muito aprendizado. Equipe excepcional.', contexto: 'O SIGO ficou mais natural e a equipe me acolheu muito bem.' },
    { user_id: uid, setor_id: s2.id, nota: 9.5, tipo: 'final', data: '2026-04-30', justificativa: 'Melhor experiência até agora. Cresci muito tecnicamente.', contexto: 'Script em produção foi divisor de águas.' },
    { user_id: uid, setor_id: s3.id, nota: 7.0, tipo: 'inicial', data: '2026-05-05', justificativa: 'Demanda alta de atendimento, diferente do que estou acostumada. Adaptando.' },
  ])
  console.log('✅ avaliações')

  console.log('\n🎉 Pronto! Conta demo populada com sucesso.')
  process.exit(0)
}

main().catch(e => { console.error('Erro:', e.message); process.exit(1) })