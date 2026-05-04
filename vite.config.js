import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Clean Vite config - no PWA plugin
export default defineConfig({
  plugins: [react()],
})
