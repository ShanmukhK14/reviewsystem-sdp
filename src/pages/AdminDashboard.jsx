import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Store } from '../store'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const adminName = Store.getAdminName()

  useEffect(() => { setForms(Store.getForms()) }, [])

  const activeForms = forms.filter(f => f.status === 'Active')
  const totalResponses = forms.reduce((a, f) => a + f.responses, 0)
  const avgRating = forms.length ? (forms.reduce((a, f) => a + f.rating, 0) / forms.length).toFixed(1) : '0'

  const bars = [
    { label: '1★', val: '8%', h: 15, color: 'var(--accent3)' },
    { label: '2★', val: '12%', h: 25, color: 'var(--accent4)' },
    { label: '3★', val: '20%', h: 40, color: '#aaa' },
    { label: '4★', val: '38%', h: 75, color: 'var(--accent2)' },
    { label: '5★', val: '22%', h: 44, color: 'var(--accent)' },
  ]

  const getFirstName = (name) => name.split(' ').slice(-1)[0]

  return (
    <div className="layout page-enter">
      <Navbar role="admin" />
      <div className="layout-with-sidebar">
        <Sidebar />
        <div className="main-content">
          <div className="page-body">
            <div className="page-header">
              <div className="page-header-left">
                <h2>Welcome back, {adminName} 👋</h2>
                <p>Here's what's happening with your feedback system today.</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/admin/forms/create')}>＋ New Feedback Form</button>
            </div>

            <div className="grid-4" style={{ marginBottom: '28px' }}>
              {[
                { label: 'Active Forms', value: activeForms.length, sub: `${forms.filter(f=>f.status==='Closed').length} closed`, trend: `${forms.length} total forms`, type: 'up', color: 'var(--accent)' },
                { label: 'Total Responses', value: totalResponses, sub: 'across all forms', trend: '↑ Live tracking', type: 'up', color: 'var(--accent2)' },
                { label: 'Avg. Rating', value: avgRating, sub: 'across all courses', trend: 'Based on submissions', type: 'up', color: 'var(--accent4)' },
                { label: 'Pending Review', value: '14', sub: 'flagged responses', trend: 'Needs attention', type: 'down', color: 'var(--accent3)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="label">{s.label}</div>
                  <div className="value" style={{ color: s.color }}>{s.value}</div>
                  <div className="sub">{s.sub}</div>
                  <span className={`trend trend-${s.type}`}>{s.trend}</span>
                </div>
              ))}
            </div>

            <div className="grid-2">
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1rem' }}>Your Feedback Forms</h3>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate('/admin/forms')}>View All</button>
                </div>
                {forms.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
                    <p>No forms yet. Create your first form!</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={() => navigate('/admin/forms/create')}>＋ Create Form</button>
                  </div>
                ) : (
                  <table className="table">
                    <thead><tr><th>Form Name</th><th>Responses</th><th>Status</th></tr></thead>
                    <tbody>
                      {forms.slice(0, 5).map(f => (
                        <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/analytics/${f.id}`)}>
                          <td>{f.title}</td>
                          <td style={{ color: 'var(--text2)' }}>{f.responses}/{f.total}</td>
                          <td><span className={`tag tag-${f.status === 'Active' ? 'green' : 'yellow'}`}>{f.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1rem' }}>Rating Distribution</h3>
                  <span className="tag tag-blue">All Forms</span>
                </div>
                <div className="bar-chart">
                  {bars.map(b => (
                    <div key={b.label} className="bar-col">
                      <div className="bar-val">{b.val}</div>
                      <div className="bar-fill" style={{ height: `${b.h}%`, background: b.color }} />
                      <div className="bar-label">{b.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px' }}>
                  {[
                    { label: 'Instructor Clarity', val: '4.5/5', pct: 90, color: 'var(--accent)' },
                    { label: 'Course Content', val: '4.0/5', pct: 80, color: 'var(--accent2)' },
                    { label: 'Assessment Fairness', val: '3.8/5', pct: 76, color: 'var(--accent4)' },
                  ].map(m => (
                    <div key={m.label} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '6px' }}>
                        <span>{m.label}</span><span style={{ color: m.color }}>{m.val}</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
