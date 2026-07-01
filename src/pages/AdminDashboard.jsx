import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Image,
  Megaphone,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusStyle = {
  Published: 'bg-green-50 text-green-600',
  Draft: 'bg-amber-50 text-amber-600'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [stats, setStats] = useState(null)
  const [recentNews, setRecentNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/dashboard/admin')
        setStats(data.stats)
        setRecentNews(data.recentNews)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Newspaper, label: 'News Management', onClick: () => navigate('/admin/news') },
    { icon: CalendarDays, label: 'Events Management', onClick: () => navigate('/admin/events') },
    { icon: Image, label: 'Gallery Management', onClick: () => navigate('/admin/gallery') },
    { icon: Megaphone, label: 'Notices', onClick: () => navigate('/admin/notices') },
    { icon: Users, label: 'User Management', onClick: () => navigate('/admin/users') },
    { icon: MessageSquare, label: 'Messages', onClick: () => navigate('/admin/messages') },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout }
  ]

  const statCards = stats
    ? [
        { label: 'Total News', value: stats.totalNews, to: '/admin/news' },
        { label: 'Total Events', value: stats.totalEvents, to: '/admin/events' },
        { label: 'Total Users', value: stats.totalUsers, to: '/admin/users' },
        { label: 'Unread Messages', value: stats.totalMessages, to: '/admin/messages' },
        { label: 'Total Notices', value: stats.totalNotices, to: '/admin/notices' }
      ]
    : []

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || 'Admin User'}
      userRole="Administrator"
      pageTitle="Dashboard"
    >
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {loading && (
          <p className="col-span-full text-center text-gray-400 text-sm py-6">
            Loading stats...
          </p>
        )}
        {!loading &&
          statCards.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.to)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
              <div className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                <TrendingUp size={12} /> Manage
              </div>
            </button>
          ))}
      </div>

      {/* Recent news table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent News</h2>
          <button
            onClick={() => navigate('/admin/news')}
            className="text-blue-600 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && recentNews.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                    No news articles yet.
                  </td>
                </tr>
              )}
              {!loading &&
                recentNews.map((row) => (
                  <tr key={row._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900">{row.title}</td>
                    <td className="px-5 py-3 text-gray-500">{row.category}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          statusStyle[row.status] || statusStyle.Draft
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
