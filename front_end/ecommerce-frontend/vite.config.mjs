
// // vite.config.js
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'path'

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': 'http://localhost:5000',  // adjust this port to match your backend
//       '/paypal': 'http://localhost:5000'
//     }
//   },
//   base: '/'
// })
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/paypal': 'http://localhost:5000'
    },
    // Add these settings
    strictPort: true,
    hmr: {
      overlay: false
    },
    // headers: {
    //   'Cache-Control': 'public, max-age=31536000, immutable',
    //   'X-Content-Type-Options': 'nosniff'
    // }
    headers: {
      'Cache-Control': 'public, max-age=600', // 10 minutes for dev
      'X-Accel-Expires': '0' // Disable proxy caching
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  publicDir: 'public',
  base: '/',
  // Prevent HTML5 history fallback
  appType: 'spa'
})