// Original backdrop characters drawn in SVG: a lone coated figure with
// glowing eyes, and a looming oni mask behind him. Animated with CSS.
export default function Characters() {
  return (
    <div className="characters" aria-hidden>
      <svg className="oni" viewBox="0 0 600 520" fill="none">
        <defs>
          <linearGradient id="oni-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#13264a" />
            <stop offset="1" stopColor="#05080f" />
          </linearGradient>
          <linearGradient id="oni-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff2e4a" />
            <stop offset="1" stopColor="#5cd3ff" />
          </linearGradient>
          <filter id="eye-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* flowing hair */}
        <g stroke="#1c3563" strokeWidth="5" strokeLinecap="round" className="oni-hair">
          <path d="M160 200 C120 300 110 400 70 520" />
          <path d="M175 220 C150 320 150 420 120 520" />
          <path d="M150 180 C90 260 60 360 20 470" />
          <path d="M440 200 C480 300 490 400 530 520" />
          <path d="M425 220 C450 320 450 420 480 520" />
          <path d="M450 180 C510 260 540 360 580 470" />
        </g>
        {/* horns */}
        <path d="M185 175 C150 115 125 65 85 25 C140 55 200 105 228 160 Z" fill="url(#oni-face)" stroke="url(#oni-rim)" strokeWidth="2" />
        <path d="M415 175 C450 115 475 65 515 25 C460 55 400 105 372 160 Z" fill="url(#oni-face)" stroke="url(#oni-rim)" strokeWidth="2" />
        {/* face */}
        <path d="M150 205 C150 105 450 105 450 205 L440 330 C420 430 370 480 300 492 C230 480 180 430 160 330 Z" fill="url(#oni-face)" stroke="url(#oni-rim)" strokeWidth="2.5" />
        {/* brows and cheek lines */}
        <path d="M190 228 L268 250 L262 236 Z M410 228 L332 250 L338 236 Z" fill="#02040a" />
        <path d="M200 300 C215 330 225 340 240 345 M400 300 C385 330 375 340 360 345 M300 270 L292 320 L308 320 Z" stroke="#2a4677" strokeWidth="3" fill="none" />
        {/* eyes */}
        <g className="oni-eyes" filter="url(#eye-glow)">
          <path d="M210 268 Q238 248 268 266 Q240 282 210 268 Z" fill="#ff2e4a" />
          <path d="M390 268 Q362 248 332 266 Q360 282 390 268 Z" fill="#ff2e4a" />
          <circle cx="240" cy="266" r="5" fill="#ffd0d6" />
          <circle cx="360" cy="266" r="5" fill="#ffd0d6" />
        </g>
        {/* grin */}
        <path d="M196 356 Q300 452 404 356 Q300 394 196 356 Z" fill="#dfe6f5" />
        <g stroke="#0a1326" strokeWidth="3">
          {[222, 244, 266, 288, 312, 334, 356, 378].map((x) => (
            <line key={x} x1={x} y1="360" x2={x} y2="440" />
          ))}
        </g>
        <path d="M200 362 Q300 420 400 362" stroke="#0a1326" strokeWidth="4" fill="none" />
        <path d="M196 356 Q300 452 404 356 Q300 394 196 356 Z" stroke="#0a1326" strokeWidth="3" fill="none" />
      </svg>

      <svg className="hero-figure" viewBox="0 0 440 800" fill="none">
        <defs>
          <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d1424" />
            <stop offset="1" stopColor="#03050a" />
          </linearGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff2e4a" />
            <stop offset="0.5" stopColor="#ff2e4a" stopOpacity="0" />
            <stop offset="1" stopColor="#5cd3ff" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a556e" />
            <stop offset="1" stopColor="#10172a" />
          </linearGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff2e4a" />
            <stop offset="1" stopColor="#ff2e4a" stopOpacity="0" />
          </linearGradient>
          <filter id="fig-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="figure-bob">
          {/* legs */}
          <path d="M168 440 L197 440 L193 760 L175 760 Z M203 440 L232 440 L226 760 L207 760 Z" fill="#05070d" stroke="url(#rim)" strokeWidth="1.5" />
          <path d="M170 758 L198 758 L200 772 L162 772 Z M205 758 L230 758 L238 772 L203 772 Z" fill="#05070d" />
          {/* shirt */}
          <path d="M168 205 L232 205 L238 445 L162 445 Z" fill="url(#shirt)" />
          {/* coat halves, blowing in the wind */}
          <path
            className="coat-left"
            d="M152 205 C126 280 108 380 92 470 C80 560 62 630 40 700 L66 684 L80 712 L108 686 L130 716 L152 690 L170 700 L180 440 L172 215 Z"
            fill="url(#coat)"
            stroke="url(#rim)"
            strokeWidth="2"
          />
          <path
            className="coat-right"
            d="M248 205 C280 270 312 350 340 430 C368 510 392 580 420 640 L392 648 L384 690 L356 668 L338 700 L312 676 L290 692 L222 440 L228 215 Z"
            fill="url(#coat)"
            stroke="url(#rim)"
            strokeWidth="2"
          />
          {/* sleeves and hands */}
          <path d="M156 212 C140 270 134 340 140 425 L160 428 C160 350 166 280 174 224 Z M244 212 C260 270 266 340 260 425 L240 428 C240 350 234 280 226 224 Z" fill="url(#coat)" stroke="url(#rim)" strokeWidth="1.5" />
          <ellipse cx="150" cy="438" rx="9" ry="12" fill="#0b1120" />
          <ellipse cx="250" cy="438" rx="9" ry="12" fill="#0b1120" />
          {/* collar */}
          <path d="M168 200 L200 250 L232 200 L248 205 L200 275 L152 205 Z" fill="#0b1120" stroke="url(#rim)" strokeWidth="1.5" />
          {/* neck and head */}
          <path d="M189 172 L211 172 L214 205 L186 205 Z" fill="#0b1120" />
          <ellipse cx="200" cy="148" rx="30" ry="37" fill="#0b1120" stroke="url(#rim)" strokeWidth="1.5" />
          {/* hair */}
          <path
            d="M160 150 L156 118 L170 126 L166 96 L182 112 L188 86 L200 106 L213 84 L219 110 L234 96 L233 124 L246 116 L241 152 L231 140 L225 162 L214 136 L200 152 L187 134 L177 162 L171 142 Z"
            fill="#03050a"
            stroke="url(#rim)"
            strokeWidth="1.5"
          />
          {/* glowing eyes and the trail from one of them */}
          <g className="figure-eyes" filter="url(#fig-glow)">
            <ellipse cx="187" cy="154" rx="6" ry="2" fill="#ff2e4a" />
            <ellipse cx="213" cy="154" rx="6" ry="2" fill="#ff2e4a" />
            <path className="eye-trail" d="M218 153 C250 148 290 138 340 128 L340 131 C292 142 252 152 218 156 Z" fill="url(#trail)" />
          </g>
        </g>
      </svg>
    </div>
  )
}
