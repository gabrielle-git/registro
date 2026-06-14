import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const DEMO_EMAIL = 'demo@registro.app'
const DEMO_SENHA = 'demo123456'

export function Login() {
  const { entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aguardando, setAguardando] = useState(false)
  const [demoCarregando, setDemoCarregando] = useState(false)

  const fazerLogin = async (emailLogin: string, senhaLogin: string, isDemo = false) => {
    setErro('')
    isDemo ? setDemoCarregando(true) : setAguardando(true)
    const err = await entrar(emailLogin, senhaLogin)
    if (err) setErro(isDemo ? 'Demo indisponível no momento.' : 'Email ou senha incorretos.')
    isDemo ? setDemoCarregando(false) : setAguardando(false)
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .login-bg   { animation: fadeIn  0.6s ease forwards; }
        .login-hero { animation: fadeUp  0.5s ease 0.1s both; }
        .login-demo { animation: fadeUp  0.5s ease 0.2s both; }
        .login-form { animation: fadeUp  0.5s ease 0.3s both; }
        .demo-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .login-input:focus { border-color: var(--color-text-primary) !important; }
        .entrar-btn:hover:not(:disabled) { opacity: 0.85; }
      `}</style>

      <div className="login-bg" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        backgroundColor: 'var(--color-bg-primary)',
        background: 'radial-gradient(ellipse at 60% 0%, color-mix(in srgb, var(--color-text-primary) 6%, transparent), transparent 60%), var(--color-bg-primary)',
      }}>

        {/* Hero */}
        <div className="login-hero" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📓</div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Registro
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginTop: '6px' }}>
            Diário de trabalho · PCDF
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Botão demo — destaque principal */}
          <button
            className="login-demo demo-btn"
            type="button"
            onClick={() => fazerLogin(DEMO_EMAIL, DEMO_SENHA, true)}
            disabled={demoCarregando || aguardando}
            style={{
              width: '100%',
              padding: '18px 20px',
              borderRadius: '14px',
              border: 'none',
              cursor: demoCarregando ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: demoCarregando ? 0.8 : 1,
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>
              {demoCarregando ? '⏳ Entrando...' : '🎭 Explorar demonstração'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>
              Dados fictícios · só visualização · sem criar conta
            </div>
          </button>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              acesso pessoal
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Card de login */}
          <form
            className="login-form"
            onSubmit={(e) => { e.preventDefault(); fazerLogin(email, senha) }}
            style={{
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="seu@email.com"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  fontSize: '14px', backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-primary)', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Senha
              </label>
              <input
                className="login-input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  fontSize: '14px', backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-primary)', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {erro && (
              <div style={{
                padding: '10px 12px', borderRadius: '8px',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                color: '#dc2626', fontSize: '13px',
              }}>
                {erro}
              </div>
            )}

            <button
              className="entrar-btn"
              type="submit"
              disabled={aguardando || demoCarregando}
              style={{
                padding: '11px', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600,
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg-primary)',
                border: 'none', cursor: aguardando ? 'not-allowed' : 'pointer',
                opacity: aguardando ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {aguardando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

        </div>
      </div>
    </>
  )
}