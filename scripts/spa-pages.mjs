// GitHub Pages has no SPA fallback, so give each client-side route a real file.
// When REDIRECT_TO is set, every page instead forwards visitors to that site.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'

const target = process.env.REDIRECT_TO
const redirect = (url) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Utsab Karki</title>
<meta name="robots" content="noindex" />
<link rel="canonical" href="${url}" />
<meta http-equiv="refresh" content="0; url=${url}" />
<style>html{background:#09090a;color:#f5f3ee;font-family:system-ui,sans-serif}a{color:#f0a868}</style>
</head>
<body><p style="text-align:center;margin-top:40vh">Redirecting to <a href="${url}">${url}</a>…</p></body>
</html>
`

for (const route of ['about']) mkdirSync(`dist/${route}`, { recursive: true })
if (target) {
  for (const file of ['index.html', '404.html', 'about/index.html']) writeFileSync(`dist/${file}`, redirect(target))
} else {
  copyFileSync('dist/index.html', 'dist/about/index.html')
  copyFileSync('dist/index.html', 'dist/404.html')
}
