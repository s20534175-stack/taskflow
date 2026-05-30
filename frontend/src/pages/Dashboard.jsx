import { useState, useEffect, useCallback } from 'react'
import { getTasks } from '../api'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import TaskModal from '../components/TaskModal'

const STAGES = ['Todo', 'In Progress', 'Done']

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [defaultStage, setDefaultStage] = useState('Todo')

  const fetchTasks = useCallback(async () => {
    try {
      setError(null)
      const params = {}
      if (search) params.search = search
      if (filterPriority) params.priority = filterPriority
      const res = await getTasks(params)
      setTasks(res.data.tasks)
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      toast.error('Could not load tasks')
    } finally {
      setLoading(false)
    }
  }, [search, filterPriority])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(fetchTasks, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchTasks, search])

  const tasksByStage = STAGES.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.stage === s)
    return acc
  }, {})

  const stats = {
    todo: tasksByStage['Todo'].length,
    inProgress: tasksByStage['In Progress'].length,
    done: tasksByStage['Done'].length,
  }

  const openCreate = (stage = 'Todo') => {
    setEditingTask(null)
    setDefaultStage(stage)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSave = (savedTask) => {
    setTasks(prev => {
      const exists = prev.find(t => t._id === savedTask._id)
      if (exists) return prev.map(t => t._id === savedTask._id ? savedTask : t)
      return [savedTask, ...prev]
    })
  }

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  const handleStageChange = (updatedTask) => {
    setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t))
  }

  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((stats.done / totalTasks) * 100) : 0

  return (
    <div style={styles.page}>
      <Navbar stats={stats} />

      <div style={styles.content}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Board</h1>
            <p style={styles.pageSubtitle}>
              {totalTasks === 0 ? 'No tasks yet — add your first one!' : `${totalTasks} task${totalTasks !== 1 ? 's' : ''} · ${completionRate}% complete`}
            </p>
          </div>

          <div style={styles.controls}>
            <div style={styles.searchWrap}>
              <svg style={styles.searchIcon} width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              {search && (
                <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
              )}
            </div>

            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={styles.select}
            >
              <option value="">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button onClick={() => openCreate()} style={styles.addBtn}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              New task
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div style={styles.progressWrap}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${completionRate}%` }} />
            </div>
            <span style={styles.progressLabel}>{completionRate}% done</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={styles.errorBanner}>
            <span>⚠️ {error}</span>
            <button onClick={fetchTasks} style={styles.retryBtn}>Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div style={styles.board}>
            {STAGES.map(stage => (
              <div key={stage} style={styles.skeletonCol}>
                <div style={styles.skeletonHeader} />
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ ...styles.skeletonCard, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.board}>
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage}
                stage={stage}
                tasks={tasksByStage[stage]}
                onAdd={openCreate}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStageChange={handleStageChange}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          defaultStage={defaultStage}
          onClose={() => { setModalOpen(false); setEditingTask(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-primary)' },
  content: { padding: '28px 24px', maxWidth: 1400, margin: '0 auto' },

  pageHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 16, marginBottom: 24,
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 28, fontWeight: 800,
    color: 'var(--text-primary)', letterSpacing: '-1px',
    margin: 0,
  },
  pageSubtitle: { fontSize: 14, color: 'var(--text-muted)', marginTop: 4 },

  controls: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  searchWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 12, color: 'var(--text-muted)', pointerEvents: 'none' },
  searchInput: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '9px 36px 9px 36px',
    color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'var(--font-body)',
    outline: 'none', width: 220,
  },
  clearBtn: {
    position: 'absolute', right: 10,
    background: 'none', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
  },
  select: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '9px 14px',
    color: 'var(--text-secondary)',
    fontSize: 14, fontFamily: 'var(--font-body)',
    outline: 'none', cursor: 'pointer',
  },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: 'linear-gradient(135deg, var(--accent), #6d28d9)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '9px 18px',
    color: '#fff', fontSize: 14, fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
  },

  progressWrap: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
  },
  progressBar: {
    flex: 1, height: 4,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 999, overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--teal))',
    borderRadius: 999,
    transition: 'width 0.6s ease',
  },
  progressLabel: { fontSize: 12, color: 'var(--text-muted)', minWidth: 60 },

  errorBanner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    marginBottom: 20,
    color: '#ef4444', fontSize: 14,
  },
  retryBtn: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 6,
    padding: '4px 12px',
    color: '#ef4444',
    fontSize: 12, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },

  board: {
    display: 'flex', gap: 16,
    alignItems: 'flex-start',
    overflowX: 'auto',
    paddingBottom: 20,
    minHeight: 500,
  },

  skeletonCol: {
    flex: '1 1 0', minWidth: 280, maxWidth: 400,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: 16,
  },
  skeletonHeader: {
    height: 28, background: 'rgba(255,255,255,0.06)',
    borderRadius: 8, marginBottom: 16,
    animation: 'pulse 1.5s ease infinite',
  },
  skeletonCard: {
    height: 100, background: 'rgba(255,255,255,0.04)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 10,
    animation: 'pulse 1.5s ease infinite',
  },
}
