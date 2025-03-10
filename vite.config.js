import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Bind the server to all network interfaces
    port: 5174,         // You can specify a port of your choice
  },
})
