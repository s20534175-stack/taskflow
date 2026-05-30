import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar({ stats }) {
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={styles.logoText}>TaskFlow</span>
        </div>

        <div style={styles.statsRow}>
          {[
            { label: 'Todo', count: stats.todo, color: '#64748b' },
            { label: 'In Progress', count: stats.inProgress, color: '#f59e0b' },
            { label: 'Done', count: stats.done, color: '#10b981' },
          ].map(({ label, count, color }) => (
            <div key={label} style={styles.statChip}>
              <span style={{ ...styles.statDot, background: color }} />
              <span style={styles.statCount}>{count}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfile(p => !p)}
            style={styles.avatarBtn}
            aria-label="Profile menu"
          >
            <div style={styles.avatar}>{initials}</div>
            <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>▾</span>
          </button>

          {showProfile && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={{ ...styles.avatar, width: 40, height: 40, fontSize: 15 }}>{initials}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{user?.email}</p>
                </div>
              </div>
              <div style={styles.dropdownDivider} />
              <div style={{ padding: '8px', marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {[
                    { label: 'Todo', count: stats.todo, color: '#64748b' },
                    { label: 'Progress', count: stats.inProgress, color: '#f59e0b' },
                    { label: 'Done', count: stats.done, color: '#10b981' },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{count}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.dropdownDivider} />
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px',
    height: 64,
    background: 'rgba(13,13,26,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
  },
  left: { display: 'flex', alignItems: 'center', gap: 28 },
  logo: { display: 'flex', alignItems: 'center', gap: 9 },
  logoIcon: {
    width: 32, height: 32,
    background: 'linear-gradient(135deg, var(--accent), var(--teal))',
    borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, color: '#fff',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 18, fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  statsRow: { display: 'flex', alignItems: 'center', gap: 6 },
  statChip: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '4px 12px',
  },
  statDot: { width: 6, height: 6, borderRadius: '50%' },
  statCount: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' },
  statLabel: { fontSize: 12, color: 'var(--text-muted)' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarBtn: {
    display: 'flex', alignItems: 'center', gap: 9,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '6px 12px 6px 6px',
    cursor: 'pointer',
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--teal))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff',
    fontFamily: 'var(--font-display)',
  },
  userName: { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    minWidth: 240,
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px',
  },
  dropdownDivider: { height: 1, background: 'var(--border)', margin: '0' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '12px 16px',
    background: 'none', border: 'none',
    color: '#ef4444', fontSize: 13,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    transition: 'background 0.15s',
  },
}
