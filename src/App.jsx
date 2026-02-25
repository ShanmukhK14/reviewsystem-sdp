import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminForms from './pages/AdminForms'
import AdminCreateForm from './pages/AdminCreateForm'
import AdminAnalytics from './pages/AdminAnalytics'
import StudentDashboard from './pages/StudentDashboard'
import StudentFeedback from './pages/StudentFeedback'
import StudentResults from './pages/StudentResults'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/forms" element={<AdminForms />} />
        <Route path="/admin/forms/create" element={<AdminCreateForm />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/analytics/:id" element={<AdminAnalytics />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/feedback" element={<StudentFeedback />} />
        <Route path="/student/feedback/:id" element={<StudentFeedback />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
