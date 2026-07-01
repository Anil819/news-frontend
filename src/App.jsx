import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import News from './pages/News'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Notices from './pages/Notices'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import ManageNews from './pages/admin/ManageNews'
import ManageEvents from './pages/admin/ManageEvents'
import ManageGallery from './pages/admin/ManageGallery'
import ManageNotices from './pages/admin/ManageNotices'
import ManageUsers from './pages/admin/ManageUsers'
import ManageMessages from './pages/admin/ManageMessages'

const DASHBOARD_PREFIXES = ['/admin', '/student', '/teacher']

export default function App() {
  const location = useLocation()
  const isDashboard = DASHBOARD_PREFIXES.some((p) => location.pathname.startsWith(p))

  if (isDashboard) {
    return (
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute role="admin">
              <ManageNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="admin">
              <ManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute role="admin">
              <ManageGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute role="admin">
              <ManageNotices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute role="admin">
              <ManageMessages />
            </ProtectedRoute>
          }
        />

        { <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        /> }

        { <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        /> }
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
