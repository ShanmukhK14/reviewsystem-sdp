import { useNavigate, useLocation } from 'react-router-dom'

const adminItems = [
  { section: 'Overview' },
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/forms', icon: '📋', label: 'Manage Forms' },
  { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { divider: true },
  { section: 'Settings' },
  { path: '#', icon: '🏫', label: 'Courses' },
  { path: '#', icon: '👥', label: 'Students' },
  { path: '#', icon: '⚙️', label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const itemStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '0.875rem',
    color: isActive(path) ? 'var(--accent)' : 'var(--text2)',
    background: isActive(path) ? 'rgba(0,201,167,0.1)' : 'transparent',
    fontWeight: isActive(path) ? 500 : 400,
    transition: 'all 0.2s', border: 'none', width: '100%', textAlign: 'left',
    fontFamily: "'DM Sans', sans-serif",
  })

  return (
    <div style={{
      width: '220px', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', padding: '20px 12px',
      display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0,
    }}>
      {adminItems.map((item, i) => {
        if (item.section) return (
          <div key={i} style={{
            fontSize: '0.7rem', textTransform: 'uppercase',
            letterSpacing: '1px', color: 'var(--text2)',
            padding: '0 12px', margin: '8px 0 4px',
          }}>{item.section}</div>
        )
        if (item.divider) return <div key={i} style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
        return (
          <button
            key={item.path}
            style={itemStyle(item.path)}
            onClick={() => item.path !== '#' && navigate(item.path)}
            onMouseEnter={e => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'var(--surface2)'
                e.currentTarget.style.color = 'var(--text)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text2)'
              }
            }}
          >
            <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
