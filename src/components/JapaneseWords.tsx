import { useEffect, useMemo, useState } from 'react'
import { DAY, PER_DAY, rng, shuffled, tokyoDay, wordsForDay } from '../data/daily'
import { words, type Word } from '../data/japanese'

const label = (day: number) =>
  new Date(day * DAY).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

export default function JapaneseWords() {
  const today = useMemo(() => tokyoDay(Date.now()), [])
  const [day, setDay] = useState(today)
  const [random, setRandom] = useState<Word[] | null>(null)
  const [quiz, setQuiz] = useState(false)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  const [canSpeak, setCanSpeak] = useState(false)

  useEffect(() => setCanSpeak('speechSynthesis' in window), [])

  const list = random ?? wordsForDay(day)
  const go = (d: number) => {
    setRandom(null)
    setFlipped({})
    setDay(Math.min(today, d))
  }
  const shuffle = () => {
    const r = rng(Date.now())
    const idx = shuffled(Math.floor(r() * 1e9)).slice(0, PER_DAY)
    setFlipped({})
    setRandom(idx.map((i) => words[i]))
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line bg-panel/70 p-1">
          <button onClick={() => go(day - 1)} className="rounded-full px-3 py-1.5 text-sm text-mist hover:text-snow" aria-label="Previous day">
            ←
          </button>
          <span className="min-w-36 text-center text-sm font-semibold">
            {random ? 'Random set' : day === today ? `Today · ${label(day)}` : label(day)}
          </span>
          <button
            onClick={() => go(day + 1)}
            disabled={day >= today && !random}
            className="rounded-full px-3 py-1.5 text-sm text-mist hover:text-snow disabled:opacity-30"
            aria-label="Next day"
          >
            →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setQuiz((q) => !q)
              setFlipped({})
            }}
            aria-pressed={quiz}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${quiz ? 'bg-gold text-ink' : 'border border-line text-snow hover:border-gold'}`}
          >
            {quiz ? 'Show answers' : 'Quiz me'}
          </button>
          <button onClick={shuffle} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-gold">
            Shuffle
          </button>
          {(random || day !== today) && (
            <button onClick={() => go(today)} className="rounded-full bg-berry px-4 py-2 text-sm font-semibold">
              Back to today
            </button>
          )}
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {list.map((w, i) => {
          const [written, kana, romaji, meaning] = w
          const key = written + i
          const isFlipped = quiz && !!flipped[key]
          return (
            <li key={key} className="flip relative h-44" data-flipped={isFlipped}>
              <div className="flip-inner">
                <button
                  type="button"
                  onClick={() => quiz && setFlipped((f) => ({ ...f, [key]: !f[key] }))}
                  className="flip-face frame flex flex-col items-center justify-center p-3 text-center"
                  aria-label={quiz ? `${written} — tap to reveal the meaning` : `${written}, ${kana}, ${romaji}: ${meaning}`}
                >
                  <span className="label absolute left-3 top-2.5 text-[0.6rem]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="jp text-3xl font-bold leading-tight">{written}</span>
                  {written !== kana && <span className="jp mt-1 text-sm text-mist">{kana}</span>}
                  {!quiz && (
                    <>
                      <span className="mt-2 font-mono text-xs text-gold">{romaji}</span>
                      <span className="mt-1 text-sm leading-tight text-snow/85">{meaning}</span>
                    </>
                  )}
                  {quiz && <span className="label mt-3 text-[0.6rem]">Tap to reveal</span>}
                </button>
                <button
                  type="button"
                  tabIndex={isFlipped ? 0 : -1}
                  onClick={() => setFlipped((f) => ({ ...f, [key]: false }))}
                  className="flip-face flip-back flex flex-col items-center justify-center rounded-[1.25rem] border border-gold bg-panel-2 p-3 text-center"
                >
                  <span className="font-mono text-sm text-gold">{romaji}</span>
                  <span className="mt-2 text-lg font-semibold leading-tight">{meaning}</span>
                </button>
              </div>
              {canSpeak && (
                <button
                  type="button"
                  onClick={() => speak(written)}
                  className="absolute bottom-2 right-2 z-10 rounded-full px-2 py-1 text-xs text-mist hover:text-gold"
                  aria-label={`Hear ${written} pronounced`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
                </button>
              )}
            </li>
          )
        })}
      </ol>
      <p className="label mt-5">New words every day at midnight, Japan time. {words.length} words in total.</p>
    </div>
  )
}
