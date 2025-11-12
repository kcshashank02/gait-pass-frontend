import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // ✅ Must be '/' for Vercel
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 3000,
    open: true
  }
})
