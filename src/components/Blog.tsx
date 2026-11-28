import { marked } from 'marked'

// Posts render Markdown only: raw HTML is dropped and links must be http(s), mailto or on-site.
marked.use({
  renderer: {
    html: () => '',
    link({ href, text }) {
      const safe = /^(https?:|mailto:|\/|#)/i.test(href) ? href.replace(/"/g, '%22') : '#'
      const ext = /^https?:/i.test(safe)
      return `<a href="${safe}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`
    },
    image: () => '',
  },
})
import { useEffect, useMemo, useRef, useState } from 'react'
import { posts, type Post } from '../blog'

const fmt = (d: string) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export default function Blog() {
  const [open, setOpen] = useState<Post | null>(null)
  const dialog = useRef<HTMLDialogElement>(null!)

  // Deep links: /blog/#<slug> opens a post directly.
  useEffect(() => {
    const sync = () => {
      const slug = location.hash.slice(1)
      setOpen(slug ? (posts.find((p) => p.slug === decodeURIComponent(slug)) ?? null) : null)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const html = useMemo(() => (open ? (marked.parse(open.body, { async: false }) as string) : ''), [open])

  const close = () => {
    if (location.hash) history.replaceState(null, '', location.pathname)
    setOpen(null)
  }

  return (
    <div>
      {posts.length === 0 && <p className="text-mist">No posts yet — check back soon.</p>}
      <ul className="space-y-3">
        {posts.map((p, i) => (
          <li key={p.slug}>
            <a
              href={`#${p.slug}`}
              className={`group block rounded-2xl border border-line bg-panel-2/60 p-5 transition-colors hover:border-gold ${i === 0 ? 'sm:p-6' : ''}`}
            >
              <div className="label flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{fmt(p.date)}</span>
                {p.tags.map((t) => (
                  <span key={t} className="text-pine">
                    #{t}
                  </span>
                ))}
                {i === 0 && <span className="rounded-full bg-berry px-2 py-0.5 text-[0.6rem] text-snow">Latest</span>}
              </div>
              <h3 className={`mt-2 font-bold tracking-tight group-hover:text-gold ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{p.title}</h3>
              {p.summary && <p className="mt-1.5 text-snow/70">{p.summary}</p>}
              <span className="mt-3 inline-block text-sm font-semibold text-gold">Read post →</span>
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={close}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto max-h-[88svh] w-[min(42rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border border-line bg-panel p-0 text-snow"
      >
        {open && (
          <article className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <p className="label">{fmt(open.date)}</p>
              <button onClick={close} className="rounded-full border border-line px-3 py-1 text-sm text-mist hover:text-snow" aria-label="Close post">
                ✕
              </button>
            </div>
            <h2 className="serif mt-3 text-4xl sm:text-5xl">{open.title}</h2>
            <div className="my-6 h-px w-16 bg-berry" />
            <div className="prose-post" dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        )}
      </dialog>
    </div>
  )
}
