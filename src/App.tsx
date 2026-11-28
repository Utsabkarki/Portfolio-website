import { motion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import fireworks1 from './assets/fireworks-1.webp'
import fireworks2 from './assets/fireworks-2.webp'
import portrait from './assets/portrait.webp'
import Blog from './components/Blog'
import Contact from './components/Contact'
import JapaneseWords from './components/JapaneseWords'
import NepalMap from './components/NepalMap'
import News from './components/News'
import Photo3D from './components/Photo3D'
import { now, past, profile } from './content'
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
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
} as const

const githubUrl = `https://github.com/${profile.github}`

const photos = [
  { src: portrait, alt: 'Utsab Karki standing on an outdoor ice rink in Japan' },
  { src: fireworks1, alt: 'Fireworks bursting over a lake above a summer festival crowd in Japan' },
  { src: fireworks2, alt: 'Fireworks lighting up the night sky over the water in Japan' },
]

function daysToChristmas() {
  const jst = new Date(Date.now() + 9 * 3_600_000)
  const y = jst.getUTCFullYear()
  const today = Date.UTC(y, jst.getUTCMonth(), jst.getUTCDate())
  let xmas = Date.UTC(y, 11, 25)
  if (today > xmas) xmas = Date.UTC(y + 1, 11, 25)
  return Math.round((xmas - today) / 86_400_000)
}

