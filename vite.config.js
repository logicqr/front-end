import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5174,
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    // The heavy libraries are lazy chunks; warn only when something unexpected grows.
    chunkSizeWarningLimit: 450,
    rollupOptions: {
      output: {
        /**
         * Keep the libraries that rarely change in their own long-cached
         * chunks, so a content edit does not invalidate them for returning
         * visitors. Charts, PDF export and animation only load on the routes
         * that use them.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/react-router')) return 'react';
          if (id.includes('/recharts') || id.includes('/d3-')) return 'charts';
          if (id.includes('/jspdf') || id.includes('/html2canvas') || id.includes('/canvg')) return 'pdf';
          if (id.includes('/gsap') || id.includes('/lenis')) return 'motion';
          if (id.includes('/framer-motion')) return 'framer';
          return undefined;
        },
      },
    },
  },

  esbuild: {
    // Leftover debugging output should not reach production, and each of
    // these used to ship: 30 console calls in the frontend source.
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.debug'] : [],
  },
});
