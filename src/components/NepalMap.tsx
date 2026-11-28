import { nepalPath, pins } from '../data/nepal'

export default function NepalMap() {
  const { x, y } = pins.lumbini
  const k = pins.kathmandu
  return (
    <svg viewBox="-12 -12 624 372" className="w-full" role="img" aria-labelledby="nepal-title">
      <title id="nepal-title">Map of Nepal with a pin on Lumbini</title>
      <defs>
        <linearGradient id="nepal-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7ee0ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ff2e4a" stopOpacity="0.18" />
        </linearGradient>
        <pattern id="nepal-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="#eef2ff" fillOpacity="0.16" />
        </pattern>
      </defs>
      <path d={nepalPath} fill="url(#nepal-fill)" />
      <path d={nepalPath} fill="url(#nepal-dots)" />
      <path d={nepalPath} className="draw" fill="none" stroke="#eef2ff" strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round" />

      {/* Kathmandu, for reference */}
      <circle cx={k.x} cy={k.y} r="4" fill="#8f9cc2" />
      <text x={k.x + 9} y={k.y + 4} fill="#8f9cc2" fontSize="15" fontFamily="JetBrains Mono Variable, monospace">
        Kathmandu
      </text>

      {/* Lumbini pin */}
      <circle cx={x} cy={y} r="9" fill="#ff2e4a" className="pulse" />
      <circle cx={x} cy={y} r="7" fill="#ff2e4a" stroke="#eef2ff" strokeWidth="2.5" />
      <line x1={x} y1={y - 9} x2={x - 60} y2={y - 95} stroke="#5cd3ff" strokeWidth="1.5" />
      <rect x={x - 130} y={y - 128} width="108" height="36" rx="8" fill="#5cd3ff" />
      <text x={x - 76} y={y - 104} textAnchor="middle" fill="#04060c" fontSize="18" fontWeight="700" fontFamily="Bricolage Grotesque Variable, sans-serif">
        Lumbini
      </text>
    </svg>
  )
}
