# utsabkarki.com.np

Personal site of Utsab Karki — a Christmas-themed portfolio with a 3D snowy backdrop, built with React 19, Three.js (React Three Fiber), TypeScript, Vite 8 and Tailwind 4.

## Sections

- **Past** — introduction, a map of Nepal pinned at Lumbini, education.
- **Photo** — a drag-to-spin 3D photo ring.
- **Now** — Japan timeline, skills, work experience.
- **Blog** — Markdown posts from `src/blog/`.
- **What's happening in the world** — headlines refreshed automatically every 3 hours.
- **10 Japanese words a day** — a new set at midnight Japan time, with quiz mode and pronunciation.
- **Contact** — a form that emails you without showing your address.

## Edit

- Text: `src/content.ts`. Photos: `src/assets`.
- New blog post: add `src/blog/YYYY-MM-DD-title.md` with `title`, `date`, `summary`, `tags` front matter and push. Posts dated in the future go live on their day.
- Japanese words: `src/data/japanese.ts`.
- News sources: `scripts/fetch-news.mjs`.
- Contact form: paste a free [Web3Forms](https://web3forms.com) access key into `contact.web3formsKey` in `src/content.ts`.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Every push to `main`, and a schedule every 3 hours, fetches fresh news, builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The custom domain is set by `public/CNAME`.
