import { defineConfig } from 'vite'

export default defineConfig({
  root: 'www',
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3000,
    open: true,
    strictPort: false
  }
})
