import { useEffect, useRef } from 'react'

type Photo = { src: string; alt: string }

// A drag-to-spin 3D ring of photos (pure CSS 3D, so it works without WebGL).
export default function Photo3D({ photos }: { photos: Photo[] }) {
  const stage = useRef<HTMLDivElement>(null!)
  const ring = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const el = stage.current
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let angle = 0
    let velocity = still ? 0 : 0.12
    let tiltX = 0
    let tiltY = 0
    let dragging = false
    let lastX = 0
    let raf = 0

    const frame = () => {
      if (!dragging) {
        angle += velocity
        velocity += ((still ? 0 : 0.12) - velocity) * 0.02
      }
      ring.current.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(${tiltX}deg) rotateY(${angle + tiltY}deg)`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const down = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tiltX = -((e.clientY - r.top) / r.height - 0.5) * 14
      tiltY = ((e.clientX - r.left) / r.width - 0.5) * 10
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      angle += dx * 0.4
      velocity = dx * 0.4
    }
    const up = () => {
      dragging = false
    }
    const leave = () => {
      tiltX = 0
      tiltY = 0
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  const step = 360 / photos.length
  return (
    <div>
      <div ref={stage} className="carousel relative mx-auto aspect-[4/5] w-[62%] select-none [--r:clamp(130px,19vw,190px)]">
        <div ref={ring} className="ring">
          {photos.map((p, i) => (
            <figure key={p.src} style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))` }}>
              <img src={p.src} alt={p.alt} draggable={false} loading="lazy" className="size-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-6 h-4 w-2/3 rounded-[50%] bg-black/50 blur-md" aria-hidden />
    </div>
  )
}
