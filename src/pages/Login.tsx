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
        .login-bg   { animation: fadeIn  0.5s ease forwards; }
        .login-hero { animation: fadeUp  0.5s ease 0.1s both; }
        .login-demo { animation: fadeUp  0.5s ease 0.2s both; }
        .login-form { animation: fadeUp  0.5s ease 0.3s both; }
        .demo-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .login-input:focus { border-color: var(--color-accent, #D97706) !important; }
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
      }}>

        <div className="login-hero" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}>
            Registro
          </h1>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            Diário de trabalho
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <button
            className="login-demo demo-btn"
            type="button"
            onClick={() => fazerLogin(DEMO_EMAIL, DEMO_SENHA, true)}
            disabled={demoCarregando || aguardando}
            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              cursor: demoCarregando ? 'not-allowed' : 'pointer',
              backgroundColor: 'var(--color-bg-secondary)',
              transition: 'transform 0.2s',
              opacity: demoCarregando ? 0.7 : 1,
              textAlign: 'left',
            }}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-accent)',
              marginBottom: '3px',
            }}>
              {demoCarregando ? 'Entrando...' : 'Explorar demonstração →'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
              Dados fictícios · somente visualização · sem conta
            </div>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '2px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            <span style={{
              fontSize: '10px',
              color: 'var(--color-text-tertiary)',
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              acesso pessoal
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          </div>

          <form
            className="login-form"
            onSubmit={(e) => { e.preventDefault(); fazerLogin(email, senha) }}
            style={{
              padding: '24px',
              borderRadius: '14px',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
              }}>
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
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
              }}>
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
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {erro && (
              <div style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                color: '#dc2626',
                fontSize: '13px',
              }}>
                {erro}
              </div>
            )}

            <button
              className="entrar-btn"
              type="submit"
              disabled={aguardando || demoCarregando}
              style={{
                padding: '11px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg-primary)',
                border: 'none',
                cursor: aguardando ? 'not-allowed' : 'pointer',
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