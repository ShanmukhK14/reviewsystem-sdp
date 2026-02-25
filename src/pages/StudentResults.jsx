import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Store } from '../store'

export default function StudentResults() {
  const navigate = useNavigate()
  const forms = Store.getForms()
  const submissions = Store.getSubmissions()
  const submittedForms = forms.filter(f => Store.hasSubmitted(f.id))

  const themes = [
    { label: 'Clear Explanations', color: 'green' },
    { label: 'Practical Labs', color: 'green' },
    { label: 'Pace Too Fast', color: 'yellow' },
    { label: 'More Practice Problems', color: 'blue' },
    { label: 'Normalization Confusing', color: 'yellow' },
    { label: 'Helpful TA Sessions', color: 'green' },
    { label: 'Want More Examples', color: 'blue' },
  ]

  return (
    <div className="layout page-enter">
      <Navbar role="student" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Aggregated Feedback Results</h2>
            <p>Anonymous insights from your peers — view how your class rates its courses.</p>
          </div>
        </div>

        {submittedForms.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.4 }}>📊</div>
            <h3 style={{ marginBottom: '8px' }}>No results yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '20px' }}>Submit at least one feedback form to see aggregated results here.</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/dashboard')}>Go Fill a Form →</button>
          </div>
        ) : (
          <>
            <div className="grid-2" style={{ marginBottom: '24px' }}>
              {submittedForms.map(f => {
                const a = f.analytics || {}
                return (
                  <div key={f.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1rem' }}>{f.title}</h3>
                      <span className={`tag tag-${f.status === 'Active' ? 'green' : 'yellow'}`}>{f.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '20px' }}>{f.course} · {f.responses} responses</p>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>
                          {f.rating || '–'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Avg. Rating</div>
                        {f.rating > 0 && <div style={{ marginTop: '4px' }}>{'⭐'.repeat(Math.round(f.rating))}</div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        {(a.perQuestion || []).length > 0 ? (a.perQuestion || []).map(q => (
                          <div key={q.label} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.75rem' }}>{q.label.slice(0, 25)}...</span>
                              <span style={{ color: q.color }}>{q.val}</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${q.pct}%`, background: q.color }} /></div>
                          </div>
                        )) : (
                          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                            {f.responses === 0 ? 'No class responses yet.' : 'Results will appear as more students respond.'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,201,167,0.06)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--accent)' }}>
                      ✓ You submitted this form
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Common Themes from Open-Ended Feedback</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {themes.map(t => (
                  <span key={t.label} className={`tag tag-${t.color}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>{t.label}</span>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '16px' }}>
                * All responses are anonymous. Individual data is not displayed.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
