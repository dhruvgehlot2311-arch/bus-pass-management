// vite.config.js
// Vite build configuration for the Bus Pass Management frontend
// Roll No: 14 | Program 5 — Full Stack Development

import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';

/**
 * Vite Configuration
 *
 * - plugins:  Enables React Fast Refresh (HMR) via the official React plugin.
 * - server.proxy: Forwards any request whose path starts with "/api" to the
 *   Express backend running on port 5000. This avoids CORS issues during
 *   local development (browser only talks to Vite on :5173).
 */
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // frontend dev-server port
    proxy: {
      // Proxy all /api/* requests to the Express backend
      '/api': {
        target:      'http://localhost:5000',
        changeOrigin: true,  // rewrites the Host header to match the target
        secure:       false, // allow self-signed certs in development
      },
    },
  },

  build: {
    outDir:    'dist',   // output directory for production build
    sourcemap: true,     // include source maps for easier debugging
  },
});
