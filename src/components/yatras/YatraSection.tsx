import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { yatras } from '../../data/yatras'
import YatraCard from './YatraCard'

const ease = [0.16, 1, 0.3, 1] as const

export default function YatraSection() {
  const [[active, dir], setActive] = useState<[number, number]>([0, 0])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // warm every yatra's photos once the page is idle, so switching tabs never
  // waits on a download or decode mid-transition
  useEffect(() => {
    const warm = () =>
      yatras.forEach((t) =>
        t.images.forEach(({ src }) => {
          const im = new Image()
          im.decoding = 'async'
          im.src = src
        }),
      )
    // Safari has no requestIdleCallback; a short timeout does the same job there
    const idle = typeof window.requestIdleCallback === 'function'
    const id = idle ? window.requestIdleCallback(warm) : setTimeout(warm, 1200)
    return () => (idle ? window.cancelIdleCallback(id as number) : clearTimeout(id))
  }, [])

  const select = (i: number) => setActive(([cur]) => [i, i > cur ? 1 : -1])

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + yatras.length) % yatras.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  const y = yatras[active]

  return (
    // heading + full-width segmented control + card fill exactly one screen on desktop
    // (top padding clears the 48px nav)
    <section id="yatras" className="bg-mist px-4 pt-16 pb-6 md:px-5 md:pt-[72px] lg:h-svh lg:min-h-[680px]">
      <div className="mx-auto flex h-full max-w-[1180px] flex-col">
        <h2 className="mb-3 font-display text-[24px] leading-none font-medium text-ink-2 md:mb-4 md:text-[30px]">
          Choose your pilgrimage
        </h2>

        {/* segmented control, full width */}
        {/* on mobile the scroller bleeds to the screen edges (cancels the section padding), so the
            pill scrolls off-screen instead of being clipped inside the gutter; py leaves room for the
            active tab's shadow, which an overflow container would otherwise cut */}
        <div className="-mx-4 -mt-2 mb-1 shrink-0 scroll-px-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:mx-0 md:px-0">
        <div
          role="tablist"
          aria-label="Yatra destinations"
          onKeyDown={onKey}
          className="flex w-max min-w-full rounded-full bg-[rgba(120,72,30,0.07)] p-1 md:grid md:w-full md:grid-cols-4"
        >
          {yatras.map((t, i) => {
            const isActive = i === active
            return (
              <button
                key={t.slug}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`tab-${t.slug}`}
                aria-selected={isActive}
                aria-controls={`panel-${t.slug}`}
                tabIndex={isActive ? 0 : -1}
                onClick={(e) => {
                  select(i)
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                }}
                className="relative grow shrink-0 rounded-full px-4 py-2.5 text-[14px] font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron md:px-3 md:text-[15px]"
              >
                {isActive && (
                  <motion.span
                    layoutId="yatra-segment"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_3px_10px_rgba(0,0,0,0.08)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                  />
                )}
                <span className={`relative transition-colors duration-300 ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}>
                  {t.tab}
                </span>
              </button>
            )
          })}
        </div>
        </div>

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={y.slug}
            id={`panel-${y.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${y.slug}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40, scale: 0.985 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -40, scale: 0.985 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease }}
            className="min-h-0 flex-1"
          >
            <YatraCard yatra={y} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
