import { useNavigate, useLocation } from 'react-router-dom'
import { Store } from '../store'

export default function Navbar({ role = 'admin' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const displayName = role === 'admin' ? Store.getAdminName() : Store.getStudentName()
  const getInitials = (name) => name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const initials = getInitials(displayName || 'U')

  const links = role === 'admin'
    ? [{ path: '/admin/dashboard', label: '📊 Dashboard' }, { path: '/admin/forms', label: '📋 Forms' }, { path: '/admin/analytics', label: '📈 Analytics' }]
    : [{ path: '/student/dashboard', label: '🏠 Dashboard' }, { path: '/student/results', label: '📊 My Results' }]

  const navBtnStyle = (path) => ({
    background: isActive(path) ? 'var(--surface2)' : 'transparent', border: 'none',
    color: isActive(path) ? 'var(--text)' : 'var(--text2)',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
    padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
  })

  return (
    <nav style={{
      background: 'rgba(22,27,34,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
        ReviewSystem
        <span style={{ color: 'var(--text2)', fontWeight: 400, fontSize: '0.8rem', marginLeft: '8px' }}>
          {role === 'admin' ? 'Admin' : 'Student'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {links.map(link => (
          <button key={link.path} style={navBtnStyle(link.path)} onClick={() => navigate(link.path)}>{link.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{displayName}</span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: role === 'admin' ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'linear-gradient(135deg, var(--accent2), var(--accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700, color: '#000',
        }}>{initials}</div>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/login')}>Logout</button>
      </div>
    </nav>
  )
}
