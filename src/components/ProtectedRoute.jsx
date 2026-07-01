import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Checking session...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    // Logged in, but as the wrong role for this dashboard — send them
    // to their own dashboard instead of the one they tried to access.
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return children
}
