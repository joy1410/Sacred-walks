import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { yatras, type YatraStatus } from '../../data/yatras'
import { useIsMobile } from '../../lib/useIsMobile'
import YatraCard from './YatraCard'

const ease = [0.16, 1, 0.3, 1] as const
// 48px nav + the sticky pill (and its padding) above a card scrolled into place
const STICKY_OFFSET = 48 + 64

/**
 * Desktop: a segmented control swaps one card in place.
 * Mobile: every card stacks and scrolls normally; the same pill sticks under
 * the nav, follows along as each card reaches the middle of the screen, and
 * a tap scrolls to that card.
 */
export default function YatraSection() {
  const [[active, dir], setActive] = useState<[number, number]>([0, 0])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobile = useIsMobile()
  const lenis = useLenis()
  // while a tap is scrolling the page, the cards passing by must not move the pill
  const jumping = useRef(false)

  // warm every yatra's photos once the page is idle, so switching tabs never
  // waits on a download or decode mid-transition
  useEffect(() => {
    if (mobile) return // all cards are on the page already
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
  }, [mobile])

  // mobile: the card crossing the middle of the screen owns the pill
  useEffect(() => {
    if (!mobile) return
    const io = new IntersectionObserver(
      (entries) => {
        if (jumping.current) return
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = cardRefs.current.indexOf(e.target as HTMLDivElement)
          if (i >= 0) setActive((prev) => (prev[0] === i ? prev : [i, i > prev[0] ? 1 : -1]))
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )
    cardRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [mobile])

  // keep the active tab in view inside the pill's own horizontal scroller
  useEffect(() => {
    const scroller = scrollerRef.current
    const tab = tabRefs.current[active]
    if (!scroller || !tab || scroller.scrollWidth <= scroller.clientWidth) return
    scroller.scrollTo({ left: tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  const select = (i: number) => {
    setActive(([cur]) => [i, i > cur ? 1 : -1])
    if (!mobile) return
    const card = cardRefs.current[i]
    if (!card) return
    jumping.current = true
    const done = () => (jumping.current = false)
    if (lenis) lenis.scrollTo(card, { offset: -STICKY_OFFSET, onComplete: done })
    else window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET, behavior: 'smooth' })
    // a finger on the screen can cut the scroll short, so never hold the pill for long
    window.setTimeout(done, 1400)
  }

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
    <section id="yatras" data-opaque className="bg-mist px-4 pt-14 pb-6 md:px-5 md:pt-[60px] lg:h-svh lg:min-h-[680px]">
      {/* once the card hits its max height, the leftover space splits above and below */}
      <div className="mx-auto flex h-full max-w-[1180px] flex-col lg:justify-center">
        <h2 className="mb-4 type-h2 text-ink md:mb-5">
          Choose your yatra
        </h2>

        {/* segmented control, full width. On mobile it sticks under the nav (on solid mist, so
            the cards pass beneath it) and the scroller bleeds to the screen edges (cancels the
            section padding), so the pill scrolls off-screen instead of being clipped inside the
            gutter; py leaves room for the active tab's shadow, which an overflow container would
            otherwise cut */}
        <div className="sticky top-12 z-20 -mx-4 -mt-2 mb-1 shrink-0 bg-mist md:static md:mx-0 md:bg-transparent">
          <div
            ref={scrollerRef}
            className="scroll-px-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:px-0 [&::-webkit-scrollbar]:hidden"
          >
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
                    onClick={() => select(i)}
                    className="group/tab relative grow shrink-0 cursor-pointer rounded-full px-4 py-2.5 type-button-sm md:py-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron md:px-3"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="yatra-segment"
                        className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_3px_10px_rgba(0,0,0,0.08)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span className={`relative block transition-colors duration-300 ${isActive ? 'text-ink' : 'text-ink-soft group-hover/tab:text-ink'}`}>
                      {t.tab}
                    </span>
                    <TabStatus status={t.status} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {mobile ? (
          <div className="mt-2 flex flex-col gap-4">
            {yatras.map((t, i) => (
              <div
                key={t.slug}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                id={`panel-${t.slug}`}
                role="tabpanel"
                aria-labelledby={`tab-${t.slug}`}
              >
                <YatraCard yatra={t} />
              </div>
            ))}
          </div>
        ) : (
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
              // fills the screen below the tabs, but stops at 640px so tall screens don't stretch it
              className="min-h-0 flex-1 lg:max-h-[640px]"
            >
              <YatraCard yatra={y} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

/**
 * The tab's second line: whether you can go, before you click. Open yatras
 * name their departure month in saffron; the rest say when they're next.
 * Hidden on phones, where the tabs stick under the nav and every card is
 * stacked below with its own status pill.
 */
function TabStatus({ status }: { status: YatraStatus }) {
  const label =
    status.state === 'open'
      ? `Open · ${status.departure.split(' ').slice(-2).join(' ')}`
      : status.state === 'soon'
        ? `Opens ${status.opens}`
        : `Next in ${status.next}`
  return (
    <span className={`relative mt-0.5 hidden type-caption tabular-nums md:block ${status.state === 'open' ? 'text-saffron-ink' : 'text-ink-mute'}`}>
      {label}
    </span>
  )
}
