import { motion } from 'motion/react'
import fireworks1 from '../assets/fireworks-1.webp'
import fireworks2 from '../assets/fireworks-2.webp'
import portrait from '../assets/portrait.webp'
import { posts } from '../blog'
import Contact from '../components/Contact'
import NepalMap from '../components/NepalMap'
import Photo3D from '../components/Photo3D'
import { now, past, profile } from '../content'
import { tokyoDay, wordsForDay } from '../data/daily'
import { Layout, Node, rise } from '../ui'

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

export default function Home() {
  const xmas = daysToChristmas()
  const latest = posts[0]
  const today = wordsForDay(tokyoDay(Date.now()))

  return (
    <Layout page="home">
      {/* ── Title node ─────────────────────────────── */}
      <section className="flex min-h-[88svh] flex-col items-center justify-center pb-10 pt-32 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
          <p className="mb-8 text-sm text-mist">
            {xmas === 0 ? 'Merry Christmas' : `${xmas} day${xmas === 1 ? '' : 's'} to Christmas`} · {profile.location}
          </p>
          <h1 className="serif text-[clamp(3.5rem,12vw,9.5rem)] leading-[0.9]">
            My <em className="text-berry">portfolio</em>
          </h1>
          <p className="mx-auto mt-8 max-w-md text-lg leading-snug text-snow/80">
            I’m {profile.name}. {profile.tagline}
          </p>
          <a href="#story" className="mt-10 inline-block border-b border-snow/40 pb-1 text-sm font-semibold transition-colors hover:border-snow">
            Start with my story ↓
          </a>
        </motion.div>
      </section>

      {/* ── Branches: Past · Photo · Now ───────────── */}
      <section id="story" className="scroll-mt-24 pb-24">
        <Branches />
        <div className="mt-4 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* PAST */}
          <div className="space-y-12">
            <BranchTitle kicker="Past" title="Nepal" />
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
            <BranchTitle kicker="Photo" title="Drag to turn it" />
            <motion.div {...rise} className="mt-12">
              <Photo3D photos={photos} />
            </motion.div>
          </div>

          {/* NOW */}
          <div className="space-y-12">
            <BranchTitle kicker="Now" title="Japan" />
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
                  <h3 className="text-xl font-bold">{w.title}</h3>
                  <p className="mt-1.5 text-snow/75">{w.detail}</p>
                </div>
              ))}
            </Node>
          </div>
        </div>
      </section>

      {/* ── Previews of the other pages ───────────── */}
      <section className="grid gap-10 py-20 lg:grid-cols-2 lg:gap-8">
        <Node tag="/blog">
          <p className="label mb-6">Blog</p>
          {latest ? (
            <>
              <p className="text-sm text-mist">Latest post</p>
              <h2 className="serif mt-1 text-4xl">{latest.title}</h2>
              {latest.summary && <p className="mt-3 max-w-md text-snow/75">{latest.summary}</p>}
            </>
          ) : (
            <h2 className="serif text-4xl">Notes and world news</h2>
          )}
          <a href="/blog/" className="mt-8 inline-block border-b border-snow/40 pb-1 text-sm font-semibold hover:border-snow">
            Read the blog and today’s headlines →
          </a>
        </Node>
        <Node tag="/nihongo">
          <p className="label mb-6">日本語 · today’s words</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-4">
            {today.slice(0, 4).map(([written, kana, , meaning]) => (
              <li key={written}>
                <span className="jp block text-3xl font-bold">{written}</span>
                <span className="jp text-sm text-mist">{kana}</span>
                <span className="block text-sm text-snow/75">{meaning}</span>
              </li>
            ))}
          </ul>
          <a href="/nihongo/" className="mt-8 inline-block border-b border-snow/40 pb-1 text-sm font-semibold hover:border-snow">
            See all ten and quiz yourself →
          </a>
        </Node>
      </section>

      {/* ── Contact ───────────────────────────────── */}
      <section id="contact" className="scroll-mt-24 pt-20">
        <motion.div {...rise} className="frame p-7 sm:p-12">
          <span className="frame-tag">Frame · Contact</span>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="serif text-5xl leading-none sm:text-7xl">
                Say <em className="text-berry">hello</em>
              </h2>
              <p className="mt-5 max-w-md text-lg text-snow/80">Work, editing jobs, or a question about studying in Japan. Messages come straight to my inbox.</p>
              <a href={githubUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block text-gold underline underline-offset-4">
                github.com/{profile.github} ↗
              </a>
            </div>
            <Contact />
          </div>
        </motion.div>
      </section>
    </Layout>
  )
}

// The connector lines from the title node down to the three branches.
function Branches() {
  return (
    <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="hidden h-20 w-full lg:block" fill="none" aria-hidden>
      <path d="M600 0 V40 M200 40 H1000 M200 40 V90 M600 40 V90 M1000 40 V90" stroke="#21382f" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {[200, 600, 1000].map((x) => (
      <circle key={x} cx={x} cy="88" r="3" fill="#9fb3aa" />
      ))}
    </svg>
  )
}

function BranchTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div {...rise} className="text-center">
      <h2 className="serif text-5xl">{kicker}</h2>
      <p className="mt-1 text-sm text-mist">{title}</p>
    </motion.div>
  )
}

function Arrow() {
  return (
    <div className="-my-8 flex justify-center" aria-hidden>
      <svg width="16" height="36" viewBox="0 0 16 36" fill="none">
      <path d="M8 0 V32 M3 27 L8 33 L13 27" stroke="#21382f" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
