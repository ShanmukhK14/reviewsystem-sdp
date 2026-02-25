import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { Store } from '../store'

export default function AdminCreateForm() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [title, setTitle] = useState('')
  const [section, setSection] = useState('Section A')
  const [openDate, setOpenDate] = useState('2026-02-24')
  const [closeDate, setCloseDate] = useState('2026-03-15')
  const [status, setStatus] = useState('Active')
  const [totalStudents, setTotalStudents] = useState(60)

  // Courses
  const [courses, setCourses] = useState(Store.getCourses())
  const [selectedCourse, setSelectedCourse] = useState(Store.getCourses()[0] || '')
  const [newCourse, setNewCourse] = useState('')
  const [showAddCourse, setShowAddCourse] = useState(false)

  // Questions
  const [questions, setQuestions] = useState([
    { id: 1, type: 'rating', text: 'How would you rate the overall teaching quality of this course?' },
    { id: 2, type: 'mcq', text: 'How would you describe the pace of the course?', options: ['Too slow', 'Just right', 'Too fast'] },
    { id: 3, type: 'text', text: 'What improvements would you suggest for this course?' },
  ])
  const [newQ, setNewQ] = useState({ type: 'rating', text: '' })
  const [showAddQ, setShowAddQ] = useState(false)

  const addCourse = () => {
    const trimmed = newCourse.trim()
    if (!trimmed) return
    if (courses.includes(trimmed)) { setToast('⚠️ Course already exists!'); return }
    const updated = [...courses, trimmed]
    setCourses(updated)
    Store.saveCourses(updated)
    setSelectedCourse(trimmed)
    setNewCourse('')
    setShowAddCourse(false)
    setToast('✅ Course added!')
  }

  const removeCourse = (course) => {
    if (courses.length <= 1) { setToast('⚠️ Keep at least one course.'); return }
    const updated = courses.filter(c => c !== course)
    setCourses(updated)
    Store.saveCourses(updated)
    if (selectedCourse === course) setSelectedCourse(updated[0])
  }

  const addQuestion = () => {
    if (!newQ.text.trim()) { setToast('⚠️ Question text is required'); return }
    setQuestions(prev => [...prev, { id: Date.now(), ...newQ }])
    setNewQ({ type: 'rating', text: '' })
    setShowAddQ(false)
    setToast('✅ Question added!')
  }

  const removeQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id))

  const publish = () => {
    if (!title.trim()) { setToast('⚠️ Please enter a form title'); return }
    if (!selectedCourse) { setToast('⚠️ Please select a course'); return }

    const newForm = {
      id: Date.now().toString(),
      title: title.trim(),
      course: selectedCourse,
      section,
      openDate,
      closeDate,
      status,
      responses: 0,
      total: parseInt(totalStudents),
      rating: 0,
      createdBy: Store.getAdminName(),
      questions,
      analytics: {
        ratingDist: [0, 0, 0, 0, 0],
        mcqResults: [],
        perQuestion: questions.filter(q => q.type === 'rating').map(q => ({
          label: q.text.slice(0, 30) + '...', val: '0★', pct: 0, color: 'var(--accent)'
        })),
        openEnded: [],
      },
    }

    Store.addForm(newForm)
    setToast('🎉 Form published! Students can now fill it.')
    setTimeout(() => navigate('/admin/forms'), 1600)
  }

  return (
    <div className="layout page-enter">
      <Navbar role="admin" />
      <div className="main-content" style={{ flex: 1 }}>
        <div className="page-body" style={{ maxWidth: '820px' }}>
          <div className="breadcrumb">
            <button className="breadcrumb-link" onClick={() => navigate('/admin/forms')}>Forms</button>
            <span>›</span><span>Create New Form</span>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Create Feedback Form</h2>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>This form will appear in all students' dashboards once published.</p>
          </div>

          {/* ── Form Details ── */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>Form Details</h3>

            <div className="form-group">
              <label className="form-label">Form Title *</label>
              <input className="form-input" placeholder="e.g. DBMS Mid-Sem Feedback" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="grid-2" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Section</label>
                <input className="form-input" placeholder="e.g. Section A" value={section} onChange={e => setSection(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Total Students</label>
                <input className="form-input" type="number" min="1" value={totalStudents} onChange={e => setTotalStudents(e.target.value)} />
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Open Date</label>
                <input className="form-input" type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Close Date</label>
                <input className="form-input" type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Active">Active — students can fill now</option>
                <option value="Draft">Draft — save for later</option>
              </select>
            </div>
          </div>

          {/* ── Course Selector ── */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📚 Select Course</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setShowAddCourse(!showAddCourse)}>
                {showAddCourse ? '✕ Cancel' : '＋ Add Course'}
              </button>
            </div>

            {showAddCourse && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input className="form-input" placeholder="e.g. Data Structures & Algorithms"
                  value={newCourse} onChange={e => setNewCourse(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCourse()} autoFocus style={{ flex: 1 }} />
                <button className="btn btn-primary btn-sm" onClick={addCourse}>Add</button>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              {courses.map(c => (
                <div key={c} onClick={() => setSelectedCourse(c)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                  borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem',
                  background: selectedCourse === c ? 'rgba(0,201,167,0.15)' : 'var(--surface2)',
                  border: `1.5px solid ${selectedCourse === c ? 'var(--accent)' : 'var(--border)'}`,
                  color: selectedCourse === c ? 'var(--accent)' : 'var(--text3)',
                }}>
                  {selectedCourse === c && <span>✓</span>}
                  {c}
                  <button onClick={e => { e.stopPropagation(); removeCourse(c) }}
                    style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.8rem', padding: '0', marginLeft: '2px' }}>✕</button>
                </div>
              ))}
            </div>
            {selectedCourse && (
              <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '4px' }}>Selected: {selectedCourse}</p>
            )}
          </div>

          {/* ── Questions ── */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Questions ({questions.length})
              </h3>
              <button className="btn btn-sm btn-outline" onClick={() => setShowAddQ(!showAddQ)}>
                {showAddQ ? '✕ Cancel' : '＋ Add Question'}
              </button>
            </div>

            {/* Add question panel */}
            {showAddQ && (
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div className="grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Question Type</label>
                    <select className="form-select" value={newQ.type} onChange={e => setNewQ(p => ({ ...p, type: e.target.value }))}>
                      <option value="rating">⭐ Rating (1–5 stars)</option>
                      <option value="mcq">🔘 Multiple Choice</option>
                      <option value="text">📝 Text Response</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Question Text</label>
                    <input className="form-input" placeholder="Type your question..." value={newQ.text}
                      onChange={e => setNewQ(p => ({ ...p, text: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addQuestion()} />
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={addQuestion}>Add Question</button>
              </div>
            )}

            {questions.map((q, i) => (
              <div key={q.id} className="question-block" style={{ position: 'relative' }}>
                <button onClick={() => removeQuestion(q.id)} style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '1rem',
                }}>✕</button>
                <div className="q-num">Question {i + 1} · {q.type === 'rating' ? 'Rating (1–5)' : q.type === 'mcq' ? 'Multiple Choice' : 'Text Response'}</div>
                <div className="q-text" style={{ paddingRight: '30px' }}>{q.text}</div>
                {q.type === 'rating' && (
                  <div className="stars">
                    {[1,2,3,4,5].map(n => <span key={n} className="star star-filled">★</span>)}
                  </div>
                )}
                {q.type === 'mcq' && (
                  <div className="radio-group">
                    {(q.options || ['Option 1', 'Option 2', 'Option 3']).map(opt => (
                      <div key={opt} className="radio-item"><div className="radio-dot" />{opt}</div>
                    ))}
                  </div>
                )}
                {q.type === 'text' && <textarea className="form-textarea" disabled placeholder="Students will type here..." style={{ opacity: 0.5 }} />}
              </div>
            ))}

            {questions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text2)' }}>
                <p>No questions yet. Click "＋ Add Question" to start.</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/forms')}>Cancel</button>
              <button className="btn btn-primary" onClick={publish}>🚀 Publish Form</button>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
