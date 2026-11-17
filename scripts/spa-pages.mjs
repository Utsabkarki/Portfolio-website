// GitHub Pages has no SPA fallback, so give each client-side route a real file.
import { copyFileSync, mkdirSync } from 'node:fs'

for (const route of ['about']) {
  mkdirSync(`dist/${route}`, { recursive: true })
  copyFileSync('dist/index.html', `dist/${route}/index.html`)
}
copyFileSync('dist/index.html', 'dist/404.html')
