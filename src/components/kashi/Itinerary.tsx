import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { itinerary, type Day } from '../../data/kashi'
import { blur } from '../../lib/lite'
import { ease, inView, SectionHeading } from './shared'

/**
 * Desktop: the days scroll past on the right while a framed photograph holds
 * still on the left and changes with them, the new day's picture settling
 * in from 1.08× as the old one lets go. A grey rail runs down the days;
 * each day's stretch of it fills with saffron when you reach that day and
 * stays filled behind you; the day in view stays bright while the others fall back.
 * Mobile: each day carries its own photograph and the page reads straight down.
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

export default function Itinerary() {
  const [active, setActive] = useState(0)
  const mobile = useStacked()
  const day = itinerary[active]

  return (
    <section id="itinerary" aria-labelledby="itinerary-title" className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          label="Itinerary"
          id="itinerary-title"
          title="Five days in Kashi"
          lede="From the deer park where the Buddha first spoke to the Guru Pooja that closes the yatra."
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
                <span className="absolute top-5 right-5 rounded-full bg-black/25 px-3 py-1 text-[12px] text-white/85 backdrop-blur-md">
                  {day.image.caption}
                </span>
                <div className="absolute bottom-7 left-8 flex items-end gap-3 text-white">
                  <span className="font-display text-[22px] leading-none font-semibold text-white/70">Day</span>
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
              </div>
            </div>
          )}

          <ol className="relative">
            {/* one grey track down the whole list; each day draws its saffron over it */}
            <span className="absolute inset-y-0 left-0 w-[2px] rounded-full bg-line-soft" aria-hidden />
            {itinerary.map((d, i) => (
              <DayItem
                key={d.day}
                day={d}
                index={i}
                on={mobile || i === active}
                reached={i <= active}
                onCentre={setActive}
                mobile={mobile}
              />
            ))}
          </ol>
        </div>

        <p className="mt-10 max-w-[620px] text-[13.5px] leading-[1.5] text-ink-mute lg:ml-[calc(50%+32px)]">
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
  reached,
  onCentre,
  mobile,
}: {
  day: Day
  index: number
  on: boolean
  reached: boolean
  onCentre: (i: number) => void
  mobile: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const centred = useInView(ref, { margin: '-45% 0px -50% 0px' })
  useEffect(() => {
    if (centred) onCentre(index)
  }, [centred, index, onCentre])
  // phones read straight down: a day's rail fills as it comes into view
  const seen = useInView(ref, { once: true, margin: '0px 0px -40% 0px' })
  const filled = mobile ? seen : reached

  return (
    <li
      ref={ref}
      className={`relative pb-14 pl-8 transition-opacity duration-700 last:pb-0 md:pl-10 lg:flex lg:min-h-[62svh] lg:flex-col lg:justify-center lg:pb-0 ${on ? 'opacity-100' : 'opacity-35'}`}
    >

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 1, ease }}
      >
        {/* this day's stretch of the rail, the height of its text, filling top down */}
        <span className="absolute inset-y-0 -left-8 w-[2px] overflow-hidden rounded-full md:-left-10" aria-hidden>
          <motion.span
            className="block h-full w-full origin-top rounded-full bg-saffron"
            initial={false}
            animate={{ scaleY: filled ? 1 : 0 }}
            transition={{ duration: 0.9, ease }}
          />
        </span>
        {mobile && (
          <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[22px] bg-night">
            <img src={day.image.src} alt={day.image.caption} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span className="absolute right-3 bottom-3 rounded-full bg-black/30 px-2.5 py-1 text-[11.5px] text-white/90">
              {day.image.caption}
            </span>
          </div>
        )}
        <span className="block text-[13px] font-semibold text-saffron tabular-nums md:text-[14px]">Day 0{day.day}</span>
        <h3 className="mt-1.5 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1] font-semibold text-ink">{day.title}</h3>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {day.places.map((p) => (
            <li key={p} className="rounded-full bg-[rgba(120,72,30,0.08)] px-3 py-1 text-[13px] font-medium text-ink">
              {p}
            </li>
          ))}
        </ul>
        {day.body.map((p) => (
          <p key={p.slice(0, 24)} className="mt-4 text-[15.5px] leading-[1.6] text-ink-soft md:text-[16.5px]">
            {p}
          </p>
        ))}
      </motion.div>
    </li>
  )
}
