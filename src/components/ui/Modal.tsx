import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  children: React.ReactNode
  larguraMax?: string
}

export function Modal({ aberto, aoFechar, titulo, children, larguraMax = '600px' }: ModalProps) {
  // Fecha com tecla ESC
  useEffect(() => {
    if (!aberto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [aberto, aoFechar])

  // Bloqueia scroll do body quando modal tá aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={aoFechar}
    >
      <div
        className="w-full rounded-xl"
        style={{
          maxWidth: larguraMax,
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h2
            className="text-lg font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {titulo}
          </h2>
          <button
            onClick={aoFechar}
            aria-label="Fechar"
            className="p-1 rounded-md transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}