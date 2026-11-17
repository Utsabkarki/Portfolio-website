import { motion } from 'motion/react'
import portrait from '../assets/portrait.webp'
import { btn, Contact, mailto, rise, Section, Timeline } from '../components/ui'
import { education, experience, profile, skills } from '../content'
import { Link } from '../router'

const [first, ...rest] = profile.name.split(' ')

export default function Home() {
  return (
    <>
      <section className="flex min-h-svh flex-col justify-end px-5 pb-10 pt-28 sm:px-10 sm:pb-14">
        <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
          <p className="label mb-5 flex items-center gap-3 text-paper/80">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {profile.role}
          </p>
          <h1 className="font-serif text-[clamp(4.2rem,15vw,13rem)] leading-[0.84] tracking-[-0.02em]">
            {first} <em className="text-accent">{rest.join(' ')}</em>
          </h1>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg text-lg leading-snug text-paper/85 sm:text-xl">{profile.tagline}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/about" className={btn.primary}>
                About me →
              </Link>
              <a href={mailto} className={btn.ghost}>
                Get in touch
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <Section index="01" title="Introduction">
        <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-[1fr_minmax(0,14rem)]">
          <div>
            <p className="font-serif text-3xl leading-tight sm:text-5xl">{profile.about[0]}</p>
            <Link href="/about" className="mt-8 inline-block border-b border-accent pb-1 font-medium transition-colors hover:text-accent">
              Read the full story →
            </Link>
          </div>
          <Link href="/about" aria-label="About Utsab Karki" className="group block overflow-hidden rounded-2xl border border-line">
            <img src={portrait} alt="Utsab Karki" width={840} height={1040} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </Link>
        </motion.div>
      </Section>

      <Section id="experience" index="02" title="Experience">
        <div className="grid gap-5 md:grid-cols-2">
          <Timeline heading="Education" entries={education} />
          <Timeline heading="Work experience" entries={experience} />
        </div>
      </Section>

      <Section id="skills" index="03" title="Skills">
        <motion.div {...rise} className="glass divide-y divide-line rounded-2xl px-6 sm:px-8">
          {skills.map((s) => (
            <div key={s.group} className="grid gap-3 py-6 sm:grid-cols-[11rem_1fr] sm:items-center">
              <h3 className="font-semibold">{s.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <li key={item} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-paper/85">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </Section>

      <Contact index="04" />
    </>
  )
}
