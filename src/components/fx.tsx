import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { lazy, Suspense, Component, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

const ease = [0.2, 0.7, 0.2, 1] as const

export const rise = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease },
} as const

/** Headline that slides up word by word. Wrap a word in *asterisks* to accent it. */
export function Reveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text.replaceAll('*', '')}>
      {text.split(' ').map((word, i) => {
        const accent = word.startsWith('*')
        const clean = word.replaceAll('*', '')
        return (
          <span key={i} aria-hidden className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block pr-[0.22em]"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: delay + i * 0.07, ease }}
            >
              {accent ? <em className="text-accent">{clean}</em> : clean}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

/** Pulls its child toward the pointer, then springs back. */
export function Magnetic({ children }: { children: ReactNode }) {
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 })
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }
  return (
    <motion.div className="inline-block" style={{ x, y }} onPointerMove={move} onPointerLeave={() => (x.set(0), y.set(0))}>
      {children}
    </motion.div>
  )
}

/** Bento card: rises into view and tracks the pointer for its spotlight. */
export function Card({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const track = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div
      {...rise}
      transition={{ ...rise.transition, delay }}
      whileHover={{ y: -4 }}
      onPointerMove={track}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  )
}

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {children}
    </motion.span>
  )
}

/** Paragraph whose words light up as it scrolls through the viewport. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" aria-hidden>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <li key={i} className="flex items-center gap-8 pr-8 text-2xl font-medium tracking-tight text-paper/40 sm:text-3xl">
                {item}
                <span className="size-1.5 rounded-full bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

const Scene = lazy(() => import('./Scene'))

// If WebGL is unavailable the frame keeps its gradient sky instead.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** The live 3D landscape, rendered only while it is on screen. */
export function SceneFrame() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting))
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="sky-fallback pointer-events-none absolute inset-0" aria-hidden>
      <SceneBoundary>
        <Suspense fallback={null}>
          <Scene active={active} />
        </Suspense>
      </SceneBoundary>
      <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-ink/30" />
    </div>
  )
}
