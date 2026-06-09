import { useState, useRef, useEffect } from 'react'

export interface OpcaoAutocomplete {
  valor: string
  rotulo: string
  descricao?: string // texto secundário (ex: nome completo da sigla)
}

interface AutocompleteProps {
  valor: string
  aoMudar: (valor: string, opcaoSelecionada?: OpcaoAutocomplete) => void
  opcoes: OpcaoAutocomplete[]
  placeholder?: string
  disabled?: boolean
}

export function Autocomplete({
  valor,
  aoMudar,
  opcoes,
  placeholder,
  disabled,
}: AutocompleteProps) {
  const [aberto, setAberto] = useState(false)
  const [indiceDestacado, setIndiceDestacado] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtra opções com base no que tá digitado
  const termo = valor.trim().toLowerCase()
  const opcoesFiltradas = termo
    ? opcoes.filter(
        (o) =>
          o.valor.toLowerCase().includes(termo) ||
          o.rotulo.toLowerCase().includes(termo) ||
          o.descricao?.toLowerCase().includes(termo)
      )
    : opcoes

  // Fecha quando clica fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selecionar = (opcao: OpcaoAutocomplete) => {
    aoMudar(opcao.valor, opcao)
    setAberto(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!aberto) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndiceDestacado((i) => Math.min(i + 1, opcoesFiltradas.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceDestacado((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && opcoesFiltradas[indiceDestacado]) {
      e.preventDefault()
      selecionar(opcoesFiltradas[indiceDestacado])
    } else if (e.key === 'Escape') {
      setAberto(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    outline: 'none',
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={valor}
        onChange={(e) => {
          aoMudar(e.target.value)
          setAberto(true)
          setIndiceDestacado(0)
        }}
        onFocus={() => setAberto(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        autoComplete="off"
      />

      {aberto && opcoesFiltradas.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            maxHeight: '240px',
            overflowY: 'auto',
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {opcoesFiltradas.map((opcao, idx) => (
            <button
              key={opcao.valor + idx}
              type="button"
              onClick={() => selecionar(opcao)}
              onMouseEnter={() => setIndiceDestacado(idx)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                fontSize: '13px',
                backgroundColor:
                  idx === indiceDestacado
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
              }}
            >
              <div style={{ fontWeight: 500 }}>{opcao.rotulo}</div>
              {opcao.descricao && (
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary)',
                    marginTop: '2px',
                  }}
                >
                  {opcao.descricao}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
