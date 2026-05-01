import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    root: '.',
    server: {
      proxy: {
        // Dev proxy: forwards /api calls to backend when VITE_API_URL is not set locally
        // In production, api.js uses VITE_API_URL as baseURL directly — no proxy needed
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});