import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../content'
import { navigate } from '../router'
import { githubUrl, mailto } from './ui'

type Command = { label: string; hint: string; run: () => void }

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(
    () => [
      { label: 'Home', hint: 'Page', run: () => navigate('/') },
      { label: 'About', hint: 'Page', run: () => navigate('/about') },
      { label: 'Experience', hint: 'Section', run: () => navigate('/#experience') },
      { label: 'Skills', hint: 'Section', run: () => navigate('/#skills') },
      { label: 'Contact', hint: 'Section', run: () => navigate(`${window.location.pathname}#contact`) },
      { label: 'Copy email address', hint: 'Action', run: () => void navigator.clipboard?.writeText(profile.email) },
      { label: 'Send an email', hint: 'Action', run: () => void (window.location.href = mailto) },
      { label: 'Open GitHub', hint: 'Link', run: () => void window.open(githubUrl, '_blank', 'noreferrer') },
    ],
    [],
  )
  const results = commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
  const current = Math.min(active, Math.max(0, results.length - 1))

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

  const close = () => {
    setQuery('')
    setActive(0)
    onClose()
  }
  const run = (c?: Command) => {
    if (!c) return
    close()
    c.run()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/70 px-4 pt-[18vh] backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
          else if (e.key === 'ArrowDown') (e.preventDefault(), setActive((current + 1) % Math.max(1, results.length)))
          else if (e.key === 'ArrowUp') (e.preventDefault(), setActive((current - 1 + results.length) % Math.max(1, results.length)))
          else if (e.key === 'Enter') run(results[current])
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => (setQuery(e.target.value), setActive(0))}
          placeholder="Where to?"
          aria-label="Search commands"
          className="w-full border-b border-line bg-transparent px-5 py-4 text-lg outline-none placeholder:text-mist"
        />
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.map((c, i) => (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => run(c)}
                onPointerMove={() => setActive(i)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left ${i === current ? 'bg-white/10' : ''}`}
              >
                <span>{c.label}</span>
                <span className="label">{c.hint}</span>
              </button>
            </li>
          ))}
          {!results.length && <li className="px-3 py-4 text-mist">Nothing found.</li>}
        </ul>
      </div>
    </div>
  )
}
