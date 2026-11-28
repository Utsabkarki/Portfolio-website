import { words, type Word } from './japanese'

export const PER_DAY = 10
export const DAY = 86_400_000

// Calendar day in Japan time, so everyone gets the new set at midnight JST.
export const tokyoDay = (t: number) => Math.floor((t + 9 * 3_600_000) / DAY)
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffled(seed: number) {
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
export function wordsForDay(day: number): Word[] {
  const out: Word[] = []
  for (let k = 0; k < PER_DAY; k++) {
    const n = day * PER_DAY + k
    const cycle = Math.floor(n / words.length)
    out.push(words[shuffled(cycle * 7919 + 17)[n % words.length]])
  }
  return out
}

