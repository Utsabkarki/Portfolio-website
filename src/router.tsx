import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { scroller } from './store'

const listeners = new Set<() => void>()
const clean = (p: string) => p.replace(/\/+$/, '') || '/'
const getPath = () => clean(window.location.pathname)

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('popstate', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('popstate', cb)
  }
}

export const usePath = () => useSyncExternalStore(subscribe, getPath)

function settle(hash: string) {
  const el = hash ? document.getElementById(hash.slice(1)) : null
  if (el) scroller.to(el, true)
  else scroller.to(0, true)
}

/** Client-side navigation, animated with the View Transitions API where supported. */
export function navigate(to: string) {
  const url = new URL(to, window.location.origin)
  if (clean(url.pathname) === getPath()) {
    const el = url.hash ? document.getElementById(url.hash.slice(1)) : null
    scroller.to(el ?? 0)
    return
  }
  const apply = () => {
    window.history.pushState(null, '', url)
    flushSync(() => listeners.forEach((l) => l()))
    settle(url.hash)
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (document.startViewTransition && !reduced) document.startViewTransition(apply)
  else apply()
}

export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}
