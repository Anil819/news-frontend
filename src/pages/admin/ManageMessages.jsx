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
  Trash2,
  Mail,
  MailOpen
} from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function ManageMessages() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/contact')
      setMessages(data.messages)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleMarkRead = async (id) => {
    setBusyId(id)
    try {
      await api.put(`/contact/${id}/read`)
      fetchMessages()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update this message.')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    setBusyId(id)
    try {
      await api.delete(`/contact/${id}`)
      setMessages((prev) => prev.filter((m) => m._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this message.')
    } finally {
      setBusyId(null)
    }
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { icon: Newspaper, label: 'News Management', onClick: () => navigate('/admin/news') },
    { icon: CalendarDays, label: 'Events Management', onClick: () => navigate('/admin/events') },
    { icon: Image, label: 'Gallery Management', onClick: () => navigate('/admin/gallery') },
    { icon: Megaphone, label: 'Notices', onClick: () => navigate('/admin/notices') },
    { icon: Users, label: 'User Management', onClick: () => navigate('/admin/users') },
    { icon: MessageSquare, label: 'Messages', active: true },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout }
  ]

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || 'Admin User'}
      userRole="Administrator"
      pageTitle="Messages"
    >
      <p className="text-sm text-gray-500">{messages.length} message(s) total</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-400 text-sm py-8">Loading...</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No messages yet.</p>
        )}
        {!loading &&
          messages.map((m) => (
            <div
              key={m._id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${
                m.status === 'Unread' ? 'border-blue-200' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{m.subject}</h3>
                  <p className="text-xs text-gray-500">
                    {m.name} &lt;{m.email}&gt; •{' '}
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                    m.status === 'Unread' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{m.message}</p>
              <div className="flex items-center gap-4 text-sm">
                {m.status === 'Unread' && (
                  <button
                    onClick={() => handleMarkRead(m._id)}
                    disabled={busyId === m._id}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <MailOpen size={14} /> Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m._id)}
                  disabled={busyId === m._id}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </DashboardLayout>
  )
}
