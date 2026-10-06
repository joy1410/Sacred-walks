import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const LANES = 3 // photos in flight at once: keeps the order without idling the connection
const FILM_FALLBACK = 6000 // ms; a film that never reports ready shouldn't hold the queue forever

/**
 * Downloads every photo on the page in the order it appears, while the
 * visitor is still at the top. The hero film goes first: the queue waits
 * until the page has loaded and the film has buffered enough to play through,
 * then walks the page top to bottom, so by the time a section scrolls in its
 * photos are already in the cache.
 *
 * It picks up every <img> not yet loaded, plus the URLs in any element's
 * data-preload (photos that aren't in the page yet, such as the yatra tabs
 * not on show), in document order. Its own requests go at low priority, so a
 * photo the visitor actually scrolls to still jumps the queue. Skipped when the
 * visitor has asked to save data.
 */
export default function PreloadQueue() {
  const { pathname } = useLocation()

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return

    let stopped = false
    const cleanups: (() => void)[] = []
    const after = (target: EventTarget, event: string, then: () => void) => {
      target.addEventListener(event, then, { once: true })
      cleanups.push(() => target.removeEventListener(event, then))
    }

    const run = () => {
      if (stopped) return
      const urls = [
        ...new Set(
          [...document.querySelectorAll<HTMLElement>('img, [data-preload]')].flatMap((el) =>
            el instanceof HTMLImageElement
              ? el.complete ? [] : [el.currentSrc || el.src]
              : (el.dataset.preload ?? '').split(' '),
          ),
        ),
      ].filter(Boolean)

      let i = 0
      const next = () => {
        if (stopped || i >= urls.length) return
        const im = new Image()
        im.fetchPriority = 'low'
        im.decoding = 'async'
        im.onload = im.onerror = next
        im.src = urls[i++]
      }
      for (let k = 0; k < LANES; k++) next()
    }

    // the film first: once it can play to the end without stalling, the photos follow
    const afterFilm = () => {
      const film = document.querySelector<HTMLVideoElement>('video[data-hero]')
      if (!film || film.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) return run()
      let started = false
      const go = () => {
        if (started) return
        started = true
        run()
      }
      after(film, 'canplaythrough', go)
      const id = window.setTimeout(go, FILM_FALLBACK)
      cleanups.push(() => window.clearTimeout(id))
    }

    // on first arrival, let the page's own first screen load before anything else
    if (document.readyState === 'complete') afterFilm()
    else after(window, 'load', afterFilm)

    return () => {
      stopped = true
      cleanups.forEach((c) => c())
    }
  }, [pathname])

  return null
}
