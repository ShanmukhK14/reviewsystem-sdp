import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { Store } from '../store'

export default function StudentFeedback() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [toast, setToast] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const f = id ? Store.getFormById(id) : Store.getForms().find(f => f.status === 'Active')
    if (!f) { navigate('/student/dashboard'); return }
    if (Store.hasSubmitted(f.id)) { setToast('You already submitted this form!'); setTimeout(() => navigate('/student/dashboard'), 1500); return }
    setForm(f)
    // Init answers
    const init = {}
    ;(f.questions || []).forEach(q => { init[q.id] = q.type === 'rating' ? 4 : q.type === 'mcq' ? 0 : '' })
    setAnswers(init)
  }, [id])

  if (!form) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'var(--text2)' }}>Loading...</div>

  const questions = form.questions || []
  const progress = Math.round(((currentQ) / questions.length) * 100)

  const setAnswer = (qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }))

  const handleSubmit = () => {
    Store.addSubmission({
      formId: form.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      answers,
    })
    setSubmitted(true)
    setToast('🎉 Feedback submitted successfully! Thank you.')
    setTimeout(() => navigate('/student/dashboard'), 2000)
  }

  const q = questions[currentQ]

  if (submitted) return (
    <div className="layout page-enter">
      <Navbar role="student" />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flex:1 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'4rem', marginBottom:'16px' }}>🎉</div>
          <h2 style={{ marginBottom:'8px' }}>Thank you!</h2>
          <p style={{ color:'var(--text2)' }}>Your feedback has been recorded. Redirecting...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="layout page-enter">
      <Navbar role="student" />
      <div className="page-body" style={{ maxWidth: '720px' }}>
        <div className="breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate('/student/dashboard')}>Dashboard</button>
          <span>›</span><span>{form.title}</span>
        </div>

        {/* Form header */}
        <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, rgba(0,201,167,0.08), rgba(108,140,255,0.06))', borderColor: 'rgba(0,201,167,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>{form.title}</h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginTop: '4px' }}>
                {form.createdBy} · {form.course} · {form.section}
              </p>
            </div>
            <span className="tag tag-green">Active</span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
              Q {currentQ + 1} of {questions.length}
            </span>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text2)' }}>This form has no questions yet.</p>
            <button className="btn btn-secondary" style={{ marginTop: '16px' }} onClick={() => navigate('/student/dashboard')}>← Back</button>
          </div>
        ) : (
          <>
            {/* Current Question */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="q-num">Question {currentQ + 1} of {questions.length} · {
                q.type === 'rating' ? 'Rating' : q.type === 'mcq' ? 'Multiple Choice' : 'Text Response'
              }</div>
              <p style={{ fontSize: '1.05rem', marginBottom: '20px', lineHeight: 1.6, fontWeight: 500 }}>{q.text}</p>

              {q.type === 'rating' && (
                <div>
                  <div className="stars">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={`star ${n <= (answers[q.id] || 0) ? 'star-filled' : 'star-empty'}`}
                        onClick={() => setAnswer(q.id, n)}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '10px' }}>
                    {answers[q.id] ? `Selected: ${answers[q.id]} / 5 stars` : 'Click a star to rate'}
                  </p>
                </div>
              )}

              {q.type === 'mcq' && (
                <div className="radio-group">
                  {(q.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, i) => (
                    <div key={opt} className={`radio-item ${answers[q.id] === i ? 'selected' : ''}`}
                      onClick={() => setAnswer(q.id, i)}>
                      <div className="radio-dot" />{opt}
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'text' && (
                <textarea className="form-textarea"
                  placeholder="Type your answer here... (optional)"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)} />
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-secondary"
                onClick={() => currentQ > 0 ? setCurrentQ(p => p - 1) : navigate('/student/dashboard')}>
                ← {currentQ > 0 ? 'Previous' : 'Back'}
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                {questions.map((_, i) => (
                  <div key={i} onClick={() => setCurrentQ(i)} style={{
                    width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer',
                    background: i === currentQ ? 'var(--accent)' : i < currentQ ? 'rgba(0,201,167,0.4)' : 'var(--border)',
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
              {currentQ < questions.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrentQ(p => p + 1)}>Next →</button>
              ) : (
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Feedback ✓</button>
              )}
            </div>
          </>
        )}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
