import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { STICKY_OFFSET } from './shared'

const pageSections = [
  { id: 'dates', label: 'Dates' },
  { id: 'about', label: 'About Kashi' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'day', label: 'A day in the yatra' },
  { id: 'preparation', label: 'Preparation' },
  { id: 'stay', label: 'Stay' },
  { id: 'cost', label: 'Cost' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'register', label: 'Registration' },
] as const

/**
 * The page's own bar, sticking under the global nav once the hero has gone.
 * The section crossing the middle of the screen owns the white pill (the
 * same sliding segment as the yatra tabs); a tap glides there.
 */
export default function SectionNav() {
  const [active, setActive] = useState(-1)
  const lenis = useLenis()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  // while a tap is scrolling the page, the sections passing by must not move the pill
  const jumping = useRef(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (jumping.current) return
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = pageSections.findIndex((s) => s.id === e.target.id)
          if (i >= 0) setActive(i)
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )
    pageSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // keep the active link in view inside the bar's own horizontal scroller
  useEffect(() => {
    const scroller = scrollerRef.current
    const link = linkRefs.current[active]
    if (!scroller || !link || scroller.scrollWidth <= scroller.clientWidth) return
    scroller.scrollTo({ left: link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  const go = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setActive(i)
    const el = document.getElementById(pageSections[i].id)
    if (!el) return
    jumping.current = true
    const done = () => (jumping.current = false)
    if (lenis) lenis.scrollTo(el, { offset: -STICKY_OFFSET + 1, onComplete: done })
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET + 1, behavior: 'smooth' })
    window.setTimeout(done, 1600)
  }

  return (
    <div className="sticky top-12 z-40 border-b border-black/[0.08] bg-white">
      <div className="mx-auto flex h-[52px] max-w-[1180px] items-center md:px-5 xl:px-0">
        <div
          ref={scrollerRef}
          className="min-w-0 flex-1 scroll-px-4 overflow-x-auto px-4 [scrollbar-width:none] md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <nav aria-label="On this page" className="flex w-max gap-0.5">
            {pageSections.map((s, i) => {
              const on = i === active
              return (
                <a
                  key={s.id}
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                  href={`#${s.id}`}
                  onClick={go(i)}
                  aria-current={on ? 'true' : undefined}
                  className="relative rounded-full px-3.5 py-1.5 text-[13.5px] font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron"
                >
                  {on && (
                    <motion.span
                      layoutId="kashi-section"
                      className="absolute inset-0 rounded-full bg-mist-2"
                      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    />
                  )}
                  <span className={`relative transition-colors duration-300 ${on ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}>
                    {s.label}
                  </span>
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
