// Pulls fresh headlines from public RSS/Atom feeds and writes public/news.json.
// Runs before every build; the deploy workflow rebuilds on a schedule, so the
// "What's happening in the world" section keeps itself up to date.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const OUT = 'public/news.json'
const PER_FEED = 6

const feeds = [
  { topic: 'World', source: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { topic: 'Asia', source: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml' },
  { topic: 'Japan', source: 'The Japan Times', url: 'https://www.japantimes.co.jp/feed/' },
  { topic: 'Nepal', source: 'The Kathmandu Post', url: 'https://kathmandupost.com/rss' },
  { topic: 'Tech', source: 'BBC News', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
]

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
function clean(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => entities[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? clean(m[1]) : ''
}

function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? []
  return blocks.map((b) => {
    let link = tag(b, 'link')
    if (!link) link = b.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? ''
    const date = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date')
    const summary = tag(b, 'description') || tag(b, 'summary')
    return {
      title: tag(b, 'title'),
      link: clean(link),
      date: date && !Number.isNaN(Date.parse(date)) ? new Date(date).toISOString() : null,
      summary: summary.length > 220 ? summary.slice(0, 217).trimEnd() + '…' : summary,
    }
  })
}

async function grab(feed) {
  const res = await fetch(feed.url, {
    headers: { 'user-agent': 'utsabkarki.com.np news bot (+https://utsabkarki.com.np)' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return parseFeed(await res.text())
    .filter((i) => i.title && /^https?:\/\//.test(i.link))
    .slice(0, PER_FEED)
    .map((i) => ({ ...i, topic: feed.topic, source: feed.source }))
}

async function main() {
  const results = await Promise.allSettled(feeds.map(grab))
  const items = []
  const seen = new Set()
  results.forEach((r, i) => {
    if (r.status === 'rejected') return console.warn(`news: ${feeds[i].url} failed — ${r.reason?.message ?? r.reason}`)
    for (const item of r.value) {
      if (seen.has(item.link)) continue
      seen.add(item.link)
      items.push(item)
    }
  })

  if (!items.length) {
    // Keep the last good file rather than blanking the section.
    if (existsSync(OUT)) return console.warn('news: no feeds reachable, keeping previous news.json')
    console.warn('news: no feeds reachable, writing an empty news.json')
  }

  mkdirSync('public', { recursive: true })
  writeFileSync(OUT, JSON.stringify({ updatedAt: items.length ? new Date().toISOString() : null, items }, null, 1))
  console.log(`news: wrote ${items.length} headlines to ${OUT}`)
}

// `node scripts/fetch-news.mjs --parse feed.xml` tests the parser on a saved feed.
if (process.argv[2] === '--parse') console.log(parseFeed(readFileSync(process.argv[3], 'utf8')).slice(0, 3))
else await main()
