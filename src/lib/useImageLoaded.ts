import { useCallback, useState } from 'react'

/**
 * Tracks whether an <img> has finished loading, so a shimmer can stand in
 * until it has and the photo can fade up over it. The ref catches photos the
 * cache served before React attached onLoad; an error also counts as done,
 * so a broken photo doesn't shimmer forever.
 */
export function useImageLoaded() {
  const [loaded, setLoaded] = useState(false)
  const watch = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])
  const done = useCallback(() => setLoaded(true), [])
  return { loaded, watch, onLoad: done, onError: done }
}
