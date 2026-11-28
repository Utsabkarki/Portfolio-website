import { motion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import { profile } from './content'
import { bindInput } from './store'

const Scene = lazy(() => import('./components/Scene'))

export type Page = 'home' | 'blog' | 'nihongo'

export const rise = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
} as const

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

const links: { href: string; name: string; page?: Page }[] = [
  { href: '/#story', name: 'Story' },
  { href: '/blog/', name: 'Blog', page: 'blog' },
  { href: '/nihongo/', name: '日本語', page: 'nihongo' },
]

// Snow scene, header and footer shared by every page.
export function Layout({ page, children }: { page: Page; children: ReactNode }) {
  useEffect(() => bindInput(), [])
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
        <div className="flex items-center justify-between px-5 py-3 sm:px-10">
          <a href="/" className="text-sm font-semibold tracking-tight">
            Utsab Karki
          </a>
          <nav className="flex items-center gap-1 rounded-full border border-line bg-ink/70 p-1 text-sm backdrop-blur-md">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={l.page === page ? 'page' : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors sm:px-3.5 ${l.page === page ? 'bg-panel-2 text-snow' : 'text-mist hover:text-snow'} ${l.page ? '' : 'hidden sm:block'}`}
              >
                {l.name}
              </a>
            ))}
            <a href="/#contact" className="rounded-full bg-snow px-3 py-1.5 font-semibold text-ink sm:px-3.5">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-7xl px-5 sm:px-10">
        {children}
        <footer className="mt-16 flex flex-wrap justify-between gap-3 border-t border-line pb-10 pt-5 text-sm text-mist">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Lumbini → {profile.location}</span>
          <a href="#top" className="hover:text-snow">
            Back to top ↑
          </a>
        </footer>
      </main>
    </>
  )
}

export function PageHead({ kicker, title, intro }: { kicker: string; title: ReactNode; intro?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }} className="pb-14 pt-36 sm:pt-44">
      <p className="jp mb-3 text-sm text-berry">{kicker}</p>
      <h1 className="serif text-[clamp(3rem,9vw,7rem)] leading-[0.95]">{title}</h1>
      {intro && <p className="mt-6 max-w-xl text-lg text-snow/75">{intro}</p>}
    </motion.div>
  )
}

export function Node({ tag, children, className = '' }: { tag: string; children: ReactNode; className?: string }) {
  return (
    <motion.div {...rise} className={`frame p-6 sm:p-7 ${className}`}>
      <span className="frame-tag">{tag}</span>
      {children}
    </motion.div>
  )
}
