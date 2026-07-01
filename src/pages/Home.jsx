import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, CalendarDays, Bell, Clock, MapPin, ArrowRight } from 'lucide-react'
import api from '../api/axios'
import campusImage from "../assests/college-campus.jpeg";
const quickLinks = [
  {
    icon: Newspaper,
    title: 'Latest News',
    desc: 'Stay informed with the most recent news and updates.',
    to: '/news'
  },
  {
    icon: CalendarDays,
    title: 'Upcoming Events',
    desc: 'View upcoming events and activities on campus.',
    to: '/events'
  },
  {
    icon: Bell,
    title: 'Announcements',
    desc: 'Important announcements for students and staff.',
    to: '/notices'
  }
]

export default function Home() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newsRes, eventsRes] = await Promise.all([
          api.get('/news', { params: { limit: 3 } }),
          api.get('/events', { params: { status: 'Upcoming' } })
        ])
        setNews(newsRes.data.news)
        setEvents(eventsRes.data.events.slice(0, 3))
      } catch {
        // Home page stays usable even if this fails — sections below just render empty.
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="h-[420px] sm:h-[480px] w-full overflow-hidden">
          <img
             src={campusImage}
            alt="College campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/55 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl text-white">
              <span className="inline-block bg-white/10 border border-white/20 text-xs font-medium px-3 py-1 rounded-full mb-4">
                WELCOME TO OUR CAMPUS
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Stay Updated With College News
              </h1>
              <p className="mt-4 text-gray-200 text-sm sm:text-base">
                Get the latest updates on news, events, placements and campus activities.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/news"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Explore News
                </Link>
                <Link
                  to="/events"
                  className="bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  View Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick link cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid sm:grid-cols-3 gap-5">
          {quickLinks.map((card) => (
            <div key={card.title} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="bg-blue-50 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                <card.icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{card.desc}</p>
              <Link
                to={card.to}
                className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Read More <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide">LATEST NEWS &amp; UPDATES</h2>
          <Link to="/news" className="text-blue-600 text-sm font-medium inline-flex items-center gap-1">
            View All News <ArrowRight size={14} />
          </Link>
        </div>

        {!loading && news.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No news articles yet.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
            const date = new Date(item.createdAt)
            return (
              <article
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1.5 text-center shadow">
                    <div className="text-blue-600 font-bold text-sm leading-none">
                      {date.toLocaleDateString('en-US', { day: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase">
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.excerpt}</p>
                  <Link to="/news" className="text-blue-600 text-sm font-medium inline-flex items-center gap-1">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-16">
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-wide">UPCOMING EVENTS</h2>
            <Link to="/events" className="text-blue-400 text-sm font-medium inline-flex items-center gap-1">
              View All Events <ArrowRight size={14} />
            </Link>
          </div>

          {!loading && events.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No upcoming events yet.</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => {
              const date = new Date(ev.date)
              return (
                <div key={ev._id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="flex">
                    {ev.image && (
                      <img src={ev.image} alt={ev.title} className="w-28 h-full object-cover" />
                    )}
                    <div className="p-4 flex-1">
                      <div className="text-blue-600 font-bold text-sm">
                        {date.toLocaleDateString('en-US', { day: '2-digit' })}{' '}
                        <span className="text-gray-400 font-normal text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 mb-2 line-clamp-2">
                        {ev.title}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <Clock size={12} /> {ev.time}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin size={12} /> {ev.location}
                      </div>
                      <Link
                        to="/events"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg w-full transition-colors text-center block"
                      >
                        View &amp; Register
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
