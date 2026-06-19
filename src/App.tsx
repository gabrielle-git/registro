import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Setores } from '@/pages/Setores'
import { Pessoas } from '@/pages/Pessoas'
import { Diario } from '@/pages/Diario'
import { Busca } from '@/pages/Busca'
import { Login } from '@/pages/Login'
import { FichaSetor } from '@/pages/FichaSetor'
import { FichaPessoa } from '@/pages/FichaPessoa'

function AppContent() {
  const { user, carregando } = useAuth()

  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-tertiary)', fontSize: '14px',
      }}>
        Carregando...
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/setores" element={<Setores />} />
        <Route path="/setores/:id" element={<FichaSetor />} />
        <Route path="/pessoas" element={<Pessoas />} />
        <Route path="/pessoas/:id" element={<FichaPessoa />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/busca" element={<Busca />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Analytics />
      </AuthProvider>
    </BrowserRouter>
  )
}