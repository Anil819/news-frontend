
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Bell } from 'lucide-react'

export default function DashboardLayout({ navItems, userName, userRole, pageTitle, children }) {
  const navigate = useNavigate()
  const initial = userName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50 flex">
       <aside className="w-64 bg-gray-900 text-gray-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="flex items-center gap-2 text-white font-bold px-5 py-5 border-b border-gray-800">
          <span className="bg-blue-600 rounded-lg p-1.5">
            <GraduationCap size={18} />
          </span>
          <span className="text-sm">COLLEGE NEWS PORTAL</span>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {initial}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">{userRole}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-lg transition-colors ${
                item.active ? 'bg-blue-600 text-white font-medium' : 'hover:bg-gray-800'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

       <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h1 className="font-semibold text-gray-900">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell size={18} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-blue-600 hidden sm:inline"
            >
              Back to site
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              {initial}
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  )
}
