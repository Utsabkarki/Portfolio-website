import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      // One HTML file per page so GitHub Pages serves /blog/ and /nihongo/ directly.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        blog: resolve(import.meta.dirname, 'blog/index.html'),
        nihongo: resolve(import.meta.dirname, 'nihongo/index.html'),
      },
    },
  },
})
