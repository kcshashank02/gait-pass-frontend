import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // ✅ Must be '/' for Vercel
    server: {
    host: '0.0.0.0',  // This is critical!
    port: 3000
  }
})
