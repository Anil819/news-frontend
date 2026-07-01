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

const emptyForm = { name: '', email: '', password: '', role: 'student' }

export default function ManageUsers() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/users', { params: { role: roleFilter, limit: 100 } })
      setUsers(data.users)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter])

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
      await api.post('/users', form)
      setForm(emptyForm)
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (target) => {
    setBusyId(target._id)
    try {
      await api.put(`/users/${target._id}`, { isActive: !target.isActive })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update this user.')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user account? This cannot be undone.')) return
    setBusyId(id)
    try {
      await api.delete(`/users/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this user.')
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
    { icon: Users, label: 'User Management', active: true },
    { icon: MessageSquare, label: 'Messages', onClick: () => navigate('/admin/messages') },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout }
  ]

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user?.name || 'Admin User'}
      userRole="Administrator"
      pageTitle="User Management"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">{users.length} user(s)</p>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add User'}
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
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Temporary Password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
              {!loading &&
                users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900">{u.name}</td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3 text-gray-500 capitalize">{u.role}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={busyId === u._id}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full disabled:opacity-50 ${
                          u.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={busyId === u._id || u._id === user?._id}
                        title={u._id === user?._id ? "You can't delete your own account" : ''}
                        className="text-red-500 hover:text-red-700 disabled:opacity-40 inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
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
