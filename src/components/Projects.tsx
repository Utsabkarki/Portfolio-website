import { motion } from 'motion/react'
import { useEffect, useState, type PointerEvent } from 'react'
import { fallbackProjects, hiddenRepos, profile, type Project } from '../content'

type Repo = {
  name: string
  description: string | null
  language: string | null
  html_url: string
  homepage: string | null
  pushed_at: string
  fork: boolean
}

const CACHE_KEY = 'projects-v1'

function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) return JSON.parse(cached) as Project[]
    } catch {
      /* storage unavailable */
    }
    return fallbackProjects
  })

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${profile.github}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Repo[]>) : Promise.reject(new Error(String(r.status)))))
      .then((repos) => {
        const list = repos
          .filter((r) => !r.fork && !hiddenRepos.includes(r.name))
          .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            url: r.html_url,
            homepage: r.homepage || null,
            pushedAt: r.pushed_at,
          }))
        if (!list.length) return
        setProjects(list)
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(list))
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => {
        /* keep the fallback list */
      })
    return () => ctrl.abort()
  }, [])

  return projects
}

const pretty = (name: string) => name.replace(/[-_]+/g, ' ')
const when = (iso: string) => new Date(iso).toLocaleDateString('en', { month: 'short', year: 'numeric' })

function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`)
  el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`)
  el.style.setProperty('--gx', `${x * 100}%`)
  el.style.setProperty('--gy', `${y * 100}%`)
}

function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--ry', '0deg')
  e.currentTarget.style.setProperty('--rx', '0deg')
}

export default function Projects() {
  const projects = useProjects()
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <motion.li
          key={p.name}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <a
            href={p.homepage ?? p.url}
            target="_blank"
            rel="noreferrer"
            onPointerMove={tilt}
            onPointerLeave={untilt}
            className="tilt group relative flex h-full min-h-52 flex-col justify-between rounded-2xl border border-line bg-panel/70 p-6 backdrop-blur-md hover:border-crimson/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
          >
            <div className="flex items-start justify-between" style={{ transform: 'translateZ(30px)' }}>
              <span className="label">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-xl text-mist transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-crimson" aria-hidden>
                ↗
              </span>
            </div>
            <div style={{ transform: 'translateZ(45px)' }}>
              <h3 className="text-2xl font-semibold capitalize leading-tight wrap-anywhere">{pretty(p.name)}</h3>
              {p.description && <p className="mt-2 text-mist">{p.description}</p>}
              <p className="label mt-4 flex gap-3">
                {p.language && <span className="text-azure">{p.language}</span>}
                <span>{when(p.pushedAt)}</span>
              </p>
            </div>
          </a>
        </motion.li>
      ))}
    </ul>
  )
}
