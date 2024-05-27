import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from "vite-plugin-dts";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  publicDir: false,
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mui-tiptap-editor',
      // the proper extensions will be added
      fileName: 'index',
      formats: ["es"],
      // formats: ["es", "cjs", "umd"],
      // fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@emotion/react'],
  },
  server: {
    open: true,
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    dts({ rollupTypes: true }),
    tsconfigPaths(),
  ],
})
