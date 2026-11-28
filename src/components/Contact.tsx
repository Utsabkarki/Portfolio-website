import { useState, type FormEvent } from 'react'
import { contact, profile } from '../content'

type Status = 'idle' | 'sending' | 'sent' | 'error'

// Sends the message through Web3Forms straight to Utsab's inbox. The email
// address is stored only in the Web3Forms account, never on this site.
export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const ready = contact.web3formsKey.length > 0

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.botcheck) return
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          access_key: contact.web3formsKey,
          subject: `New message from ${profile.domain}`,
          from_name: profile.domain,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const field = 'w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-gold focus:outline-none'

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="label">Your name</span>
          <input name="name" required autoComplete="name" className={field} placeholder="Taro Yamada" disabled={!ready} />
        </label>
        <label className="grid gap-1.5">
          <span className="label">Your email</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" disabled={!ready} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="label">Message</span>
        <textarea name="message" required rows={5} className={field} placeholder="Hi Utsab, …" disabled={!ready} />
      </label>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!ready || status === 'sending'}
          className="rounded-full bg-berry px-6 py-3.5 font-semibold text-snow shadow-[0_0_30px_rgb(229_56_59/0.4)] transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Send message 🎁'}
        </button>
        <p className="text-sm text-mist" role="status">
          {!ready && 'The contact form opens soon — meanwhile you can reach me on GitHub.'}
          {status === 'sent' && <span className="text-pine">Thanks! Your message is on its way. ✓</span>}
          {status === 'error' && <span className="text-berry">Something went wrong. Please try again.</span>}
          {ready && status === 'idle' && 'Your message goes privately to my inbox.'}
        </p>
      </div>
    </form>
  )
}
