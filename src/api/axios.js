import axios from 'axios'

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// Falls back to localhost:5000 for local development if not set.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // sends the httpOnly auth cookie on every request
})

export default api
