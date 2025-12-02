import { defineConfig } from 'vite'

export default defineConfig({
  base: '/buying-webxr/',
  root: 'public',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
