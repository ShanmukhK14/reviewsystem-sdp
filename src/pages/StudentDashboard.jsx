import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Store } from '../store'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [submissions, setSubmissions] = useState([])
  const studentName = Store.getStudentName()
  const firstName = studentName.split(' ')[0]

  useEffect(() => {
    setForms(Store.getForms())
    setSubmissions(Store.getSubmissions())
  }, [])

  const pendingForms = forms.filter(f => f.status === 'Active' && !Store.hasSubmitted(f.id))
  const submittedForms = forms.filter(f => Store.hasSubmitted(f.id))

  return (
    <div className="layout page-enter">
      <Navbar role="student" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Hello, {firstName} 👋</h2>
            <p>You have <strong style={{ color: pendingForms.length > 0 ? 'var(--accent3)' : 'var(--accent)' }}>
              {pendingForms.length} pending</strong> feedback form{pendingForms.length !== 1 ? 's' : ''} to submit.
            </p>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: '28px' }}>
          {[
            { label: 'Pending Forms', value: pendingForms.length, sub: 'awaiting your feedback', color: pendingForms.length > 0 ? 'var(--accent3)' : 'var(--accent)' },
            { label: 'Completed', value: submittedForms.length, sub: 'forms submitted', color: 'var(--accent)' },
            { label: 'Total Forms', value: forms.filter(f => f.status === 'Active').length, sub: 'active this semester', color: 'var(--accent2)' },
            { label: 'Contribution', value: submittedForms.length > 0 ? '✓' : '–', sub: 'thank you!', color: 'var(--accent4)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="label">{s.label}</div>
              <div className="value" style={{ color: s.color }}>{s.value}</div>
              <div className="sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Pending forms */}
        <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontFamily: "'Syne', sans-serif" }}>
          Pending Feedback Forms {pendingForms.length > 0 && <span style={{ color: 'var(--accent3)', fontSize: '0.85rem' }}>({pendingForms.length})</span>}
        </h3>

        {pendingForms.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ marginBottom: '8px', color: 'var(--accent)' }}>All caught up!</h3>
            <p style={{ color: 'var(--text2)' }}>No pending forms right now. Check back later.</p>
          </div>
        ) : (
          <div className="grid-3" style={{ marginBottom: '32px' }}>
            {pendingForms.map((f, i) => {
              const isUrgent = i === 0
              const daysLeft = Math.ceil((new Date(f.closeDate) - new Date()) / (1000*60*60*24))
              return (
                <div key={f.id} className="card card-hover" onClick={() => navigate(`/student/feedback/${f.id}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <span className={`tag tag-${isUrgent ? 'red' : 'yellow'}`}>{isUrgent ? 'Fill Now' : 'Open'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Closing soon'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '6px' }}>{f.course}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '16px' }}>
                    By {f.createdBy} · {(f.questions || []).length} questions
                  </p>
                  <button
                    className={`btn ${isUrgent ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={e => { e.stopPropagation(); navigate(`/student/feedback/${f.id}`) }}>
                    Fill Now →
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Completed */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontFamily: "'Syne', sans-serif" }}>Submitted</h3>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/student/results')}>View All Results →</button>
        </div>
        <div className="card">
          {submittedForms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text2)' }}>
              <p>No submitted forms yet. Fill your first feedback form above!</p>
            </div>
          ) : (
            <table className="table">
              <thead><tr><th>Form</th><th>Course</th><th>Submitted</th><th>Status</th></tr></thead>
              <tbody>
                {submittedForms.map(f => {
                  const sub = Store.getSubmissions().find(s => s.formId === f.id)
                  return (
                    <tr key={f.id}>
                      <td>{f.title}</td>
                      <td style={{ color: 'var(--text2)' }}>{f.course}</td>
                      <td style={{ color: 'var(--text2)' }}>{sub?.date || 'Today'}</td>
                      <td><span className="tag tag-green">✓ Submitted</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
