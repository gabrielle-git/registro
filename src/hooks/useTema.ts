import { useEffect, useState } from 'react'

type Tema = 'claro' | 'escuro' | 'auto'

export function useTema() {
  const [tema, setTemaState] = useState<Tema>(() => {
    const salvo = localStorage.getItem('tema') as Tema | null
    return salvo ?? 'auto'
  })

  useEffect(() => {
    const html = document.documentElement
    const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
    const deveSerEscuro = tema === 'escuro' || (tema === 'auto' && sistemaEscuro)

    if (deveSerEscuro) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    localStorage.setItem('tema', tema)
  }, [tema])

  // Se o tema é 'auto', escuta mudanças na preferência do sistema
  useEffect(() => {
    if (tema !== 'auto') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [tema])

  return { tema, setTema: setTemaState }
}