export default function App() {
  useEffect(() => bindInput(), [])
  const xmas = daysToChristmas()

  return (
    <>
      <div className="scene" aria-hidden>
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      </div>
      <div className="canvas-grid" aria-hidden />

      <header className="fixed inset-x-0 top-0 z-30">
        <div className="lights px-2" aria-hidden>
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="flex items-center justify-between px-5 py-3 sm:px-10">
          <a href="#top" className="text-sm font-semibold tracking-tight">
            Utsab Karki <span aria-hidden>🎄</span>
          </a>
          <nav className="flex items-center gap-1 rounded-full border border-line bg-ink/70 p-1 text-sm backdrop-blur-md">
            {[
              ['story', 'Story'],
              ['blog', 'Blog'],
              ['japanese', '日本語'],
            ].map(([id, name]) => (
              <a key={id} href={`#${id}`} className="hidden rounded-full px-3.5 py-1.5 text-mist transition-colors hover:text-snow sm:block">
                {name}
              </a>
            ))}
            <a href="#contact" className="rounded-full bg-snow px-3.5 py-1.5 font-semibold text-ink">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-7xl px-5 sm:px-10">
        {/* ── Title node ─────────────────────────────── */}
        <section className="flex min-h-[88svh] flex-col items-center justify-center pb-10 pt-32 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
            <p className="label mx-auto mb-10 flex w-fit items-center gap-2 rounded-full border border-line bg-panel/70 px-4 py-2 backdrop-blur-md">
              <span className="inline-block size-2 rounded-full bg-pine shadow-[0_0_10px_var(--color-pine)]" />
              {xmas === 0 ? 'Merry Christmas! 🎅' : `${xmas} day${xmas === 1 ? '' : 's'} until Christmas`}
            </p>
            <div className="frame mx-auto inline-block px-6 py-4 sm:px-10 sm:py-6">
              <span className="frame-tag">Frame · My Portfolio</span>
              <h1 className="text-[clamp(3rem,11vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
                My <span className="festive glow text-gold">Portfolio</span>
              </h1>
            </div>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-snug text-snow/85 sm:text-xl">
              <strong className="text-snow">{profile.name}</strong> — {profile.tagline}
            </p>
            <a href="#story" className="mt-8 inline-flex items-center gap-2 rounded-full bg-berry px-6 py-3 font-semibold shadow-[0_0_30px_rgb(229_56_59/0.45)] transition-transform hover:-translate-y-0.5">
              Read my story ↓
            </a>
          </motion.div>
        </section>

        {/* ── Branches: Past · Photo · Now ───────────── */}
        <section id="story" className="scroll-mt-24 pb-24">
          <Branches />
          <div className="mt-4 grid gap-12 lg:grid-cols-3 lg:gap-8">
            {/* PAST */}
            <div className="space-y-12">
              <BranchTitle kicker="Past" title="Introduction" />
              <Node tag="Utsab Karki">
                <p className="text-xl font-semibold leading-snug">{past.intro}</p>
              </Node>
              <Arrow />
              <Node tag="Born · Nepal">
                <p className="label mb-3">{past.born.note}</p>
                <h3 className="mb-4 text-2xl font-bold">{past.born.place}</h3>
                <NepalMap />
              </Node>
              <Arrow />
              <Node tag="Education">
                {past.education.map((e) => (
                  <div key={e.title} className="border-l-2 border-gold pl-4">
                    <h3 className="text-xl font-bold">{e.title}</h3>
                    <p className="text-gold">{e.place}</p>
                    <p className="mt-2 text-snow/75">{e.detail}</p>
                  </div>
                ))}
              </Node>
            </div>

            {/* PHOTO */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <BranchTitle kicker="Photo" title="In 3D" />
              <motion.div {...rise} className="mt-12">
                <Photo3D photos={photos} />
              </motion.div>
            </div>

            {/* NOW */}
            <div className="space-y-12">
              <BranchTitle kicker="Now" title="Life in Japan" />
              {now.timeline.map((t, i) => (
                <div key={t.title} className="space-y-12">
                  {i > 0 && <Arrow />}
                  <Node tag={t.when}>
                    <p className="label text-gold">{t.when}</p>
                    <h3 className="mt-1 text-xl font-bold">{t.title}</h3>
                    <p className="mt-1.5 text-snow/75">{t.detail}</p>
                  </Node>
                </div>
              ))}
              <Arrow />
              <Node tag="Skills">
                <h3 className="mb-4 text-xl font-bold">Skills</h3>
                <ul className="flex flex-wrap gap-2">
                  {now.skills.map((s) => (
                    <li key={s} className="rounded-full border border-line bg-panel-2 px-4 py-2 font-mono text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </Node>
              <Arrow />
              <Node tag="Working experience">
                <p className="label mb-2">Working experience</p>
                {now.work.map((w) => (
                  <div key={w.title}>
                    <h3 className="text-xl font-bold">{w.title} ✂️</h3>
                    <p className="mt-1.5 text-snow/75">{w.detail}</p>
                  </div>
                ))}
              </Node>
            </div>
          </div>
        </section>

        {/* ── Blog + world (the boxed note) ──────────── */}
        <section id="blog" className="scroll-mt-24 py-20">
          <SectionHead kicker="Blog & world" title="Notes, and what’s happening" />
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
            <Node tag="Blog">
              <Blog />
            </Node>
            <Node tag="What’s happening in the world">
              <News />
            </Node>
          </div>
        </section>

        {/* ── Japanese words ────────────────────────── */}
        <section id="japanese" className="scroll-mt-24 py-20">
          <SectionHead kicker="今日の言葉 · Words of the day" title="10 Japanese words, every day" />
          <JapaneseWords />
        </section>

        {/* ── Contact ───────────────────────────────── */}
        <section id="contact" className="scroll-mt-24 pb-10 pt-20">
          <motion.div {...rise} className="frame p-7 sm:p-12">
            <span className="frame-tag">Frame · Contact</span>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <p className="label mb-4">In last —</p>
                <h2 className="text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
                  Contact <span className="festive glow text-gold">me</span>
                </h2>
                <p className="mt-5 max-w-md text-lg text-snow/80">Questions, projects, editing work, or just “konnichiwa” — send a message and it lands privately in my inbox.</p>
                <a href={githubUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block text-gold underline underline-offset-4">
                  github.com/{profile.github} ↗
                </a>
              </div>
              <Contact />
            </div>
          </motion.div>
          <div className="candy mt-16" />
          <footer className="label flex flex-wrap justify-between gap-3 pt-5">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>Lumbini → {profile.location}</span>
            <a href="#top" className="hover:text-snow">
              Back to top ↑
            </a>
          </footer>
        </section>
      </main>
    </>
  )
}

// The connector lines from the title node down to the three branches.
function Branches() {
  return (
    <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="hidden h-20 w-full lg:block" fill="none" aria-hidden>
      <path d="M600 0 V40 M200 40 H1000 M200 40 V90 M600 40 V90 M1000 40 V90" stroke="#4c9dff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="6 6" />
      {[200, 600, 1000].map((x) => (
        <circle key={x} cx={x} cy="88" r="4" fill="#4c9dff" />
      ))}
    </svg>
  )
}

function BranchTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div {...rise} className="text-center">
      <p className="festive text-4xl text-berry">{kicker}</p>
      <h2 className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-mist">{title}</h2>
    </motion.div>
  )
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div {...rise} className="mb-12">
      <p className="label mb-2">{kicker}</p>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
    </motion.div>
  )
}

function Node({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <motion.div {...rise} className="frame p-6 sm:p-7">
      <span className="frame-tag">{tag}</span>
      {children}
    </motion.div>
  )
}

function Arrow() {
  return (
    <div className="-my-8 flex justify-center" aria-hidden>
      <svg width="16" height="36" viewBox="0 0 16 36" fill="none">
        <path d="M8 0 V32 M2 26 L8 33 L14 26" stroke="#f2c14e" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
