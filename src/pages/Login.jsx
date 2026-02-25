import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from '../store'

export default function Login() {
  const [role, setRole] = useState('admin')
  const [showRegister, setShowRegister] = useState(false)
  const [adminName, setAdminName] = useState(Store.getAdminName())
  const [studentName, setStudentName] = useState(Store.getStudentName())
  const navigate = useNavigate()

  const handleLogin = () => {
    const name = role === 'admin' ? adminName.trim() : studentName.trim()
    if (!name) { alert('Please enter your name'); return }
    if (role === 'admin') { Store.setAdminName(adminName.trim()); navigate('/admin/dashboard') }
    else { Store.setStudentName(studentName.trim()); navigate('/student/dashboard') }
  }

  const currentName = role === 'admin' ? adminName : studentName
  const setCurrentName = role === 'admin' ? setAdminName : setStudentName

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,201,167,0.12), transparent),
                   radial-gradient(ellipse 60% 50% at 80% 80%, rgba(108,140,255,0.08), transparent), var(--bg)`,
    }} className="page-enter">
      <div style={{ width: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: "'Syne', sans-serif" }}>ReviewSystem</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '6px' }}>Student Feedback & Evaluation System</p>
        </div>

        <div className="card">
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text2)', marginBottom: '16px' }}>Sign in as</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[{ id: 'admin', icon: '🏫', label: 'Admin / Teacher' }, { id: 'student', icon: '🎓', label: 'Student' }].map(r => (
              <div key={r.id} onClick={() => setRole(r.id)} style={{
                padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                border: `2px solid ${role === r.id ? 'var(--accent)' : 'var(--border)'}`,
                background: role === r.id ? 'rgba(0,201,167,0.08)' : 'var(--surface2)', transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{r.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{r.label}</div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">{role === 'admin' ? '👤 Professor Name' : '👤 Student Name'}</label>
            <input className="form-input"
              placeholder={role === 'admin' ? 'e.g. Prof. Ravi Kumar' : 'e.g. Jaswanth K.'}
              value={currentName}
              onChange={e => setCurrentName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input key={role} className="form-input" type="email"
              defaultValue={role === 'admin' ? 'professor@university.edu' : 'student@university.edu'}
              placeholder={role === 'admin' ? 'professor@university.edu' : 'student@university.edu'} />
            <p style={{ fontSize: '0.72rem', color: role === 'admin' ? 'var(--accent)' : 'var(--accent2)', marginTop: '5px' }}>
              {role === 'admin' ? '🔑 Admin portal access' : '🎓 Student portal access'}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" defaultValue="password" placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
            Sign In as {currentName || (role === 'admin' ? 'Admin' : 'Student')} →
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text2)', fontSize: '0.8rem', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} /> or <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowRegister(true)}>Create an Account</button>
        </div>
      </div>

      {showRegister && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '500px', maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Create Account</h3>
              <button onClick={() => setShowRegister(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your full name" /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@university.edu" /></div>
            <div className="form-group"><label className="form-label">Role</label>
              <select className="form-select"><option>Student</option><option>Teacher / Admin</option></select>
            </div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setShowRegister(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowRegister(false)}>Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
