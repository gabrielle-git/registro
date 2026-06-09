# Registro

Diário de trabalho pessoal — substitui o caderninho físico por um app web com modelo de dados próprio pra registrar passagens por setores, pessoas encontradas, e o que aconteceu em cada dia.

Construído pra um caso de uso específico (cobertura de férias na Polícia Civil do Distrito Federal), com hierarquia organizacional de 3 níveis e cruzamento entre setores, pessoas e entradas de diário.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4** (plugin Vite, sem `tailwind.config.js`)
- **React Router 7**
- **localStorage** com camada de abstração (próxima fase: Supabase)
- **date-fns** com locale ptBR
- **Lucide React** pra ícones

## Por que existir

Ferramentas genéricas (Notion, Obsidian) exigem adaptação constante pra um modelo mental específico. Esse projeto modela diretamente os conceitos que importam:

- **Setor** com hierarquia de 3 níveis (Departamento › Divisão/Coordenação › Seção/Serviço)
- **Pessoa** com vínculos flexíveis — pode ser ligada a um setor cadastrado *ou* a um local em texto livre (outro órgão, faculdade, evento)
- **Entrada de diário** com tipo categorizado (dia normal, feedback, aprendizado, observação, marco) e referências cruzadas a setores/pessoas
- **Avaliação** de setor com nota e justificativa que evolui ao longo do tempo

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção
npm run preview  # preview do build
```

Requisitos: Node 20+.

## Estrutura

```
src/
├── components/         # UI por domínio (setor, pessoa, entrada, ui, dashboard, layout)
├── data/               # Catálogo PCDF e mocks de seed
├── hooks/              # Acesso ao storage com reatividade
├── lib/                # storage (CRUD abstrato), seed, migracao
├── pages/              # Rotas principais
└── types/              # Modelo de domínio
```

## Decisões arquiteturais

- **localStorage primeiro, Supabase depois** — testar e ajustar o fluxo antes de comprometer com schema de banco. A camada `lib/storage.ts` abstrai o backend pra que a migração seja uma refatoração pequena.
- **Hierarquia de 3 níveis no Setor** — a mesma sigla (ex: SAAEI) pode existir em departamentos diferentes; sem hierarquia não dá pra desambiguar.
- **Vínculo flexível Pessoa–Local** — uma pessoa pode estar ligada a um setor que você passou *ou* a qualquer outro local em texto livre, com autocomplete sugerindo siglas do catálogo organizacional.
- **Estado controlado nativo nos formulários** — em vez de React Hook Form, dado o acoplamento entre níveis hierárquicos (nível 2 depende de nível 1, reset em cascata).
- **Sistema de migração de schema** — versão salva no localStorage, conversões automáticas no boot evitam perda de dados em mudanças de modelo.

## Roadmap

Curto prazo:
- [x] Formulário de Setor com hierarquia
- [x] Formulário de Pessoa com vínculo flexível
- [x] Formulário de Entrada de Diário
- [ ] Formulário de Avaliação de Setor
- [ ] Telas de listagem (`/setores`, `/pessoas`, `/diario`)
- [ ] Fichas detalhadas com cruzamento entre entidades
- [ ] Busca global

Médio prazo:
- [ ] Edição e exclusão
- [ ] Exportação Markdown / PDF

Longo prazo:
- [ ] Migração pro Supabase
- [ ] Autenticação
- [ ] Backup automatizado via GitHub Actions

## Autora

Helena Gabrielle da Cunha Campêlo
[github.com/gabrielle-git](https://github.com/gabrielle-git)