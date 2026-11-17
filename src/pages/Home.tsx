import { motion, useScroll, useTransform } from 'motion/react'
import fireworks1 from '../assets/fireworks-1.webp'
import portrait from '../assets/portrait.webp'
import { Card, Magnetic, Marquee, Reveal, ScrollText, SceneFrame } from '../components/fx'
import { btn, Contact, Heading, useLocalTime } from '../components/ui'
import { education, experience, profile, skills } from '../content'
import { Link } from '../router'

export default function Home() {
  const time = useLocalTime()
  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 800], [1, 0.92])
  const fade = useTransform(scrollY, [0, 500], [1, 0])
  const lift = useTransform(scrollY, [0, 800], [0, -90])

  return (
    <>
      <section className="p-3 sm:p-5">
        <motion.div style={{ scale }} className="relative flex h-[calc(100svh-1.5rem)] min-h-[34rem] origin-bottom flex-col justify-end overflow-hidden rounded-[2rem] border border-line sm:h-[calc(100svh-2.5rem)]">
          <SceneFrame />
          <motion.div style={{ opacity: fade, y: lift }} className="relative z-10 p-6 sm:p-12">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="glass mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm">
              <span className="size-2 animate-pulse-dot rounded-full bg-emerald-300" />
              {profile.role}
            </motion.p>
            <h1 className="display text-[clamp(3.4rem,13.5vw,12.5rem)] leading-[0.86]">
              <Reveal text="Utsab *Karki*" delay={0.15} />
            </h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lg leading-snug text-paper/80 sm:text-xl">{profile.tagline}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link href="/about" className={btn.primary}>
                    About me →
                  </Link>
                </Magnetic>
                <Link href="/#contact" className={btn.ghost}>
                  Get in touch
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Marquee items={skills.flatMap((s) => s.items)} />

      <section id="experience" className="px-3 pt-10 sm:px-5 sm:pt-16">
        <Heading index="01 — Profile">
          At a <em className="text-accent">glance</em>
        </Heading>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4">
          <Card className="group min-h-[26rem] md:col-span-2 lg:row-span-2">
            <Link href="/about" className="absolute inset-0 z-10 flex flex-col justify-end p-7 sm:p-9" aria-label="About Utsab Karki">
              <p className="label mb-3 text-paper/70">About</p>
              <p className="max-w-md text-2xl font-medium leading-tight tracking-tight sm:text-3xl">{profile.about[0]}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Read the full story <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <img src={portrait} alt="" width={840} height={1040} loading="lazy" className="absolute inset-0 size-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-transparent" />
          </Card>

          <Card className="flex flex-col justify-between p-7" delay={0.05}>
            <p className="label flex items-center gap-2.5">
              <span className="size-2 animate-pulse-dot rounded-full bg-emerald-300" />
              Local time
            </p>
            <div>
              <p className="font-mono text-6xl tracking-tighter tabular-nums">{time}</p>
              <p className="mt-2 text-paper/60">{profile.location} · JST</p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-7" delay={0.1}>
            <p className="label">Education</p>
            <div>
              <p className="text-xl font-medium leading-tight tracking-tight">{education[0].place}</p>
              <p className="mt-2 text-paper/60">
                {education[0].title} · {education[0].period}
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-7" delay={0.05}>
            <p className="label">Experience</p>
            <div>
              <p className="text-3xl font-medium tracking-tight">{experience[0].title}</p>
              <p className="mt-2 leading-snug text-paper/60">{experience[0].detail}</p>
            </div>
          </Card>

          <Card className="group min-h-[17rem]" delay={0.1}>
            <img src={fireworks1} alt="Fireworks over a lake at a summer festival in Japan" width={1050} height={1400} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <p className="label absolute bottom-6 left-7 z-10 text-paper">Life in Japan</p>
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 to-transparent" />
          </Card>

          <Card className="p-7 md:col-span-2 lg:col-span-4 lg:row-span-1" delay={0.05}>
            <div id="skills" className="grid h-full gap-6 sm:grid-cols-3">
              {skills.map((s) => (
                <div key={s.group} className="flex flex-col justify-between gap-4">
                  <p className="label">{s.group}</p>
                  <ul className="flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <li key={item} className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-10 sm:py-40">
        <p className="label mb-6">02 — Approach</p>
        <ScrollText text={profile.about[1]} className="display max-w-5xl text-3xl leading-[1.08] sm:text-6xl" />
      </section>

      <Contact />
    </>
  )
}
