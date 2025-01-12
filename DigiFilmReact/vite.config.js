import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Add your repository name here
  build: {
    outDir: 'dist', // Ensure this matches your output directory
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost-cert.pem')),
    },
    host: 'localhost',
    port: 5173, // Ensure this matches your frontend port
  },
});
