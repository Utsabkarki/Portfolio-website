import { useEffect, useMemo, useState } from 'react'
import { words, type Word } from '../data/japanese'

const PER_DAY = 10
const DAY = 86_400_000

// Calendar day in Japan time, so everyone gets the new set at midnight JST.
const tokyoDay = (t: number) => Math.floor((t + 9 * 3_600_000) / DAY)
const label = (day: number) =>
  new Date(day * DAY).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled(seed: number) {
  const r = rng(seed)
  const idx = words.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

// Walks a fresh shuffle of the whole list each cycle, so words don't repeat
// until every word has been shown once.
function wordsForDay(day: number): Word[] {
  const out: Word[] = []
  for (let k = 0; k < PER_DAY; k++) {
    const n = day * PER_DAY + k
    const cycle = Math.floor(n / words.length)
    out.push(words[shuffled(cycle * 7919 + 17)[n % words.length]])
  }
  return out
}

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
            {quiz ? 'Quiz mode: on' : 'Quiz mode'}
          </button>
          <button onClick={shuffle} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-gold">
            🎲 Random 10
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
                  🔊
                </button>
              )}
            </li>
          )
        })}
      </ol>
      <p className="label mt-5">A new set of 10 every day at midnight Japan time · {words.length} words in the deck</p>
    </div>
  )
}
