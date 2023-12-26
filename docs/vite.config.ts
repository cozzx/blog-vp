// vite.config.ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/blog-vp/',
  plugins: [
    UnoCSS(),
  ],
  server: {
    host: '0.0.0.0'
  }
})