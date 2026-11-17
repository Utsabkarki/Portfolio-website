# utsabkarki.com.np

Personal site of Utsab Karki. A real-time 3D mountain landscape (custom shaders) behind a two-page profile, built with React 19, Three.js (React Three Fiber), TypeScript, Vite 8 and Tailwind 4.

## Develop

```bash
npm install
npm run dev
```

## Edit the content

All text, links, education, experience and skills live in `src/content.ts`. Photos are in `src/assets`.

## Pages

- `/` — home (`src/pages/Home.tsx`)
- `/about` — about (`src/pages/About.tsx`)

Navigation is client-side (`src/router.tsx`) and animated with the View Transitions API. Press Ctrl/⌘ + K for the command palette.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The custom domain is set by `public/CNAME`.
