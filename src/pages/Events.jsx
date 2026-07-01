import { useEffect, useState } from 'react'
import { Clock, MapPin, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registeringId, setRegisteringId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/events', { params: { status: 'Upcoming' } })
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

  const isRegistered = (event) => user && event.registrations?.includes(user._id)

  const handleRegister = async (eventId) => {
    if (!user) {
      navigate('/login')
      return
    }
    setRegisteringId(eventId)
    try {
      await api.post(`/events/${eventId}/register`)
      await fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register for this event.')
    } finally {
      setRegisteringId(null)
    }
  }

  return (
    <div>
      <Breadcrumb title="Upcoming Events" trail={[{ label: 'Events' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {loading && (
          <div className="text-center text-gray-400 text-sm py-12">Loading events...</div>
        )}

        {!loading && events.length === 0 && !error && (
          <div className="text-center text-gray-400 text-sm py-12">
            No upcoming events right now. Check back soon.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => {
            const date = new Date(ev.date)
            const registered = isRegistered(ev)
            return (
              <div
                key={ev._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {ev.image && (
                  <img src={ev.image} alt={ev.title} className="w-full h-44 object-cover" />
                )}
                <div className="p-5">
                  <div className="text-blue-600 font-bold text-sm">
                    {date.toLocaleDateString('en-US', { day: '2-digit' })}{' '}
                    <span className="text-gray-400 font-normal text-xs">
                      {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-1 mb-3">{ev.title}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-1.5">
                    <Clock size={14} /> {ev.time}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                    <MapPin size={14} /> {ev.location}
                  </div>
                  <button
                    onClick={() => handleRegister(ev._id)}
                    disabled={registered || registeringId === ev._id}
                    className={`text-sm font-medium px-4 py-2 rounded-lg w-full transition-colors inline-flex items-center justify-center gap-1.5 ${
                      registered
                        ? 'bg-green-50 text-green-600 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60'
                    }`}
                  >
                    {registered ? (
                      <>
                        <Check size={14} /> Registered
                      </>
                    ) : registeringId === ev._id ? (
                      'Registering...'
                    ) : (
                      'Register Now'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
