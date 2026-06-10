import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function BarraBusca() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const aoSubmeter = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/busca?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <form onSubmit={aoSubmeter} style={{ position: 'relative', marginBottom: '24px' }}>
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-tertiary)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar setores, pessoas, entradas..."
        style={{
          width: '100%',
          padding: '12px 14px 12px 42px',
          borderRadius: '10px',
          fontSize: '14px',
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          outline: 'none',
        }}
      />
    </form>
  )
}