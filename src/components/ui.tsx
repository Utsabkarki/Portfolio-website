import { useEffect, useState } from 'react'
import { profile, revealEmail } from '../content'
import { Card, Magnetic } from './fx'

export const githubUrl = `https://github.com/${profile.github}`
export const sendEmail = () => void (window.location.href = `mailto:${revealEmail()}`)

export const btn = {
  primary: 'inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-accent',
  ghost: 'glass inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors hover:border-white/30',
}

export function useLocalTime() {
  const format = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timeZone }).format(new Date())
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function Heading({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
      <h2 className="display text-4xl sm:text-6xl">{children}</h2>
      <span className="label pb-1">{index}</span>
    </div>
  )
}

export function Contact() {
  const [email, setEmail] = useState<string | null>(null)
  return (
    <section id="contact" className="px-3 pt-20 sm:px-5 sm:pt-28">
      <Card className="px-6 py-16 text-center sm:py-28">
        <div className="pointer-events-none absolute inset-x-0 -bottom-1/2 mx-auto aspect-square w-[min(90%,48rem)] rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="relative z-10">
          <p className="label mb-6 flex items-center justify-center gap-2.5">
            <span className="size-2 animate-pulse-dot rounded-full bg-emerald-300" />
            Open to internships & projects
          </p>
          <h2 className="display mx-auto max-w-4xl text-5xl sm:text-8xl">
            Let’s work <em className="text-accent">together</em>.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-paper/60">Part-time work, internships, and editing or web projects. Email is the fastest way to reach me.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <button type="button" onClick={sendEmail} className={btn.primary}>
                Send an email →
              </button>
            </Magnetic>
            <a href={githubUrl} target="_blank" rel="noreferrer" className={btn.ghost}>
              GitHub ↗
            </a>
          </div>
          <p className="mt-8 min-h-7 text-paper/70" aria-live="polite">
            {email ? (
              <a href={`mailto:${email}`} className="break-all underline decoration-accent underline-offset-4 hover:text-accent">
                {email}
              </a>
            ) : (
              <button type="button" onClick={() => setEmail(revealEmail())} className="cursor-pointer underline decoration-white/30 underline-offset-4 hover:text-paper">
                Show email address
              </button>
            )}
          </p>
        </div>
      </Card>
    </section>
  )
}
