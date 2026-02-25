// ─── Global Data Store (localStorage-backed) ───────────────────────────────
// All pages read/write here so data stays in sync across the whole app

export const Store = {
  // ── Auth ──
  getAdminName: () => localStorage.getItem('adminName') || 'Prof. Sharma',
  getStudentName: () => localStorage.getItem('studentName') || 'Student',
  setAdminName: (n) => localStorage.setItem('adminName', n),
  setStudentName: (n) => localStorage.setItem('studentName', n),

  // ── Forms ──
  getForms: () => {
    try {
      const raw = localStorage.getItem('rs_forms')
      if (raw) return JSON.parse(raw)
    } catch {}
    // Default seed data
    const defaults = [
      {
        id: '1', title: 'DBMS Mid-Sem Feedback',
        course: 'Database Management Systems', section: 'Sec A',
        openDate: '2026-02-24', closeDate: '2026-03-05',
        status: 'Active', responses: 87, total: 120, rating: 4.3,
        createdBy: 'admin', questions: [
          { type: 'rating', text: 'How would you rate the overall teaching quality?' },
          { type: 'mcq', text: 'How would you describe the pace of the course?', options: ['Too slow', 'Just right', 'Too fast'] },
          { type: 'text', text: 'What improvements would you suggest?' },
        ],
        analytics: {
          ratingDist: [8, 12, 20, 38, 22],
          mcqResults: [{ label: 'Just Right', count: 52, pct: 60 }, { label: 'Too Fast', count: 26, pct: 30 }, { label: 'Too Slow', count: 9, pct: 10 }],
          perQuestion: [
            { label: 'Teaching Quality', val: '4.5★', pct: 90, color: 'var(--accent)' },
            { label: 'Course Pace', val: '4.1★', pct: 82, color: 'var(--accent2)' },
          ],
          openEnded: [
            { text: 'SQL labs are really helpful. Would like more practice problems.', sentiment: 'Positive', sColor: 'green', date: 'Feb 22' },
            { text: 'Normalization was rushed. Need more time.', sentiment: 'Mixed', sColor: 'yellow', date: 'Feb 22' },
          ],
        },
      },
      {
        id: '2', title: 'OS Course Review',
        course: 'Operating Systems', section: 'Sec B',
        openDate: '2026-02-20', closeDate: '2026-03-03',
        status: 'Active', responses: 54, total: 90, rating: 4.0,
        createdBy: 'admin', questions: [
          { type: 'rating', text: 'Rate the course content overall.' },
          { type: 'text', text: 'What did you find most challenging?' },
        ],
        analytics: {
          ratingDist: [5, 10, 25, 40, 20],
          mcqResults: [],
          perQuestion: [
            { label: 'Course Content', val: '4.0★', pct: 80, color: 'var(--accent2)' },
          ],
          openEnded: [
            { text: 'Process scheduling topics are very well explained.', sentiment: 'Positive', sColor: 'green', date: 'Feb 20' },
          ],
        },
      },
      {
        id: '3', title: 'CN Lab Evaluation',
        course: 'Computer Networks Lab', section: 'All Sections',
        openDate: '2026-02-01', closeDate: '2026-02-20',
        status: 'Closed', responses: 120, total: 120, rating: 3.9,
        createdBy: 'admin', questions: [],
        analytics: {
          ratingDist: [10, 15, 25, 30, 20],
          mcqResults: [],
          perQuestion: [
            { label: 'Lab Equipment', val: '4.0★', pct: 80, color: 'var(--accent)' },
            { label: 'Guidance', val: '3.8★', pct: 76, color: 'var(--accent2)' },
          ],
          openEnded: [],
        },
      },
    ]
    localStorage.setItem('rs_forms', JSON.stringify(defaults))
    return defaults
  },

  saveForms: (forms) => localStorage.setItem('rs_forms', JSON.stringify(forms)),

  addForm: (form) => {
    const forms = Store.getForms()
    forms.unshift(form) // add to top
    Store.saveForms(forms)
  },

  getFormById: (id) => Store.getForms().find(f => f.id === id),

  // ── Submissions (which student filled which form) ──
  getSubmissions: () => {
    try { return JSON.parse(localStorage.getItem('rs_submissions') || '[]') } catch { return [] }
  },
  addSubmission: (sub) => {
    const subs = Store.getSubmissions()
    subs.push(sub)
    localStorage.setItem('rs_submissions', JSON.stringify(subs))
  },
  hasSubmitted: (formId) => {
    return Store.getSubmissions().some(s => s.formId === formId)
  },

  // ── Courses ──
  getCourses: () => {
    try {
      const raw = localStorage.getItem('rs_courses')
      if (raw) return JSON.parse(raw)
    } catch {}
    const defaults = ['Database Management Systems', 'Operating Systems', 'Computer Networks Lab']
    localStorage.setItem('rs_courses', JSON.stringify(defaults))
    return defaults
  },
  saveCourses: (courses) => localStorage.setItem('rs_courses', JSON.stringify(courses)),
  addCourse: (course) => {
    const courses = Store.getCourses()
    if (!courses.includes(course)) { courses.push(course); Store.saveCourses(courses) }
  },

  // ── Clear all (for testing) ──
  reset: () => {
    localStorage.removeItem('rs_forms')
    localStorage.removeItem('rs_submissions')
    localStorage.removeItem('rs_courses')
  },
}
