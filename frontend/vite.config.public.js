import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Production build config for the PUBLIC website (sensongrid.com)
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist-public',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index-public.html'),
    },
  },
})
