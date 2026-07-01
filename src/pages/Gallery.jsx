import { useEffect, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import api from '../api/axios'

const categories = ['All', 'Events', 'Campus', 'Sports', 'Cultural', 'Workshops']

export default function Gallery() {
  const [active, setActive] = useState('All')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/gallery', { params: { category: active } })
        setImages(data.images)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load gallery images.')
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [active])

  return (
    <div>
      <Breadcrumb title="Gallery" trail={[{ label: 'Gallery' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                active === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {loading && (
          <div className="text-center text-gray-400 text-sm py-12">Loading gallery...</div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="text-center text-gray-400 text-sm py-12">
            No images in this category yet.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer relative"
            >
              <img
                src={img.image}
                alt={img.caption || img.category}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
