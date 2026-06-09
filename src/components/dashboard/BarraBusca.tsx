import { Search } from 'lucide-react'

export function BarraBusca() {
  return (
    <div className="relative mb-6">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--color-text-tertiary)' }}
      />
      <input
        type="text"
        placeholder="Buscar setor, pessoa ou anotação..."
        className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
      />
    </div>
  )
}