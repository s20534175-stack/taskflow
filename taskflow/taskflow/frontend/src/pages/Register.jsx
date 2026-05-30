import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('All fields are required')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to TaskFlow 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const s = (field) => ({
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    width: '100%',
  })

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', position:'relative', overflow:'hidden', background:'var(--bg-primary)' }}>
      <div style={{ position:'fixed', inset:0, zIndex:0 }}>
        <div style={{ position:'absolute', top:'20%', right:'10%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'20%', left:'5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize:'60px 60px' }} />
      </div>

      <div className="animate-fade" style={{ position:'relative', zIndex:1, background:'rgba(22,22,58,0.8)', backdropFilter:'blur(24px)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'48px 40px', width:'100%', maxWidth:440, boxShadow:'0 24px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg, var(--accent), var(--teal))', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff' }}>✦</div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.5px' }}>TaskFlow</span>
        </div>

        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.5px', marginBottom:8 }}>Create account</h1>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:32 }}>Start managing your tasks efficiently</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {[
            { key:'name', label:'Full name', type:'text', placeholder:'John Doe' },
            { key:'email', label:'Email address', type:'email', placeholder:'you@example.com' },
            { key:'password', label:'Password', type:'password', placeholder:'Min. 6 characters' },
            { key:'confirm', label:'Confirm password', type:'password', placeholder:'Repeat your password' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--text-secondary)', letterSpacing:'0.3px' }}>{label}</label>
              <input
                type={type} placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={s(key)}
              />
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            style={{ background:'linear-gradient(135deg, var(--accent), #6d28d9)', border:'none', borderRadius:'var(--radius-md)', padding:'14px 24px', color:'#fff', fontSize:15, fontWeight:600, fontFamily:'var(--font-body)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4, opacity: loading ? 0.7 : 1, boxShadow:'0 4px 20px rgba(139,92,246,0.3)' }}
          >
            {loading && <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }} />}
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)', marginTop:24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent-light)', textDecoration:'none', fontWeight:500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
