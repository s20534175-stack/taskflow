import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createTask, updateTask } from '../api'

const STAGES = ['Todo', 'In Progress', 'Done']
const PRIORITIES = ['Low', 'Medium', 'High']

const PRIORITY_COLORS = {
  Low: { bg: 'rgba(20,184,166,0.15)', text: 'var(--teal)', border: 'rgba(20,184,166,0.3)' },
  Medium: { bg: 'rgba(245,158,11,0.15)', text: 'var(--amber)', border: 'rgba(245,158,11,0.3)' },
  High: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
}

export default function TaskModal({ task, defaultStage, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    stage: task?.stage || defaultStage || 'Todo',
    priority: task?.priority || 'Medium',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Task title is required')
    setLoading(true)
    try {
      let saved
      if (task) {
        const res = await updateTask(task._id, form)
        saved = res.data.task
        toast.success('Task updated!')
      } else {
        const res = await createTask(form)
        saved = res.data.task
        toast.success('Task created!')
      }
      onSave(saved)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="animate-fade">
        <div style={styles.header}>
          <h2 style={styles.title}>{task ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title <span style={{ color:'var(--accent)' }}>*</span></label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              style={styles.input}
              autoFocus
              maxLength={200}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(optional)</span></label>
            <textarea
              placeholder="Add more details..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              style={{ ...styles.input, height: 100, resize:'vertical' }}
              maxLength={1000}
            />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={styles.field}>
              <label style={styles.label}>Stage</label>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {STAGES.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setForm(p => ({ ...p, stage: s }))}
                    style={{
                      ...styles.chip,
                      ...(form.stage === s ? styles.chipActive : {}),
                    }}
                  >
                    <span style={{ width:7, height:7, borderRadius:'50%', background: s === 'Todo' ? 'var(--text-muted)' : s === 'In Progress' ? 'var(--amber)' : 'var(--green)', display:'inline-block' }} />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Priority</label>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {PRIORITIES.map(p => (
                  <button
                    key={p} type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    style={{
                      ...styles.chip,
                      ...(form.priority === p ? { background: PRIORITY_COLORS[p].bg, borderColor: PRIORITY_COLORS[p].border, color: PRIORITY_COLORS[p].text } : {}),
                    }}
                  >
                    {p === 'High' ? '↑' : p === 'Low' ? '↓' : '→'} {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:12, marginTop:24 }}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }} />
                : null}
              {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    width: '100%', maxWidth: 520,
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 },
  title: { fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.3px' },
  closeBtn: { background:'rgba(255,255,255,0.06)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)', fontSize:13 },
  field: { display:'flex', flexDirection:'column', gap:8, marginBottom:20 },
  label: { fontSize:13, fontWeight:500, color:'var(--text-secondary)', letterSpacing:'0.3px' },
  input: { background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'11px 14px', color:'var(--text-primary)', fontSize:14, fontFamily:'var(--font-body)', outline:'none', width:'100%' },
  chip: { background:'transparent', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'9px 14px', color:'var(--text-secondary)', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontFamily:'var(--font-body)', transition:'all 0.15s', textAlign:'left' },
  chipActive: { background:'var(--accent-glow)', borderColor:'rgba(139,92,246,0.4)', color:'var(--accent-light)' },
  cancelBtn: { flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'12px', color:'var(--text-secondary)', fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)' },
  submitBtn: { flex:2, background:'linear-gradient(135deg, var(--accent), #6d28d9)', border:'none', borderRadius:'var(--radius-md)', padding:'12px', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(139,92,246,0.3)' },
}
