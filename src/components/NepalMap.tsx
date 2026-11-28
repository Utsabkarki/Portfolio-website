import { nepalPath, pins } from '../data/nepal'

export default function NepalMap() {
  const { x, y } = pins.lumbini
  const k = pins.kathmandu
  return (
    <svg viewBox="-12 -12 624 372" className="w-full" role="img" aria-labelledby="nepal-title">
      <title id="nepal-title">Map of Nepal with a pin on Lumbini</title>
      <defs>
        <linearGradient id="nepal-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3fa36b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e5383b" stopOpacity="0.18" />
        </linearGradient>
        <pattern id="nepal-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="#f7f3ea" fillOpacity="0.16" />
        </pattern>
      </defs>
      <path d={nepalPath} fill="url(#nepal-fill)" />
      <path d={nepalPath} fill="url(#nepal-dots)" />
      <path d={nepalPath} className="draw" fill="none" stroke="#f7f3ea" strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round" />

      {/* Kathmandu, for reference */}
      <circle cx={k.x} cy={k.y} r="4" fill="#9fb3aa" />
      <text x={k.x + 9} y={k.y + 4} fill="#9fb3aa" fontSize="15" fontFamily="JetBrains Mono Variable, monospace">
        Kathmandu
      </text>

      {/* Lumbini pin */}
      <circle cx={x} cy={y} r="9" fill="#e5383b" className="pulse" />
      <circle cx={x} cy={y} r="7" fill="#e5383b" stroke="#f7f3ea" strokeWidth="2.5" />
      <line x1={x} y1={y - 9} x2={x - 60} y2={y - 95} stroke="#f2c14e" strokeWidth="1.5" />
      <rect x={x - 150} y={y - 128} width="148" height="36" rx="8" fill="#f2c14e" />
      <text x={x - 76} y={y - 104} textAnchor="middle" fill="#07110e" fontSize="18" fontWeight="700" fontFamily="Bricolage Grotesque Variable, sans-serif">
        Lumbini 🇳🇵
      </text>
    </svg>
  )
}
