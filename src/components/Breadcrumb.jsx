import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ title, trail }) {
  return (
    <div className="text-center py-10 sm:py-12 bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        {trail.map((t, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={14} />
            {t.to ? (
              <Link to={t.to} className="hover:text-blue-600">
                {t.label}
              </Link>
            ) : (
              <span className="text-gray-700">{t.label}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
