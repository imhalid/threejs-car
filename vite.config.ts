import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
  },
publicDir: 'assets',
  plugins: [
    glsl(),
  ],
})
