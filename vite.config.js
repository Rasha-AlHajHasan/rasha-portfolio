import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages answers unknown paths (e.g. a refresh on /rasha-portfolio/projects) with
// 404.html. Shipping a copy of index.html under that name lets React Router
// render the requested page instead of GitHub's error page.
function spaFallback() {
  let outDir

  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), spaFallback()],
  // Built site lives at https://rasha-alhajhasan.github.io/rasha-portfolio/
  // `npm run dev` keeps serving from http://localhost:5173/
  base: command === 'serve' && !isPreview ? '/' : '/rasha-portfolio/',
}))
