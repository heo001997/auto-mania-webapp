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
    plugins: [react()],
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'opencv-js-4.5.0.js') {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    copyPublicDir: true,
    assetsInlineLimit: 0
  },
  optimizeDeps: {
    exclude: ['opencv-js-4.5.0.js']
  }
})

