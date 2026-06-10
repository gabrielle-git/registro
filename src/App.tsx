import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Setores } from '@/pages/Setores'
import { Pessoas } from '@/pages/Pessoas'
import { Diario } from '@/pages/Diario'
import { Busca } from '@/pages/Busca'
import { FichaSetor } from '@/pages/FichaSetor'
import { FichaPessoa } from '@/pages/FichaPessoa'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}