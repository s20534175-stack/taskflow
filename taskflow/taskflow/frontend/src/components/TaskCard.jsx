import { useState } from 'react'
import { deleteTask, updateTaskStage } from '../api'
import toast from 'react-hot-toast'

const PRIORITY_STYLE = {
  Low: { bg: 'rgba(20,184,166,0.12)', text: '#14b8a6', border: 'rgba(20,184,166,0.25)' },
  Medium: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  High: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', border: 'rgba(239,68,68,0.25)' },
}

const STAGES = ['Todo', 'In Progress', 'Done']

export default function TaskCard({ task, onEdit, onDelete, onStageChange }) {
  const [deleting, setDeleting] = useState(false)
  const [moving, setMoving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return
    setDeleting(true)
    try {
      await deleteTask(task._id)
      toast.success('Task deleted')
      onDelete(task._id)
    } catch {
      toast.error('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  const handleStageChange = async (newStage) => {
    if (newStage === task.stage) return
    setMoving(true)
    try {
      const res = await updateTaskStage(task._id, newStage)
      onStageChange(res.data.task)
      toast.success(`Moved to ${newStage}`)
    } catch {
      toast.error('Failed to move task')
    } finally {
      setMoving(false)
      setShowMenu(false)
    }
  }

  const p = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Medium
  const date = new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <div style={{ ...styles.card, opacity: deleting ? 0.5 : 1 }} className="animate-fade">
      {moving && <div style={styles.movingOverlay}><span style={styles.spinner} /></div>}

      <div style={styles.topRow}>
        <span style={{ ...styles.priorityBadge, background: p.bg, color: p.text, border: `1px solid ${p.border}` }}>
          {task.priority === 'High' ? '↑' : task.priority === 'Low' ? '↓' : '→'} {task.priority}
        </span>

        <div style={{ display: 'flex', gap: 6, position: 'relative' }}>
          <button onClick={() => onEdit(task)} style={styles.iconBtn} title="Edit" aria-label="Edit task">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...styles.iconBtn, color: '#ef4444' }} title="Delete" aria-label="Delete task">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/></svg>
          </button>
        </div>
      </div>

      <h3 style={styles.taskTitle}>{task.title}</h3>

      {task.description && (
        <p style={styles.taskDesc}>{task.description.length > 100 ? task.description.slice(0, 100) + '…' : task.description}</p>
      )}

      <div style={styles.bottomRow}>
        <span style={styles.date}>{date}</span>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(p => !p)}
            style={styles.moveBtn}
            title="Move to stage"
          >
            Move ↕
          </button>
          {showMenu && (
            <div style={styles.stageMenu}>
              {STAGES.filter(s => s !== task.stage).map(s => (
                <button
                  key={s}
                  onClick={() => handleStageChange(s)}
                  style={styles.stageMenuItem}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: s === 'Todo' ? 'var(--text-muted)' : s === 'In Progress' ? 'var(--amber)' : 'var(--green)', display: 'inline-block' }} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    position: 'relative',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'default',
  },
  movingOverlay: {
    position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)',
    background: 'rgba(22,22,58,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
  },
  spinner: {
    width: 20, height: 20,
    border: '2px solid var(--border)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  priorityBadge: {
    fontSize: 11, fontWeight: 600, padding: '3px 9px',
    borderRadius: 20, letterSpacing: '0.4px',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    width: 28, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'background 0.15s',
  },
  taskTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 15, fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.4,
    marginBottom: 8,
    wordBreak: 'break-word',
  },
  taskDesc: {
    fontSize: 13, color: 'var(--text-muted)',
    lineHeight: 1.6, marginBottom: 14,
  },
  bottomRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border)',
    paddingTop: 12, marginTop: 4,
  },
  date: { fontSize: 12, color: 'var(--text-muted)' },
  moveBtn: {
    background: 'rgba(139,92,246,0.1)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12, color: 'var(--accent-light)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  stageMenu: {
    position: 'absolute', bottom: '100%', right: 0,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '6px',
    zIndex: 100,
    minWidth: 130,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    marginBottom: 6,
  },
  stageMenuItem: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '8px 10px',
    background: 'none', border: 'none',
    borderRadius: 6,
    color: 'var(--text-secondary)',
    fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'background 0.15s',
  },
}
