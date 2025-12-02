import { defineConfig } from 'vite'

export default defineConfig({
  base: '/buying-webxr/',
  root: 'public',
  publicDir: false,
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    copyPublicDir: false
  }
})
