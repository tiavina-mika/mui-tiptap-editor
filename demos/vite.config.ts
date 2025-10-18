import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "src"),
      "assets": path.resolve(__dirname, "public")
    },
  },
  server: {
    open: true,
    port: 5174
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
})
