import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Store } from '../store'

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const { id } = useParams()
  const forms = Store.getForms()
  const form = id ? Store.getFormById(id) : forms[0]

  if (!form) return (
    <div className="layout page-enter">
      <Navbar role="admin" />
      <div className="layout-with-sidebar">
        <Sidebar />
        <div className="main-content">
          <div className="page-body" style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
            <h3 style={{ marginBottom: '8px' }}>No form selected</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '20px' }}>Go to Forms and click on one to view its analytics.</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/forms')}>Go to Forms</button>
          </div>
        </div>
      </div>
    </div>
  )

  const a = form.analytics || {}
  const bars = (a.ratingDist || [8,12,20,38,22]).map((v,i) => ({
    label: `${i+1}★`, val: `${v}%`, h: Math.max(v*1.5, 5),
    color: ['var(--accent3)','var(--accent4)','#aaa','var(--accent2)','var(--accent)'][i]
  }))

  return (
    <div className="layout page-enter">
      <Navbar role="admin" />
      <div className="layout-with-sidebar">
        <Sidebar />
        <div className="main-content">
          <div className="page-body">
            <div className="breadcrumb">
              <button className="breadcrumb-link" onClick={() => navigate('/admin/forms')}>Forms</button>
              <span>›</span><span>{form.title}</span>
            </div>
            <div className="page-header">
              <div className="page-header-left">
                <h2>Analytics — {form.title}</h2>
                <p>{form.responses} responses · {form.course} · Closes {form.closeDate}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="form-select" style={{ width: 'auto' }}
                  onChange={e => navigate(`/admin/analytics/${e.target.value}`)}>
                  {forms.map(f => <option key={f.id} value={f.id} selected={f.id === form.id}>{f.title}</option>)}
                </select>
                <button className="btn btn-secondary">⬇ Export</button>
              </div>
            </div>

            <div className="grid-4" style={{ marginBottom: '24px' }}>
              {[
                { label: 'Total Responses', value: form.responses, sub: `of ${form.total} enrolled`, color: 'var(--accent)' },
                { label: 'Avg. Rating', value: form.rating || '–', sub: 'out of 5', color: 'var(--accent4)' },
                { label: 'Response Rate', value: form.total ? `${Math.round(form.responses/form.total*100)}%` : '0%', sub: 'completion', color: 'var(--accent2)' },
                { label: 'Questions', value: (form.questions || []).length, sub: 'in this form', color: 'var(--accent3)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="label">{s.label}</div>
                  <div className="value" style={{ color: s.color }}>{s.value}</div>
                  <div className="sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: '24px' }}>
              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Rating Distribution</h3>
                {form.responses === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text2)' }}>No responses yet</div>
                ) : (
                  <div className="bar-chart">
                    {bars.map(b => (
                      <div key={b.label} className="bar-col">
                        <div className="bar-val">{b.val}</div>
                        <div className="bar-fill" style={{ height: `${b.h}%`, background: b.color }} />
                        <div className="bar-label">{b.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Per-Question Scores</h3>
                {(a.perQuestion || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text2)' }}>No rating data yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(a.perQuestion || []).map(q => (
                      <div key={q.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '6px' }}>
                          <span>{q.label}</span><span style={{ color: q.color }}>{q.val}</span>
                        </div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${q.pct}%`, background: q.color }} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Open-Ended Responses</h3>
              {(a.openEnded || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text2)' }}>
                  {form.responses === 0 ? 'No responses yet. Share this form with students.' : 'No text responses collected.'}
                </div>
              ) : (
                <table className="table">
                  <thead><tr><th>#</th><th>Response</th><th>Sentiment</th><th>Date</th></tr></thead>
                  <tbody>
                    {(a.openEnded || []).map((r, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text2)' }}>0{i+1}</td>
                        <td>{r.text}</td>
                        <td><span className={`tag tag-${r.sColor}`}>{r.sentiment}</span></td>
                        <td style={{ color: 'var(--text2)' }}>{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
