// vite.config.js
// Standard Vite configuration with React plugin for JSX support

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // Enables fast refresh and JSX transform for React
    react(),
  ],
  server: {
    port: 5173,         // Default dev server port
    open: true,         // Auto-open browser on dev start
  },
});
