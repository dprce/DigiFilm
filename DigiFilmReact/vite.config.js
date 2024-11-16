import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/DigiFilm/', // Add your repository name here
  build: {
    outDir: 'dist', // Ensure this matches your output directory
  },
})
