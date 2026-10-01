import { useEffect, useState } from 'react'

const QUERY = '(max-width: 767px)'

/** below md: phones get their own layouts (journey carousel, stacked yatras) */
export function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}
