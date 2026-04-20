import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/term-3-project/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})