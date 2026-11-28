// Blog posts are Markdown files in src/blog/. Drop a new .md file in that folder,
// push to GitHub, and the site rebuilds and lists it automatically (newest first).
//
// ---
// title: My post
// date: 2026-12-01
// summary: One line shown on the card.
// tags: Japan, Life
// ---
// Post body in Markdown…

export type Post = { slug: string; title: string; date: string; summary: string; tags: string[]; body: string }

const files = import.meta.glob('./blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parse(path: string, raw: string): Post {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':')
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    }
  }
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    summary: meta.summary || '',
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    body: m ? m[2] : raw,
  }
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .filter((p) => !p.date || p.date <= new Date().toISOString().slice(0, 10)) // future-dated posts publish on their day
  .sort((a, b) => b.date.localeCompare(a.date))
