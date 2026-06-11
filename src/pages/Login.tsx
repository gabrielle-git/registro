import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function Login() {
  const { entrar, criarConta } = useAuth()
  const [modo, setModo] = useState<'entrar' | 'criar'>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [aguardando, setAguardando] = useState(false)

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setAguardando(true)

    if (modo === 'entrar') {
      const erro = await entrar(email, senha)
      if (erro) setErro(erro)
    } else {
      const erro = await criarConta(email, senha)
      if (erro) {
        setErro(erro)
      } else {
        setSucesso('Conta criada! Agora entre com seu email e senha.')
        setModo('entrar')
      }
    }

    setAguardando(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'var(--color-bg-tertiary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-primary)',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        padding: '32px',
        borderRadius: '16px',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          📓 Registro
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: '28px' }}>
          {modo === 'entrar' ? 'Acesse seu diário de trabalho' : 'Crie sua conta'}
        </p>

        <form onSubmit={aoSubmeter} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Senha {modo === 'criar' && '(mínimo 6 caracteres)'}</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {erro && (
            <div style={{
              padding: '10px 12px', borderRadius: '6px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#dc2626', fontSize: '13px',
            }}>
              {erro}
            </div>
          )}

          {sucesso && (
            <div style={{
              padding: '10px 12px', borderRadius: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981', fontSize: '13px',
            }}>
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            disabled={aguardando}
            style={{
              marginTop: '4px', padding: '11px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600,
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg-primary)',
              border: 'none', cursor: aguardando ? 'not-allowed' : 'pointer',
              opacity: aguardando ? 0.7 : 1,
            }}
          >
            {aguardando ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>

          <button
            type="button"
            onClick={() => { setModo(modo === 'entrar' ? 'criar' : 'entrar'); setErro(''); setSucesso('') }}
            style={{
              fontSize: '13px', color: 'var(--color-text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'center', padding: '4px',
            }}
          >
            {modo === 'entrar' ? 'Criar conta nova' : 'Já tenho conta — entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}