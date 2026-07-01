import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users2,
  ClipboardCheck,
  CalendarCheck,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { teacherStats, teacherClasses, teacherSubmissions } from '../data/mockData'

const statusStyle = {
  Reviewed: 'bg-green-50 text-green-600',
  Pending: 'bg-amber-50 text-amber-600'
}

const priorityBadge = {
  Urgent: 'bg-red-50 text-red-600',
  Important: 'bg-amber-50 text-amber-600',
  Normal: 'bg-blue-50 text-blue-600'
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [notices, setNotices] = useState([])

  useEffect(() => {
    api
      .get('/notices')
      .then(({ data }) => setNotices(data.notices.slice(0, 4)))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Users2, label: 'My Classes' },
    { icon: ClipboardCheck, label: 'Assignments' },
    { icon: CalendarCheck, label: 'Attendance' },
    { icon: Megaphone, label: 'Notices', onClick: () => navigate('/notices') },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout }
  ]

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || 'Teacher'}
      userRole="Teacher"
      pageTitle="Teacher Dashboard"
    >
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {teacherStats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
            <div className="text-xs text-blue-600 flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Notices */}
      {notices.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Notices</h2>
            <button onClick={() => navigate('/notices')} className="text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="p-5 space-y-3">
            {notices.map((n) => (
              <div key={n._id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                    priorityBadge[n.priority] || priorityBadge.Normal
                  }`}
                >
                  {n.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Classes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Classes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Class</th>
                  <th className="px-5 py-3 font-medium">Section</th>
                  <th className="px-5 py-3 font-medium">Students</th>
                  <th className="px-5 py-3 font-medium">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {teacherClasses.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900">{c.name}</td>
                    <td className="px-5 py-3 text-gray-500">{c.section}</td>
                    <td className="px-5 py-3 text-gray-500">{c.students}</td>
                    <td className="px-5 py-3 text-gray-500">{c.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submissions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Assignment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {teacherSubmissions.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900">{s.student}</td>
                    <td className="px-5 py-3 text-gray-500">{s.assignment}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
