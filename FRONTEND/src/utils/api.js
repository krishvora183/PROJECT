import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Safety check: warn loudly in production if env var is missing
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.error(
    '[API Config ERROR] VITE_API_URL is not set! All API calls will fail. ' +
    'Add VITE_API_URL to your Vercel environment variables and redeploy.'
  );
}

// In development: VITE_API_URL = http://localhost:5000 (from .env)
// In production:  VITE_API_URL = https://your-backend.vercel.app (set in Vercel dashboard)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
