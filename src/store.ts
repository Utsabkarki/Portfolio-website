// Tiny mutable store read by the 3D scene every frame (no React re-renders).
export const input = { scroll: 0, px: 0, py: 0 }

export function bindInput() {
  const onScroll = () => {
    input.scroll = window.scrollY / Math.max(1, window.innerHeight)
    document.documentElement.style.setProperty('--scene-fade', String(Math.max(0.28, 1 - input.scroll * 0.75)))
  }
  const onMove = (e: PointerEvent) => {
    input.px = (e.clientX / window.innerWidth) * 2 - 1
    input.py = (e.clientY / window.innerHeight) * 2 - 1
    document.documentElement.style.setProperty('--px', input.px.toFixed(3))
    document.documentElement.style.setProperty('--py', input.py.toFixed(3))
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onMove)
  }
}
