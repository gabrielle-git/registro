# Registro

Diário de trabalho pessoal para registrar coberturas e rotações institucionais. Substitui o caderninho físico por um app web com modelo de dados próprio.

Construído para um caso de uso específico: acompanhar a passagem por diferentes setores de uma instituição, registrando pessoas encontradas, aprendizados e o que aconteceu em cada dia.

**[Ver ao vivo](https://registro-virid.vercel.app)** · **[Explorar demo](https://registro-virid.vercel.app)** (sem criar conta)

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4** (plugin Vite, sem `tailwind.config.js`)
- **React Router 7**
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **Vercel** (deploy + analytics)
- **date-fns** com locale ptBR · **Lucide React**

## Por que existir

Ferramentas genéricas (Notion, Obsidian) exigem adaptação constante para um modelo mental específico. Esse projeto modela diretamente os conceitos que importam:

- **Setor** com hierarquia de 3 níveis variáveis (Departamento › Divisão/Coordenação › Seção/Serviço)
- **Pessoa** com vínculos flexíveis — pode estar ligada a um setor cadastrado *ou* a qualquer local em texto livre (outro órgão, faculdade, evento)
- **Entrada de diário** com tipo categorizado (dia normal, feedback, aprendizado, observação, marco) e referências cruzadas a setores e pessoas
- **Avaliação** de setor com nota e justificativa que evolui ao longo do tempo

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Requer Node 20+. Crie um arquivo `.env.local` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Estrutura

```
src/
├── components/         # UI por domínio (setor, pessoa, entrada, avaliação, ui, dashboard, layout)
├── contexts/           # AuthContext (Supabase Auth)
├── data/               # Catálogo organizacional e mocks de seed
├── hooks/              # CRUD com Supabase (async, reativo)
├── lib/                # Cliente Supabase
├── pages/              # Rotas: Dashboard, Setores, Pessoas, Diário, Busca, Login, Fichas
└── types/              # Modelo de domínio: Setor, Pessoa, Vínculo, Entrada, Avaliação
```

## Decisões arquiteturais

- **Supabase + RLS**: cada usuária só vê seus próprios dados — sem API intermediária. A chave anon pública é intencionalmente exposta; a proteção real está nas policies no banco.
- **Hierarquia de 3 níveis no Setor**: a mesma sigla pode existir em departamentos diferentes. Sem hierarquia, não dá pra desambiguar.
- **Vínculo flexível Pessoa–Local**: uma pessoa pode estar ligada a um setor cadastrado *ou* a qualquer local em texto livre.
- **Estado controlado nativo nos formulários**: em vez de React Hook Form, dado o acoplamento entre níveis hierárquicos (nível 2 depende do nível 1, reset em cascata).
- **Migração de schema**: versão salva localmente, conversões automáticas no boot.

## Autora

Helena Gabrielle da Cunha Campêlo — [[github.com/gabrielle-git](https://github.com/gabrielle-git)](https://github.com/gabrielle-git)