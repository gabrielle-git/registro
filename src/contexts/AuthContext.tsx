import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  carregando: boolean
  entrar: (email: string, senha: string) => Promise<string | null>
  criarConta: (email: string, senha: string) => Promise<string | null>
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setCarregando(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const entrar = async (email: string, senha: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    return error?.message ?? null
  }

  const criarConta = async (email: string, senha: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ email, password: senha })
    return error?.message ?? null
  }

  const sair = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, carregando, entrar, criarConta, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fora de AuthProvider')
  return ctx
}