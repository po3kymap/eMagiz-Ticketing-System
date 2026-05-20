import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@'        : fileURLToPath(new URL('./src', import.meta.url)),
      '@js'      : fileURLToPath(new URL('./src/js', import.meta.url)),
      '@css'     : fileURLToPath(new URL('./src/css', import.meta.url)),
      '@views'   : fileURLToPath(new URL('./src/js/views', import.meta.url)),
      '@api'     : fileURLToPath(new URL('./src/js/api', import.meta.url)),
      '@assets'  : fileURLToPath(new URL('./public', import.meta.url)),
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
