import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import { itinerary, type Day, type Stop } from '../../data/kashi'
import { blur } from '../../lib/lite'
import { ease, inView, SectionHeading } from './shared'

/**
 * Desktop: the days scroll past on the right while a framed photograph holds
 * still on the left and changes with them, the new day's picture settling
 * in from 1.08× as the old one lets go. The day in view stays bright while
 * the others fall back.
 * Mobile: each day carries its own photograph and the page reads straight down.
 * Both: a grey rail runs down the days and one saffron line marks the day
 * in view, gliding to the next day in one motion: shorter while it
 * travels, growing into the new day as it lands.
 */
/** the sticky frame needs the two-column layout, which starts at lg */
function useStacked() {
  const query = '(max-width: 1023px)'
  const [stacked, setStacked] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setStacked(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return stacked
}

/** the saffron line never draws shorter than this, even mid-flight */
const SHORT = 40
const glide = [0.65, 0, 0.35, 1] as const

export default function Itinerary() {
  const [active, setActive] = useState(0)
  const mobile = useStacked()
  const day = itinerary[active]
  const reduced = useReducedMotion()

  /*
   * Desktop rail: one saffron line whose two ends move on their own. The
   * trailing end leaves first, so the line draws in as it sets off; the
   * leading end leaves a beat later and lands last, so the line grows into
   * its new day as it settles. One continuous motion, no holds, and a new
   * day mid-flight simply redirects both ends from wherever they are.
   */
  const listRef = useRef<HTMLOListElement>(null)
  const blocks = useRef<(HTMLDivElement | null)[]>([])
  const top = useMotionValue(0)
  const bottom = useMotionValue(0)
  const down = useRef(true)
  const railY = useTransform<number, number>([top, bottom], ([t, b]) =>
    // at its shortest the line reaches ahead from its trailing end
    b - t >= SHORT || down.current ? t : b - SHORT,
  )
  const railH = useTransform<number, number>([top, bottom], ([t, b]) => (b === 0 ? 0 : Math.max(SHORT, b - t)))
  // nothing is marked until the list has actually been reached
  const started = useInView(listRef, { once: true, margin: '0px 0px -45% 0px' })

  // the day chips on the photo: bring that day to the middle of the screen,
  // where the list already listens for the day in view
  const lenis = useLenis()
  const jumpTo = (i: number) => {
    const el = blocks.current[i]
    if (!el) return
    const target = el.getBoundingClientRect().top + window.scrollY - (window.innerHeight - el.offsetHeight) / 2
    if (lenis) lenis.scrollTo(target, { duration: 1.2 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!started) return
    const measure = () => {
      const el = blocks.current[active]
      const li = el?.offsetParent as HTMLElement | null
      // offsets, not rects: they ignore the blocks' own entrance transforms
      return el && li ? { top: li.offsetTop + el.offsetTop, bottom: li.offsetTop + el.offsetTop + el.offsetHeight } : null
    }
    const to = measure()
    if (!to) return

    let runs: ReturnType<typeof animate>[] = []
    const first = bottom.get() === 0
    if (reduced) {
      top.set(to.top)
      bottom.set(to.bottom)
    } else if (first) {
      // first arrival: grow down from the day's top
      top.set(to.top)
      bottom.set(to.top + SHORT)
      runs = [animate(bottom, to.bottom, { duration: 0.9, ease })]
    } else {
      down.current = to.top > top.get()
      const distance = Math.abs(to.top - top.get())
      const d = 0.9 + Math.min(0.5, distance / 1500)
      const [tail, head] = down.current ? [top, bottom] : [bottom, top]
      const [tailTo, headTo] = down.current ? [to.top, to.bottom] : [to.bottom, to.top]
      runs = [
        animate(tail, tailTo, { duration: d * 0.7, ease: glide }),
        animate(head, headTo, { duration: d * 0.75, delay: d * 0.25, ease: glide }),
      ]
    }

    let moving = runs.length > 0
    Promise.all(runs).then(() => (moving = false))
    // text reflows on resize: re-seat the line without animating
    const ro = new ResizeObserver(() => {
      const m = measure()
      if (!m || moving) return
      top.set(m.top)
      bottom.set(m.bottom)
    })
    if (listRef.current) ro.observe(listRef.current)
    return () => {
      runs.forEach((r) => r.stop())
      ro.disconnect()
    }
  }, [active, started, reduced, top, bottom])

  return (
    <section id="itinerary" aria-labelledby="itinerary-title" className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          label="Itinerary"
          id="itinerary-title"
          title="Five days in Kashi"
        />

        <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {!mobile && (
            <div>
              <div className="sticky top-[calc(50px+50svh-min(100svh-160px,640px)/2)] h-[min(calc(100svh-160px),640px)] overflow-hidden rounded-[28px] bg-night">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={day.image.src}
                    src={day.image.src}
                    alt={day.image.caption}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0" aria-hidden />
                <span className="absolute top-5 right-5 rounded-full bg-black/25 px-3 py-1 type-caption text-white/85 backdrop-blur-md">
                  {day.image.caption}
                </span>
                <div className="absolute bottom-7 left-8 flex items-end gap-3 text-white">
                  <span className="type-display-s text-white/70">Day</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={day.day}
                      className="font-display text-[120px] leading-[0.75] font-semibold tabular-nums"
                      initial={{ opacity: 0, y: 30, ...blur(8) }}
                      animate={{ opacity: 1, y: 0, ...blur(0) }}
                      exit={{ opacity: 0, y: -30, ...blur(8) }}
                      transition={{ duration: 0.7, ease }}
                    >
                      0{day.day}
                    </motion.span>
                  </AnimatePresence>
                </div>
                {/* where you are among the five, and a way to any of them */}
                <nav aria-label="Itinerary days" className="absolute right-7 bottom-7 flex gap-1.5">
                  {itinerary.map((d, i) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Day ${d.day}: ${d.title}`}
                      aria-current={i === active ? 'step' : undefined}
                      className={`grid h-9 w-9 place-items-center rounded-full type-chip tabular-nums transition-colors duration-300 ${
                        i === active ? 'bg-white text-ink' : 'bg-black/25 text-white/80 backdrop-blur-md hover:bg-black/45 hover:text-white'
                      }`}
                    >
                      {d.day}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          <ol ref={listRef} className="relative">
            {/* one grey track down the whole list; the saffron line rides it */}
            <span className="absolute inset-y-0 left-0 w-[2px] rounded-full bg-line-soft" aria-hidden />
            <motion.span
              className="absolute top-0 left-0 w-[2px] rounded-full bg-saffron"
              style={{ y: railY, height: railH }}
              aria-hidden
            />
            {itinerary.map((d, i) => (
              <DayItem
                key={d.day}
                day={d}
                index={i}
                on={mobile || i === active}
                blockRef={(el) => {
                  blocks.current[i] = el
                }}
                onCentre={setActive}
                mobile={mobile}
              />
            ))}
          </ol>
        </div>

        <p className="mt-10 max-w-[620px] type-body-sm text-ink-mute lg:ml-[calc(50%+32px)]">
          The itinerary is indicative of the places we will visit. The actual order may vary depending on several factors.
        </p>
      </div>
    </section>
  )
}

function DayItem({
  day,
  index,
  on,
  blockRef,
  onCentre,
  mobile,
}: {
  day: Day
  index: number
  on: boolean
  blockRef: (el: HTMLDivElement | null) => void
  onCentre: (i: number) => void
  mobile: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const centred = useInView(ref, { margin: '-45% 0px -50% 0px' })
  useEffect(() => {
    if (centred) onCentre(index)
  }, [centred, index, onCentre])

  return (
    <li
      ref={ref}
      className={`relative pb-14 pl-8 transition-opacity duration-700 last:pb-0 md:pl-10 lg:flex lg:min-h-[62svh] lg:flex-col lg:justify-center lg:pb-0 ${on ? 'opacity-100' : 'opacity-35'}`}
    >

      <motion.div
        ref={blockRef}
        className="relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 1, ease }}
      >
        {mobile && (
          <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[22px] bg-night">
            <img src={day.image.src} alt={day.image.caption} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span className="absolute right-3 bottom-3 rounded-full bg-black/30 px-2.5 py-1 type-caption text-white/90">
              {day.image.caption}
            </span>
          </div>
        )}
        <span className="block type-label-sm text-saffron tabular-nums">Day 0{day.day}</span>
        <h3 className="mt-1.5 type-h3 text-ink">{day.title}</h3>
        <Route stops={day.route} />
        {day.body.map((p) => (
          <p key={p.slice(0, 24)} className="mt-4 type-body text-ink-soft">
            {p}
          </p>
        ))}
      </motion.div>
    </li>
  )
}

/**
 * The day's stops in the order it runs, split wherever the day gives a cue
 * ("Before dawn", "Evening", "~2 hrs by road"): the cue sits on its own line
 * and that stretch's stops follow beneath it as connected pills. Each joint
 * is drawn by the stop after it, reaching back across the gap, so when a row
 * wraps the row's overflow clips the joint off the first stop of the new line.
 */
function Route({ stops }: { stops: Stop[] }) {
  const legs: { cue: string; stops: Stop[] }[] = []
  for (const s of stops) {
    // "Evening · back to Kashi": the travel note follows the cue in lower case
    const travel = s.travel && s.when ? s.travel[0].toLowerCase() + s.travel.slice(1) : s.travel
    const cue = [s.when, travel].filter(Boolean).join(' · ')
    if (cue || !legs.length) legs.push({ cue, stops: [s] })
    else legs[legs.length - 1].stops.push(s)
  }

  return (
    <div className="mt-4 space-y-3">
      {legs.map((leg) => (
        <div key={leg.stops[0].place}>
          {leg.cue && <p className="mb-1.5 type-caption font-medium text-ink-mute">{leg.cue}</p>}
          <ol className="flex flex-wrap items-center gap-2">
            {leg.stops.map((s) => (
              <li
                key={s.place}
                className="rounded-full bg-[rgba(120,72,30,0.08)] px-3 py-1 type-body-sm font-medium whitespace-nowrap text-ink"
              >
                {s.place}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
