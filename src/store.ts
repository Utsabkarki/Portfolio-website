// Tiny mutable store read by the 3D scene every frame (no React re-renders).
export const input = { scroll: 0, px: 0, py: 0, page: 0 }

// Set by the app when smooth scrolling is active.
export const scroller: { to: (target: number | HTMLElement, immediate?: boolean) => void } = {
  to: (target, immediate) => {
    const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
  },
}

export function bindInput() {
  const onScroll = () => {
    input.scroll = window.scrollY / Math.max(1, window.innerHeight)
    document.documentElement.style.setProperty('--scene-fade', String(Math.max(0.2, 1 - input.scroll * 0.9)))
  }
  const onMove = (e: PointerEvent) => {
    input.px = (e.clientX / window.innerWidth) * 2 - 1
    input.py = (e.clientY / window.innerHeight) * 2 - 1
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onMove)
  }
}
