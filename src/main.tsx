import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { rodarMigracoes } from '@/lib/migracao'
import { rodarSeedSeNecessario } from '@/lib/seed'

// 1º: migra dados antigos (se houver) pro schema atual
rodarMigracoes()

// 2º: popula com dados iniciais se for a primeira execução
rodarSeedSeNecessario()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
