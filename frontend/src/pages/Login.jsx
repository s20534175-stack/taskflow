import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('All fields are required')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bg}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.grid} />
      </div>

      <div style={styles.card} className="animate-fade">
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={styles.logoText}>TaskFlow</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to continue managing your tasks</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ ...styles.input, paddingRight: 44 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={styles.eyeBtn}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? <span style={styles.spinner} /> : null}
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'fixed', inset: 0, zIndex: 0,
    background: 'var(--bg-primary)',
  },
  orb1: {
    position: 'absolute', top: '10%', left: '15%',
    width: 500, height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
    filter: 'blur(40px)',
  },
  orb2: {
    position: 'absolute', bottom: '10%', right: '10%',
    width: 400, height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
    filter: 'blur(40px)',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: 'rgba(22,22,58,0.8)',
    backdropFilter: 'blur(24px)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32,
  },
  logoIcon: {
    width: 36, height: 36,
    background: 'linear-gradient(135deg, var(--accent), var(--teal))',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, color: '#fff',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 20, fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 28, fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    marginBottom: 8,
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: 14, marginBottom: 32,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontSize: 13, fontWeight: 500,
    color: 'var(--text-secondary)',
    letterSpacing: '0.3px',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
    padding: 4,
  },
  btn: {
    background: 'linear-gradient(135deg, var(--accent), #6d28d9)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '14px 24px',
    color: '#fff',
    fontSize: 15, fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: 4,
    boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  switchText: {
    textAlign: 'center', fontSize: 14,
    color: 'var(--text-muted)', marginTop: 24,
  },
  link: {
    color: 'var(--accent-light)',
    textDecoration: 'none', fontWeight: 500,
  },
}
