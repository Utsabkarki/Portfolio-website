import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import fireworks1 from '../assets/fireworks-1.webp'
import fireworks2 from '../assets/fireworks-2.webp'
import portrait from '../assets/portrait.webp'
import { Card, Reveal, rise, SceneFrame } from '../components/fx'
import { Contact, Heading } from '../components/ui'
import { facts, profile, services } from '../content'
import { Link } from '../router'

export default function About() {
  const gallery = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: gallery, offset: ['start end', 'end start'] })
  const up = useTransform(scrollYProgress, [0, 1], [60, -60])
  const down = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <>
      <section className="p-3 sm:p-5">
        <div className="relative flex min-h-[62svh] flex-col justify-end overflow-hidden rounded-[2rem] border border-line">
          <SceneFrame />
          <div className="relative z-10 p-6 pt-32 sm:p-12 sm:pt-40">
            <Link href="/" className="label transition-colors hover:text-paper">
              ← Home
            </Link>
            <h1 className="display mt-6 max-w-5xl text-[clamp(2.8rem,8vw,7.5rem)]">
              <Reveal text="A student in Kyoto who *builds* and *edits.*" delay={0.1} />
            </h1>
          </div>
        </div>
      </section>

      <section className="grid gap-3 px-3 sm:gap-4 sm:px-5 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <Card className="min-h-[30rem] lg:sticky lg:top-24 lg:h-[36rem]">
          <img src={portrait} alt="Utsab Karki standing on an outdoor ice rink in Japan" width={840} height={1040} className="absolute inset-0 size-full object-cover object-top" />
        </Card>
        <div className="grid gap-3 sm:gap-4">
          <Card className="p-7 sm:p-10">
            <p className="label mb-6">Story</p>
            {profile.about.map((p, i) => (
              <p key={p} className={i === 0 ? 'mb-6 text-2xl font-medium leading-tight tracking-tight sm:text-4xl' : 'mb-4 max-w-2xl text-lg leading-relaxed text-paper/65'}>
                {p}
              </p>
            ))}
          </Card>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {facts.map((f, i) => (
              <Card key={f.label} className="p-6 sm:p-7" delay={i * 0.05}>
                <p className="label mb-8">{f.label}</p>
                <p className="text-lg font-medium leading-snug tracking-tight sm:text-xl">{f.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pt-20 sm:px-5 sm:pt-28">
        <Heading index="01 — Services">
          What I <em className="text-accent">do</em>
        </Heading>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {services.map((s, i) => (
            <Card key={s.title} className="flex min-h-72 flex-col justify-between p-7" delay={i * 0.08}>
              <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</p>
              <div>
                <h3 className="text-2xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/60">{s.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-3 pt-20 sm:px-5 sm:pt-28">
        <Heading index="02 — Gallery">
          Life in <em className="text-accent">Japan</em>
        </Heading>
        <div ref={gallery} className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { src: fireworks1, alt: 'Fireworks bursting over a lake above a summer festival crowd', y: up },
            { src: fireworks2, alt: 'Fireworks lighting up the night sky over the water', y: down },
          ].map((ph) => (
            <motion.figure key={ph.src} {...rise} className="aspect-[3/4] overflow-hidden rounded-[1.75rem] border border-line">
              <motion.img src={ph.src} alt={ph.alt} width={1050} height={1400} loading="lazy" style={{ y: ph.y, scale: 1.2 }} className="size-full object-cover" />
            </motion.figure>
          ))}
        </div>
        <p className="label mt-4">Summer fireworks festival — Japan</p>
      </section>

      <Contact />
    </>
  )
}
