import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import api from '../api/axios'

const categories = [
  'All News',
  'Academics',
  'Events',
  'Placements',
  'Campus',
  'Announcements',
  'Sports'
]

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All News')
  const [page, setPage] = useState(1)
  const [news, setNews] = useState([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/news', {
          params: { category: activeCategory, page, limit: 6 }
        })
        setNews(data.news)
        setPages(data.pages || 1)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load news.')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [activeCategory, page])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <div>
      <Breadcrumb title="News & Updates" trail={[{ label: 'News' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* List */}
        <div className="lg:col-span-3 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          {loading && (
            <div className="text-center text-gray-400 text-sm py-12">Loading news...</div>
          )}

          {!loading && news.length === 0 && !error && (
            <div className="text-center text-gray-400 text-sm py-12">
              No news articles found in this category yet.
            </div>
          )}

          {!loading &&
            news.map((item) => (
              <article
                key={item._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-40 h-40 sm:h-28 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-blue-600 text-sm font-medium inline-flex items-center gap-1">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}

          {/* Pagination */}
          {!loading && pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                ‹
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    page === n ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
