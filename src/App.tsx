import Lenis from 'lenis'
import { motion, MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import CommandPalette from './components/CommandPalette'
import { useLocalTime } from './components/ui'
import { profile } from './content'
import About from './pages/About'
import Home from './pages/Home'
import { Link, usePath } from './router'
import { bindInput, input, scroller } from './store'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
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
    <MotionConfig reducedMotion="user">
      <div className="progress" aria-hidden />

      <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }} className="fixed inset-x-0 top-6 z-40 flex justify-center px-4 sm:top-9">
        <nav className="glass flex items-center gap-1 rounded-full p-1.5 text-sm shadow-2xl shadow-black/40">
          <Link href="/" aria-label="Home" className="mr-1 grid size-9 place-items-center rounded-full bg-accent font-serif text-lg italic text-ink">
            U
          </Link>
          {nav.map((n) => {
            const current = n.href === path
            return (
              <Link key={n.href} href={n.href} aria-current={current ? 'page' : undefined} className={`relative rounded-full px-4 py-2 transition-colors hover:text-paper ${current ? 'text-paper' : 'text-mist'}`}>
                {current && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{n.label}</span>
              </Link>
            )
          })}
          <button type="button" onClick={() => setPalette(true)} aria-label="Open command palette" className="hidden cursor-pointer rounded-full px-3 py-2 font-mono text-xs text-mist transition-colors hover:text-paper sm:block">
            ⌘K
          </button>
          <Link href={`${path}#contact`} className="rounded-full bg-paper px-4 py-2 font-semibold text-ink transition-colors hover:bg-accent">
            Contact
          </Link>
        </nav>
      </motion.header>

      <main key={path} className="mx-auto max-w-[100rem]">
        {isAbout ? <About /> : <Home />}
      </main>

      <footer className="label mx-auto flex max-w-[100rem] flex-wrap justify-between gap-3 px-5 py-8 sm:px-10">
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
    </MotionConfig>
  )
}
