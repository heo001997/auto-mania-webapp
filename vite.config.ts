import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: {
    format: 'es',
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es'
      },
      external: ['/lib/opencv-js-4.5.0.js']
    },
    copyPublicDir: true,
    assetsInlineLimit: 0
  },
  optimizeDeps: {
    exclude: ['opencv-js-4.5.0.js']
  }
})

