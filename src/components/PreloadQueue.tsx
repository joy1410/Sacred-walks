import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const LANES = 3 // photos in flight at once: enough to fill the connection, few enough to keep the order
const FILM_FALLBACK = 6000 // ms; a film that never reports ready shouldn't hold the queue forever
const BEHIND = 3 // a photo behind the scroll direction counts as this many times further away

/**
 * Downloads the page's photos before the visitor reaches them. The first
 * screen goes first: the queue waits until the page has loaded, its hero
 * photos (fetchpriority="high") have arrived and the homepage film has
 * buffered enough to play through. Then, each time a lane frees up, it takes
 * the not-yet-loaded photo nearest the screen, favouring the direction the
 * visitor is scrolling, so someone who jumps down the page is served where
 * they are, not where the page begins.
 *
 * Every <img> on the page is a candidate, including <Upcoming> ones kept
 * unseen for content not on show yet (the yatra tabs, the itinerary days).
 * Each is fetched with its own srcset and sizes, so the browser picks
 * the same copy the page will ask for, then decoded, so it paints on its first
 * frame. Its requests go at low priority: a photo the visitor actually reaches
 * still jumps the queue. Skipped when the visitor has asked to save data.
 */
export default function PreloadQueue() {
  const { pathname } = useLocation()

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return

    let stopped = false
    let running = false
    let inFlight = 0
    const requested = new Set<string>()
    const cleanups: (() => void)[] = []
    const after = (target: EventTarget, event: string, then: () => void) => {
      target.addEventListener(event, then, { once: true })
      cleanups.push(() => target.removeEventListener(event, then))
    }

    // which way the visitor is heading
    let lastY = window.scrollY
    let down = true
    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY) down = y > lastY
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    cleanups.push(() => window.removeEventListener('scroll', onScroll))

    const keyOf = (el: HTMLImageElement) => `${el.getAttribute('src')}|${el.srcset}|${el.sizes}`

    // a hidden image has no box of its own: measure the nearest ancestor that does
    const box = (el: Element) => {
      for (let e: Element | null = el; e; e = e.parentElement) {
        const r = e.getBoundingClientRect()
        if (r.width || r.height) return r
      }
      return null
    }

    const distance = (el: HTMLImageElement) => {
      const r = box(el)
      if (!r) return Infinity
      const vh = window.innerHeight
      if (r.top > vh) return (r.top - vh) * (down ? 1 : BEHIND)
      if (r.bottom < 0) return -r.bottom * (down ? BEHIND : 1)
      return 0 // on screen (or beside it, in a sideways track): first
    }

    const nearest = () => {
      let best: HTMLImageElement | null = null
      let bestD = Infinity
      for (const el of document.querySelectorAll('img')) {
        if (el.complete || !el.getAttribute('src') || requested.has(keyOf(el))) continue
        const d = distance(el)
        if (d < bestD) [best, bestD] = [el, d]
      }
      return best
    }

    const next = () => {
      if (stopped) return
      const el = nearest()
      if (!el) return
      requested.add(keyOf(el))
      inFlight++
      const im = new Image()
      im.fetchPriority = 'low'
      im.decoding = 'async'
      if (el.sizes) im.sizes = el.sizes
      if (el.srcset) im.srcset = el.srcset
      const done = () => {
        inFlight--
        next()
      }
      im.onload = () => void im.decode().catch(() => {}).finally(done)
      im.onerror = done
      im.src = el.getAttribute('src')!
    }

    const fill = () => {
      while (!stopped && inFlight < LANES && nearest()) next()
    }

    const run = () => {
      if (stopped || running) return
      running = true
      fill()
      // photos that join the page later (a tab switch, a section mounting) join the queue
      const mo = new MutationObserver(fill)
      mo.observe(document.body, { childList: true, subtree: true })
      cleanups.push(() => mo.disconnect())
    }

    // the film first: once it can play to the end without stalling, the photos follow
    const afterFilm = () => {
      const film = document.querySelector<HTMLVideoElement>('video[data-hero]')
      if (!film || film.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) return run()
      after(film, 'canplaythrough', run)
      const id = window.setTimeout(run, FILM_FALLBACK)
      cleanups.push(() => window.clearTimeout(id))
    }

    // before that, the page's hero photos (fetchpriority="high") get the connection to themselves
    const afterHeroes = () => {
      const waiting = [...document.querySelectorAll<HTMLImageElement>('img[fetchpriority="high"]')].filter(
        (el) => !el.complete,
      )
      let left = waiting.length
      if (!left) return afterFilm()
      const one = () => --left === 0 && afterFilm()
      waiting.forEach((el) => {
        after(el, 'load', one)
        after(el, 'error', one)
      })
    }

    // on first arrival, let the page's own first screen load before anything else
    if (document.readyState === 'complete') afterHeroes()
    else after(window, 'load', afterHeroes)

    return () => {
      stopped = true
      cleanups.forEach((c) => c())
    }
  }, [pathname])

  return null
}
