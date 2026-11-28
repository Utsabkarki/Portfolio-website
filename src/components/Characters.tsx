import art from '../assets/hero-art.webp'

// Positions inside the artwork (percent of its width/height) for the glow overlays.
const eyes = [
  { x: 55.2, y: 20.6, size: 4.2 }, // oni mask
  { x: 65.5, y: 20.6, size: 4.2 },
  { x: 75.4, y: 29.3, size: 1.3 }, // figure
  { x: 77.8, y: 28.9, size: 1.5 },
]

// Deterministic "random" embers so the markup is stable between renders.
const embers = Array.from({ length: 36 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return {
    left: r(1) * 100,
    size: 2 + r(2) * 4,
    duration: 7 + r(3) * 9,
    delay: -r(4) * 16,
    drift: (r(5) - 0.5) * 120,
    color: r(6) > 0.78 ? '#7fdcff' : '#ff4a5e',
  }
})

// The generated key art (an original figure and a looming oni mask), brought
// to life with a slow camera drift, pulsing eyes, flickering energy and embers.
export default function Characters() {
  return (
    <div className="characters" aria-hidden>
      <div className="art-frame">
        <div className="art-move">
          <img src={art} alt="" className="size-full" decoding="async" fetchPriority="high" />
          <span className="art-flicker art-flicker-red" />
          <span className="art-flicker art-flicker-blue" />
          {eyes.map((e, i) => (
            <span
              key={i}
              className="art-eye"
              style={{ left: `${e.x}%`, top: `${e.y}%`, width: `${e.size}%`, animationDelay: `${i * -0.7}s` }}
            />
          ))}
        </div>
      </div>
      <div className="art-scrim" />
      <div className="embers">
        {embers.map((e, i) => (
          <span
            key={i}
            style={{
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              background: e.color,
              boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              ['--drift' as string]: `${e.drift}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
