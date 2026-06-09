import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Setores } from '@/pages/Setores'
import { Pessoas } from '@/pages/Pessoas'
import { Diario } from '@/pages/Diario'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/pessoas" element={<Pessoas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App