import Lenis from 'lenis'
import { motion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import Projects from './components/Projects'
import { profile } from './content'
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

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-10">
        <a href="#top" className="font-mono text-sm font-medium tracking-tight">
          utsab<span className="text-crimson">.</span>karki
        </a>
        <nav className="flex items-center gap-1 rounded-full border border-line bg-ink/60 p-1 font-mono text-xs backdrop-blur-md">
          {['work', 'about', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} className="rounded-full px-3 py-1.5 text-mist transition-colors hover:bg-snow/10 hover:text-snow">
              {id}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="relative z-10">
        <section className="flex min-h-svh flex-col justify-end bg-linear-to-t from-ink/85 via-ink/25 to-transparent px-5 pb-10 pt-28 sm:px-10 sm:pb-14">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
            <p className="label mb-4">
              <span className="font-['Noto_Sans_Devanagari'] text-sm normal-case tracking-normal text-snow">नमस्ते</span> — I’m
            </p>
            <h1 className="text-[clamp(3.6rem,15vw,13rem)] font-extrabold leading-[0.82] tracking-[-0.045em]">
              {first}
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-snow)]">{rest.join(' ')}</span>
              <span className="text-crimson">.</span>
            </h1>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lg leading-snug text-snow/85 sm:text-xl">{profile.tagline}</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#work" className="rounded-full bg-snow px-5 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5">
                  View work ↓
                </a>
                <a href={githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-snow/30 bg-ink/40 px-5 py-3 font-semibold backdrop-blur-md transition-colors hover:border-crimson hover:text-crimson">
                  GitHub ↗
                </a>
              </div>
            </div>
            <div className="label mt-10 flex justify-between border-t border-snow/15 pt-4">
              <span>
                {profile.role} · {profile.location}
              </span>
              <span className="hidden sm:inline">{profile.coords}</span>
              <span>Scroll</span>
            </div>
          </motion.div>
        </section>

        <section id="work" className="scroll-mt-20 px-5 py-24 sm:px-10 sm:py-32">
          <motion.div {...rise} className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="label mb-3">01 — Work</p>
              <h2 className="text-5xl font-extrabold tracking-tight sm:text-7xl">Things I’ve built</h2>
            </div>
            <a href={`${githubUrl}?tab=repositories`} target="_blank" rel="noreferrer" className="label hidden whitespace-nowrap hover:text-crimson sm:block">
              All repositories ↗
            </a>
          </motion.div>
          <Projects />
        </section>

        <section id="about" className="scroll-mt-20 px-5 py-24 sm:px-10 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <motion.div {...rise}>
              <p className="label mb-3">02 — About</p>
              <h2 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
                Building for the web, from the <span className="text-crimson">roof of the world</span>.
              </h2>
            </motion.div>
            <motion.div {...rise} className="rounded-2xl border border-line bg-panel/70 p-6 backdrop-blur-md sm:p-8">
              {profile.about.map((p) => (
                <p key={p} className="mb-5 text-lg leading-relaxed text-snow/85">
                  {p}
                </p>
              ))}
              <Chips title="Working with" items={profile.workingWith} accent />
              <Chips title="This site runs on" items={profile.builtWith} />
            </motion.div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 px-5 pb-10 pt-24 sm:px-10 sm:pt-32">
          <motion.div {...rise}>
            <p className="label mb-3">03 — Contact</p>
            <h2 className="text-[clamp(3rem,11vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.04em]">
              Let’s build
              <br />
              something<span className="text-crimson">.</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={githubUrl} target="_blank" rel="noreferrer" className="rounded-full bg-crimson px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5">
                Find me on GitHub ↗
              </a>
            </div>
          </motion.div>
          <footer className="label mt-24 flex flex-wrap justify-between gap-3 border-t border-snow/15 pt-5">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>{profile.domain}</span>
            <a href="#top" className="hover:text-crimson">
              Back to top ↑
            </a>
          </footer>
        </section>
      </main>
    </>
  )
}

function Chips({ title, items, accent }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="label mb-3">{title}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((s) => (
          <li key={s} className={`rounded-full border px-3 py-1 font-mono text-xs ${accent ? 'border-crimson/50 text-snow' : 'border-line text-mist'}`}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
