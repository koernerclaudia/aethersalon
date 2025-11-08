import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // For Vercel deployments the site is served from the root.
  // Use '/' here. If you build for GitHub Pages, use the `build:gh` script which passes a base.
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
  },
})
