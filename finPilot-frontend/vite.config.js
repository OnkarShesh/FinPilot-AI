import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_TARGET || 'https://finpilot-ai-4ygw.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
