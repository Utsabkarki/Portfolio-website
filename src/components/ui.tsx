import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { profile, type Entry } from '../content'

export const rise = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
} as const

export const mailto = `mailto:${profile.email}`
export const githubUrl = `https://github.com/${profile.github}`

export const btn = {
  primary: 'inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5',
  ghost: 'glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors hover:border-white/40',
}

export function Section({ id, index, title, children }: { id?: string; index: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="px-5 py-16 sm:px-10 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <motion.div {...rise} className="flex items-baseline gap-4 lg:block">
          <p className="label lg:mb-2">{index}</p>
          <h2 className="font-serif text-3xl leading-none">{title}</h2>
        </motion.div>
        <div>{children}</div>
      </div>
    </section>
  )
}

export function Timeline({ heading, entries }: { heading: string; entries: Entry[] }) {
  return (
    <motion.div {...rise} className="glass rounded-2xl p-6 sm:p-8">
      <p className="label mb-6">{heading}</p>
      <ul className="space-y-8">
        {entries.map((e) => (
          <li key={e.title + e.place} className="border-l border-accent pl-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-lg font-semibold">{e.title}</h3>
              {e.period && <span className="label">{e.period}</span>}
            </div>
            <p className="mt-1 text-sm text-accent">{e.place}</p>
            <p className="mt-3 leading-relaxed text-paper/70">{e.detail}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function Contact({ index }: { index: string }) {
  return (
    <section id="contact" className="px-5 pt-16 sm:px-10 sm:pt-24">
      <motion.div {...rise} className="glass rounded-3xl p-7 sm:p-14">
        <p className="label mb-4">{index} — Contact</p>
        <h2 className="font-serif text-5xl leading-[0.95] sm:text-8xl">
          Let’s work <em className="text-accent">together</em>.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper/75">Open to internships, part-time work and editing or web projects. The fastest way to reach me is email.</p>
        <a href={mailto} className="mt-8 inline-block break-all text-xl font-medium underline decoration-accent decoration-1 underline-offset-8 transition-colors hover:text-accent sm:text-3xl">
          {profile.email}
        </a>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={mailto} className={btn.primary}>
            Send an email
          </a>
          <a href={githubUrl} target="_blank" rel="noreferrer" className={btn.ghost}>
            GitHub ↗
          </a>
        </div>
      </motion.div>
    </section>
  )
}
