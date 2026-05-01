import axios from 'axios';

// In development: VITE_API_URL = http://localhost:5000 (from .env)
// In production:  VITE_API_URL = https://your-backend.vercel.app (set in Vercel dashboard)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
