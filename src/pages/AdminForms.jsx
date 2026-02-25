import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Store } from '../store'

export default function AdminForms() {
  const navigate = useNavigate()
  const [forms, setForms] = useState([])

  useEffect(() => { setForms(Store.getForms()) }, [])

  const deleteForm = (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this form?')) return
    const updated = Store.getForms().filter(f => f.id !== id)
    Store.saveForms(updated)
    setForms(updated)
  }

  const progressColor = (status) => status === 'Active' ? 'var(--accent)' : 'var(--accent4)'

  return (
    <div className="layout page-enter">
      <Navbar role="admin" />
      <div className="layout-with-sidebar">
        <Sidebar />
        <div className="main-content">
          <div className="page-body">
            <div className="page-header">
              <div className="page-header-left">
                <h2>Feedback Forms</h2>
                <p>{forms.length} forms total · {forms.filter(f => f.status === 'Active').length} active</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/admin/forms/create')}>＋ Create New Form</button>
            </div>

            {forms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.4 }}>📋</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text3)' }}>No forms yet</h3>
                <p style={{ marginBottom: '20px' }}>Create your first feedback form to get started</p>
                <button className="btn btn-primary" onClick={() => navigate('/admin/forms/create')}>＋ Create First Form</button>
              </div>
            ) : (
              <div className="grid-3">
                {forms.map(f => (
                  <div key={f.id} className="card card-hover" style={{ position: 'relative' }}
                    onClick={() => navigate(`/admin/analytics/${f.id}`)}>
                    {/* Delete btn */}
                    <button onClick={e => deleteForm(e, f.id)} style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
                      color: 'var(--accent3)', borderRadius: '6px', cursor: 'pointer',
                      padding: '2px 8px', fontSize: '0.75rem',
                    }}>✕</button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingRight: '40px' }}>
                      <span className={`tag tag-${f.status === 'Active' ? 'green' : 'yellow'}`}>{f.status}</span>
                      <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{f.responses}/{f.total} responses</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '14px' }}>{f.course} · {f.section}</p>
                    <div className="progress-bar" style={{ marginBottom: '14px' }}>
                      <div className="progress-fill" style={{ width: `${Math.round(f.responses / f.total * 100)}%`, background: progressColor(f.status) }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text2)' }}>
                      <span>Closes: {f.closeDate}</span>
                      <span>⭐ {f.rating} avg</span>
                    </div>
                  </div>
                ))}
                <div className="add-card" onClick={() => navigate('/admin/forms/create')}>
                  <span>＋</span><p>Create New Form</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
