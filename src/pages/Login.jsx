import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, User, Briefcase, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roles = [
  { key: 'student', label: 'Student', icon: User },
  { key: 'teacher', label: 'Teacher', icon: Briefcase },
  { key: 'admin', label: 'Admin', icon: ShieldCheck }
]

export default function Login() {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login({ ...form, role })
      navigate(`/${user.role}/dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 font-bold text-gray-900 mb-6">
          <span className="bg-blue-600 text-white rounded-lg p-1.5">
            <GraduationCap size={20} />
          </span>
          COLLEGE NEWS PORTAL
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Login to access your dashboard</p>

        {/* Role tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {roles.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRole(r.key)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs font-medium transition-colors ${
                role === r.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <r.icon size={16} />
              {r.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 font-medium">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg w-full transition-colors"
          >
            {submitting ? 'Logging in...' : `Login as ${roles.find((r) => r.key === role)?.label}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Back to{' '}
          <Link to="/" className="text-blue-600 font-medium">
            Home
          </Link>
        </p>
      </div>
    </div>
  )
}
