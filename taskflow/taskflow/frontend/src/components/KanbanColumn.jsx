import TaskCard from './TaskCard'

const COLUMN_CONFIG = {
  'Todo': {
    color: 'var(--text-muted)',
    glow: 'rgba(100,116,139,0.08)',
    border: 'rgba(100,116,139,0.2)',
    dot: '#64748b',
    icon: '○',
  },
  'In Progress': {
    color: 'var(--amber)',
    glow: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    dot: '#f59e0b',
    icon: '◐',
  },
  'Done': {
    color: 'var(--green)',
    glow: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    dot: '#10b981',
    icon: '●',
  },
}

export default function KanbanColumn({ stage, tasks, onAdd, onEdit, onDelete, onStageChange }) {
  const cfg = COLUMN_CONFIG[stage]
  const count = tasks.length

  return (
    <div style={{ ...styles.column, background: cfg.glow, borderColor: cfg.border }}>
      <div style={styles.colHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: cfg.dot, fontSize: 16 }}>{cfg.icon}</span>
          <h2 style={{ ...styles.colTitle, color: cfg.color }}>{stage}</h2>
          <span style={{ ...styles.badge, background: cfg.glow, color: cfg.color, border: `1px solid ${cfg.border}` }}>
            {count}
          </span>
        </div>
        <button
          onClick={() => onAdd(stage)}
          style={{ ...styles.addBtn, color: cfg.color, borderColor: cfg.border }}
          aria-label={`Add task to ${stage}`}
          title={`Add to ${stage}`}
        >
          +
        </button>
      </div>

      <div style={styles.colBody}>
        {tasks.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>
              {stage === 'Todo' ? '📝' : stage === 'In Progress' ? '⚡' : '✅'}
            </div>
            <p style={styles.emptyText}>No tasks here</p>
            <button onClick={() => onAdd(stage)} style={{ ...styles.emptyAddBtn, color: cfg.color }}>
              + Add task
            </button>
          </div>
        ) : (
          <div style={styles.taskList}>
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStageChange={onStageChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  column: {
    flex: '1 1 0',
    minWidth: 280,
    maxWidth: 400,
    border: '1px solid',
    borderRadius: 'var(--radius-xl)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  colHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 18px 14px',
    borderBottom: '1px solid var(--border)',
  },
  colTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 15, fontWeight: 700,
    letterSpacing: '0.3px',
  },
  badge: {
    fontSize: 11, fontWeight: 700,
    padding: '2px 8px', borderRadius: 20,
    minWidth: 24, textAlign: 'center',
  },
  addBtn: {
    width: 30, height: 30,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: 8,
    fontSize: 18, lineHeight: 1,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
  },
  colBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    minHeight: 200,
    maxHeight: 'calc(100vh - 280px)',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: 13, marginBottom: 12,
  },
  emptyAddBtn: {
    background: 'none', border: 'none',
    fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    opacity: 0.7,
  },
  taskList: {
    display: 'flex', flexDirection: 'column', gap: 10,
  },
}
