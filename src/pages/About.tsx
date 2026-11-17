import { motion } from 'motion/react'
import fireworks1 from '../assets/fireworks-1.webp'
import fireworks2 from '../assets/fireworks-2.webp'
import portrait from '../assets/portrait.webp'
import { Contact, rise, Section } from '../components/ui'
import { facts, profile, services } from '../content'
import { Link } from '../router'

const photos = [
  { src: fireworks1, alt: 'Fireworks bursting over a lake above a summer festival crowd' },
  { src: fireworks2, alt: 'Fireworks lighting up the night sky over the water' },
]

export default function About() {
  return (
    <>
      <section className="px-5 pb-10 pt-32 sm:px-10 sm:pt-40">
        <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
          <Link href="/" className="label transition-colors hover:text-paper">
            ← Home
          </Link>
          <div className="mt-8 grid items-end gap-10 md:grid-cols-[1fr_minmax(0,22rem)]">
            <div>
              <p className="label mb-4 text-paper/80">About</p>
              <h1 className="font-serif text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.92] tracking-[-0.01em]">
                A student in Kyoto who <em className="text-accent">builds</em> and <em className="text-accent">edits</em>.
              </h1>
            </div>
            <img src={portrait} alt="Utsab Karki standing on an outdoor ice rink in Japan" width={840} height={1040} className="aspect-[4/5] w-full max-w-sm rounded-2xl border border-line object-cover" />
          </div>
        </motion.div>
      </section>

      <section className="px-5 sm:px-10">
        <motion.dl {...rise} className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="p-5 sm:p-6">
              <dt className="label mb-2">{f.label}</dt>
              <dd className="font-medium leading-snug">{f.value}</dd>
            </div>
          ))}
        </motion.dl>
      </section>

      <Section index="01" title="Story">
        <motion.div {...rise} className="max-w-3xl">
          {profile.about.map((p, i) => (
            <p key={p} className={i === 0 ? 'mb-7 font-serif text-3xl leading-tight sm:text-4xl' : 'mb-5 text-lg leading-relaxed text-paper/75'}>
              {p}
            </p>
          ))}
        </motion.div>
      </Section>

      <Section index="02" title="What I do">
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div key={s.title} {...rise} transition={{ ...rise.transition, delay: i * 0.08 }} className="glass rounded-2xl p-6">
              <p className="label mb-10 text-accent">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-paper/70">{s.detail}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section index="03" title="Life in Japan">
        <motion.div {...rise} className="grid grid-cols-2 gap-4 sm:gap-5">
          {photos.map((ph) => (
            <figure key={ph.src} className="overflow-hidden rounded-2xl border border-line">
              <img src={ph.src} alt={ph.alt} width={1050} height={1400} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105" />
            </figure>
          ))}
        </motion.div>
        <p className="label mt-4">Summer fireworks festival — Japan</p>
      </Section>

      <Contact index="04" />
    </>
  )
}
