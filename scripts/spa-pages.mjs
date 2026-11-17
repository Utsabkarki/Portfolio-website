// GitHub Pages has no SPA fallback; serve the app for unknown paths too.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
