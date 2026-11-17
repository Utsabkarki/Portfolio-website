import Lenis from 'lenis'
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import CommandPalette from './components/CommandPalette'
import { profile } from './content'
import About from './pages/About'
import Home from './pages/Home'
import { Link, usePath } from './router'
import { bindInput, input, scroller } from './store'

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

function useLocalTime() {
  const format = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timeZone }).format(new Date())
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
]

export default function App() {
  const path = usePath()
  const time = useLocalTime()
  const [palette, setPalette] = useState(false)
  const isAbout = path === '/about'

  useEffect(() => {
    input.page = isAbout ? 1 : 0
    document.title = isAbout ? `About — ${profile.name}` : `${profile.name} — Student, Developer & Editor`
  }, [isAbout])

  useEffect(() => {
    const unbind = bindInput()
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    let lenis: Lenis | undefined
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const l = (lenis = new Lenis({ autoRaf: true }))
      scroller.to = (target, immediate) => l.scrollTo(target, { immediate, offset: typeof target === 'number' ? 0 : -72 })
    }
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    return () => {
      lenis?.destroy()
      window.removeEventListener('keydown', onKey)
      unbind()
    }
  }, [])

  return (
    <>
      <div className="progress" aria-hidden />
      <div className="scene" aria-hidden>
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      </div>
      <div className="veil" aria-hidden />

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-linear-to-b from-ink/90 via-ink/60 to-transparent px-5 pb-8 pt-4 sm:px-10">
        <Link href="/" className="font-serif text-2xl leading-none">
          Utsab Karki<span className="text-accent">.</span>
        </Link>
        <nav className="glass flex items-center gap-1 rounded-full p-1 text-sm">
          {nav.map((n) => {
            const current = n.href === path
            return (
              <Link key={n.href} href={n.href} aria-current={current ? 'page' : undefined} className={`rounded-full px-3.5 py-1.5 transition-colors hover:text-paper ${current ? 'bg-white/10 text-paper' : 'text-mist'} ${n.href.includes('#') ? 'hidden sm:block' : ''}`}>
                {n.label}
              </Link>
            )
          })}
          <button type="button" onClick={() => setPalette(true)} aria-label="Open command palette" className="hidden rounded-full px-3 py-1.5 font-mono text-xs text-mist transition-colors hover:text-paper sm:block">
            ⌘K
          </button>
          <Link href={`${path}#contact`} className="rounded-full bg-paper px-3.5 py-1.5 font-semibold text-ink">
            Contact
          </Link>
        </nav>
      </header>

      <main key={path} className="relative z-10 mx-auto max-w-7xl">
        {isAbout ? <About /> : <Home />}
      </main>

      <footer className="label relative z-10 mx-auto mt-16 flex max-w-7xl flex-wrap justify-between gap-3 border-t border-line px-5 py-6 sm:px-10">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>
          {profile.location} · {time} JST
        </span>
        <button type="button" onClick={() => scroller.to(0)} className="label cursor-pointer hover:text-paper">
          Back to top ↑
        </button>
      </footer>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  )
}
