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

const categories = ['Events', 'Campus', 'Sports', 'Cultural', 'Workshops']

const emptyForm = { category: 'Campus', image: '', caption: '' }

export default function ManageGallery() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchImages = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/gallery')
      setImages(data.images)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load gallery images.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
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
      await api.post('/gallery', form)
      setForm(emptyForm)
      setShowForm(false)
      fetchImages()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add image.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/gallery/${id}`)
      setImages((prev) => prev.filter((img) => img._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this image.')
    } finally {
      setDeletingId(null)
    }
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { icon: Newspaper, label: 'News Management', onClick: () => navigate('/admin/news') },
    { icon: CalendarDays, label: 'Events Management', onClick: () => navigate('/admin/events') },
    { icon: Image, label: 'Gallery Management', active: true },
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
      pageTitle="Gallery Management"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{images.length} image(s) total</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Image'}
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
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e.target.files[0])}
  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
/>
          <input
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Caption (optional)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Saving...' : 'Add to Gallery'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && (
          <p className="col-span-full text-center text-gray-400 text-sm py-8">Loading...</p>
        )}
        {!loading && images.length === 0 && (
          <p className="col-span-full text-center text-gray-400 text-sm py-8">
            No images yet.
          </p>
        )}
        {!loading &&
          images.map((img) => (
            <div
              key={img._id}
              className="relative rounded-xl overflow-hidden aspect-[4/3] group bg-white border border-gray-100"
            >
              <img
                src={img.image}
                alt={img.caption || img.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-white/90 text-xs font-medium px-2 py-0.5 rounded-full text-gray-700">
                {img.category}
              </div>
              <button
                onClick={() => handleDelete(img._id)}
                disabled={deletingId === img._id}
                className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
      </div>
    </DashboardLayout>
  )
}
