import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, Search, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/news', label: 'News' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/notices', label: 'Notices' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <span className="bg-blue-600 text-white rounded-lg p-1.5">
            <GraduationCap size={20} />
          </span>
          <span className="text-sm sm:text-base tracking-wide">SVIMS NEWS PORTAL</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button aria-label="Search" className="text-gray-500 hover:text-blue-600">
            <Search size={18} />
          </button>

          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600"
              >
                <LayoutDashboard size={16} />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Register
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-gray-700 font-medium"
            >
              {l.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                onClick={() => setOpen(false)}
                className="block text-gray-700 font-medium"
              >
                {user.name}&apos;s Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full bg-gray-900 text-white text-center font-medium px-5 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block text-gray-700 font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block bg-blue-600 text-white text-center font-medium px-5 py-2 rounded-lg"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
