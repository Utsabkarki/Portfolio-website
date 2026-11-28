import { useEffect, useState } from 'react'

type Item = { title: string; link: string; date: string | null; summary: string; topic: string; source: string }
type Feed = { updatedAt: string | null; items: Item[] }

function ago(iso: string | null) {
  if (!iso) return ''
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  return `${Math.round(h / 24)} d ago`
}

// Headlines come from public/news.json, which the GitHub Action regenerates
// every few hours (scripts/fetch-news.mjs).
export default function News() {
  const [feed, setFeed] = useState<Feed | null>(null)
  const [failed, setFailed] = useState(false)
  const [topic, setTopic] = useState('All')

  useEffect(() => {
    fetch('/news.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setFeed)
      .catch(() => setFailed(true))
  }, [])

  const topics = ['All', ...new Set(feed?.items.map((i) => i.topic) ?? [])]
  const shown = (feed?.items ?? []).filter((i) => topic === 'All' || i.topic === topic).slice(0, 8)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="News topics">
          {topics.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={t === topic}
              onClick={() => setTopic(t)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${t === topic ? 'bg-snow font-semibold text-ink' : 'border border-line text-mist hover:text-snow'}`}
            >
              {t}
            </button>
          ))}
        </div>
        {feed?.updatedAt && (
          <span className="label flex items-center gap-2">
            <span className="inline-block size-2 animate-pulse rounded-full bg-pine shadow-[0_0_8px_var(--color-pine)]" />
            Auto-updated {ago(feed.updatedAt)}
          </span>
        )}
      </div>

      {!feed && !failed && (
        <ul className="space-y-2" aria-hidden>
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="h-16 animate-pulse rounded-xl bg-panel-2/70" />
          ))}
        </ul>
      )}
      {(failed || (feed && feed.items.length === 0)) && (
        <p className="rounded-xl border border-dashed border-line p-5 text-mist">Fresh headlines are on their way — this section refreshes itself every few hours.</p>
      )}

      <ul className="divide-y divide-line">
        {shown.map((n) => (
          <li key={n.link}>
            <a href={n.link} target="_blank" rel="noreferrer noopener" className="group block py-3.5">
              <div className="label flex gap-3">
                <span className="text-gold">{n.topic}</span>
                <span>{n.source}</span>
                {n.date && <span>{ago(n.date)}</span>}
              </div>
              <p className="mt-1 font-semibold leading-snug group-hover:text-gold">
                {n.title} <span className="text-mist">↗</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
