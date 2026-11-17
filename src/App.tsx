import Lenis from 'lenis'
import { motion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import { education, experience, profile, skills, type Entry } from './content'
import fireworks1 from './assets/fireworks-1.webp'
import fireworks2 from './assets/fireworks-2.webp'
import portrait from './assets/portrait.webp'
import { bindInput } from './store'

const Scene = lazy(() => import('./components/Scene'))

// If WebGL is unavailable the page simply renders without the 3D backdrop.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

const rise = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
} as const

const githubUrl = `https://github.com/${profile.github}`
const [first, ...rest] = profile.name.split(' ')

export default function App() {
  useEffect(() => {
    const unbind = bindInput()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return unbind
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    return () => {
      lenis.destroy()
      unbind()
    }
  }, [])

  return (
    <>
      <div className="scene" aria-hidden>
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      </div>

      <svg className="web" viewBox="0 0 200 200" fill="none" stroke="#f4ece0" strokeWidth="0.8" aria-hidden>
        <path d="M200 0 L60 0 M200 0 L80 60 M200 0 L120 110 M200 0 L170 150 M200 0 L200 160" />
        <path d="M180 0 Q184 10 200 14 M150 0 Q160 22 190 34 Q196 36 200 40 M120 0 Q132 34 172 62 Q190 72 200 76 M90 0 Q104 46 152 92 Q180 112 200 118 M66 0 Q78 58 132 120 Q166 150 200 156" />
      </svg>
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-10">
        <a href="#top" className="text-sm font-semibold tracking-tight">
          Utsab Karki<span className="text-crimson"> 🎃</span>
        </a>
        <nav className="flex items-center gap-1 rounded-full border border-line bg-ink/60 p-1 text-sm backdrop-blur-md">
          {['about', 'experience', 'skills', 'photos'].map((id) => (
            <a key={id} href={`#${id}`} className="hidden rounded-full px-3.5 py-1.5 capitalize text-mist transition-colors hover:text-snow sm:block">
              {id}
            </a>
          ))}
          <a href="#contact" className="rounded-full bg-snow px-3.5 py-1.5 font-semibold text-ink">
            Contact
          </a>
        </nav>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-7xl">
        <section className="flex min-h-svh flex-col justify-end px-5 pb-10 pt-28 sm:px-10 sm:pb-14">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
            <p className="label mb-5 flex items-center gap-3">
              <span className="inline-block size-2 rounded-full bg-slime shadow-[0_0_10px_var(--color-slime)]" />
              {profile.role}
            </p>
            <h1 className="text-[clamp(3.4rem,12vw,10rem)] font-extrabold leading-[0.88] tracking-[-0.04em]">
              {first}
              <br />
              <span className="spooky glow text-crimson">{rest.join(' ')}</span>
            </h1>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-lg text-lg leading-snug text-snow/85 sm:text-xl">{profile.tagline}</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#contact" className="rounded-full bg-crimson px-5 py-3 font-semibold text-ink shadow-[0_0_30px_rgb(255_117_24/0.45)] transition-transform hover:-translate-y-0.5">
                  Get in touch
                </a>
                <a href="#about" className="rounded-full border border-snow/30 bg-ink/40 px-5 py-3 font-semibold backdrop-blur-md transition-colors hover:border-snow">
                  About me ↓
                </a>
              </div>
            </div>
            <div className="label mt-10 flex justify-between border-t border-snow/15 pt-4">
              <span>{profile.location}</span>
              <span>Scroll</span>
            </div>
          </motion.div>
        </section>

        <Section id="about" index="01" title="About">
          <motion.div {...rise} className="grid items-start gap-8 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-12">
            <img
              src={portrait}
              alt="Utsab Karki standing on an outdoor ice rink in Japan"
              width={840}
              height={1040}
              loading="lazy"
              className="aspect-[4/5] w-full max-w-xs rounded-2xl border border-line object-cover"
            />
            <div>
              {profile.about.map((p, i) => (
                <p key={p} className={i === 0 ? 'mb-6 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl' : 'max-w-2xl text-lg leading-relaxed text-snow/80'}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </Section>

        <Section id="experience" index="02" title="Education & Experience">
          <div className="grid gap-5 md:grid-cols-2">
            <Timeline heading="Education" entries={education} />
            <Timeline heading="Work experience" entries={experience} />
          </div>
        </Section>

        <Section id="skills" index="03" title="Skills">
          <motion.div {...rise} className="divide-y divide-line border-y border-line">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-3 py-6 sm:grid-cols-[12rem_1fr] sm:items-center">
                <h3 className="font-semibold">{s.group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li key={item} className="rounded-full border border-line bg-panel/70 px-3.5 py-1.5 text-sm text-snow/85 backdrop-blur-md">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </Section>

        <Section id="photos" index="04" title="Life in Japan">
          <motion.div {...rise} className="grid grid-cols-2 gap-4 sm:gap-5">
            {[
              { src: fireworks1, alt: 'Fireworks bursting over a lake above a summer festival crowd' },
              { src: fireworks2, alt: 'Fireworks lighting up the night sky over the water' },
            ].map((ph) => (
              <figure key={ph.src} className="overflow-hidden rounded-2xl border border-line">
                <img src={ph.src} alt={ph.alt} width={1050} height={1400} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105" />
              </figure>
            ))}
          </motion.div>
          <p className="label mt-4">Summer fireworks festival — Japan</p>
        </Section>

        <section id="contact" className="scroll-mt-20 px-5 pb-10 pt-24 sm:px-10 sm:pt-32">
          <motion.div {...rise} className="rounded-3xl border border-line bg-panel/70 p-7 backdrop-blur-md sm:p-14">
            <p className="label mb-4">05 — Contact</p>
            <h2 className="text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              Let’s work <span className="spooky glow text-crimson">together</span>.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-snow/80">Open to internships, part-time work and editing or web projects. The fastest way to reach me is on GitHub.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={githubUrl} target="_blank" rel="noreferrer" className="rounded-full bg-crimson px-6 py-3.5 font-semibold text-ink shadow-[0_0_30px_rgb(255_117_24/0.45)] transition-transform hover:-translate-y-0.5">
                Message me on GitHub ↗
              </a>
            </div>
          </motion.div>
          <footer className="label mt-16 flex flex-wrap justify-between gap-3 border-t border-snow/15 pt-5">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>{profile.location}</span>
            <a href="#top" className="hover:text-snow">
              Back to top ↑
            </a>
          </footer>
        </section>
      </main>
    </>
  )
}

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 px-5 py-20 sm:px-10 sm:py-28">
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <motion.div {...rise}>
          <p className="label mb-2">{index}</p>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </motion.div>
        <div>{children}</div>
      </div>
    </section>
  )
}

function Timeline({ heading, entries }: { heading: string; entries: Entry[] }) {
  return (
    <motion.div {...rise} className="rounded-2xl border border-line bg-panel/70 p-6 backdrop-blur-md sm:p-8">
      <p className="label mb-6">{heading}</p>
      <ul className="space-y-8">
        {entries.map((e) => (
          <li key={e.title + e.place} className="border-l-2 border-crimson pl-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-xl font-semibold">{e.title}</h3>
              {e.period && <span className="label">{e.period}</span>}
            </div>
            <p className="mt-1 text-azure">{e.place}</p>
            <p className="mt-3 leading-relaxed text-snow/75">{e.detail}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
