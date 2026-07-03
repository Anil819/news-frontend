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
  Plus,
  Trash2,
  X
} from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  image: '',
  status: 'Upcoming'
}

export default function ManageEvents() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/events')
      setEvents(data.events)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/events', form)
      setForm(emptyForm)
      setShowForm(false)
      fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create event.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/events/${id}`)
      setEvents((prev) => prev.filter((e) => e._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this event.')
    } finally {
      setDeletingId(null)
    }
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { icon: Newspaper, label: 'News Management', onClick: () => navigate('/admin/news') },
    { icon: CalendarDays, label: 'Events Management', active: true },
    { icon: Image, label: 'Gallery Management', onClick: () => navigate('/admin/gallery') },
    { icon: Megaphone, label: 'Notices', onClick: () => navigate('/admin/notices') },
    { icon: Users, label: 'User Management', onClick: () => navigate('/admin/users') },
    { icon: MessageSquare, label: 'Messages', onClick: () => navigate('/admin/messages') },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout }
  ]

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || 'Admin User'}
      userRole="Administrator"
      pageTitle="Events Management"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{events.length} event(s) total</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Event Title"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description (optional)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              placeholder="Time (e.g. 10:00 AM - 12:00 PM)"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="Location"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e.target.files[0])}
  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
/>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Saving...' : 'Create Event'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Registrations</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-gray-400">
                    No events yet.
                  </td>
                </tr>
              )}
              {!loading &&
                events.map((ev) => (
                  <tr key={ev._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900">{ev.title}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{ev.location}</td>
                    <td className="px-5 py-3 text-gray-500">{ev.registrations?.length || 0}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(ev._id)}
                        disabled={deletingId === ev._id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        {deletingId === ev._id ? 'Deleting...' : 'Delete'}
                      </button>
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
