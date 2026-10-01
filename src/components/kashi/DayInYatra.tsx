import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { dayMoments } from '../../data/kashi'
import { useScrollRange } from '../../lib/useScrollRange'
import { useIsMobile } from '../../lib/useIsMobile'
import { blur } from '../../lib/lite'
import { ease, inView, SectionHeading } from './shared'

// the sine the sun travels on, drawn once into a 0–100 box
const ARC = Array.from({ length: 61 }, (_, i) => {
  const x = (i / 60) * 100
  return `${i ? 'L' : 'M'}${x.toFixed(2)},${(100 - Math.sin((Math.PI * x) / 100) * 100).toFixed(2)}`
}).join(' ')

/**
 * Bonding with light: one day, told by the sun. On desktop the section pins
 * and scrolling carries a sun along its arc from the dark before Mangala
 * Arati to the lamps on the Ganga; the sky glow behind it warms from indigo
 * to saffron to gold and back. Like the hero, Motion drives a single 0→1
 * variable (--p) and CSS places the sun from it (sin() gives the arc).
 * Phones get the same moments as a plain timeline.
 */
export default function DayInYatra() {
  const mobile = useIsMobile()
  return (
    <section id="day" data-opaque aria-labelledby="day-title" className="relative bg-night text-white">
      {mobile ? <Timeline /> : <SunDay />}
    </section>
  )
}

const heading = (
  <SectionHeading
    label="A day in the yatra"
    id="day-title"
    title="From first lamp to last"
    dark
    lede="Every day is different, but most follow the light. Here is how one might unfold."
  />
)

function SunDay() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // short holds at both ends, as in the journey section
  const p = useScrollRange(scrollYProgress, [0.06, 0.94], [0, 1])
  const glow = useScrollRange(p, [0, 0.18, 0.5, 0.82, 1], ['#3b3f8f', '#cf4520', '#f2b65a', '#cd6727', '#3b3f8f'])
  const wash = useTransform(glow, (c) => `radial-gradient(closest-side, ${c}, transparent)`)
  const [active, setActive] = useState(0)
  useMotionValueEvent(p, 'change', (v) => {
    const i = Math.min(dayMoments.length - 1, Math.floor(v * dayMoments.length))
    setActive((prev) => (prev === i ? prev : i))
  })
  const m = dayMoments[active]

  return (
    <div ref={ref} className="h-[360vh]">
      <motion.div
        className="sticky top-[100px] flex h-[calc(100svh-100px)] flex-col overflow-hidden px-5 pt-12 pb-8"
        style={{ '--p': p } as never}
      >
        <div className="mx-auto w-full max-w-[1180px]">{heading}</div>

        {/* the sky: arc, glow and sun share one box so CSS can place the sun on the arc */}
        <div className="relative mx-auto mt-6 min-h-0 w-full max-w-[1180px] flex-1">
          <div className="absolute inset-x-[4%] top-[6%] bottom-[230px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <path d={ARC} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
            {/* the trail behind the sun: the same arc, solid, uncovered left to right up to --p */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              style={{ clipPath: 'inset(-20px calc((1 - var(--p)) * 100%) -20px -20px)' }}
              aria-hidden
            >
              <path d={ARC} fill="none" stroke="#e39a52" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* a zero-size anchor; left/top percentages refer to the arc's box */}
            <div
              className="absolute h-0 w-0"
              style={{ left: 'calc(var(--p) * 100%)', top: 'calc((1 - sin(var(--p) * 180deg)) * 100%)' }}
            >
              <motion.span
                className="absolute top-1/2 left-1/2 block h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45"
                style={{ background: wash }}
                aria-hidden
              />
              <motion.span
                className="absolute top-1/2 left-1/2 block h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_40px_8px_rgba(242,182,90,0.55)]"
                style={{ backgroundColor: glow }}
                aria-hidden
              />
            </div>
          </div>

          {/* the river line the sun rises from and sets into */}
          <span className="absolute inset-x-0 bottom-[230px] h-px bg-white/15" aria-hidden />

          <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_1.2fr] items-end gap-10">
            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={m.time}
                  initial={{ opacity: 0, y: 16, ...blur(8) }}
                  animate={{ opacity: 1, y: 0, ...blur(0) }}
                  exit={{ opacity: 0, y: -12, ...blur(6) }}
                  transition={{ duration: 0.55, ease }}
                >
                  <span className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.85] font-semibold tabular-nums text-[#f2c27a]">
                    {m.time}
                  </span>
                  <h3 className="mt-3 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none font-semibold">{m.title}</h3>
                  <p className="mt-3 max-w-[420px] text-[16px] leading-[1.5] text-white/70">{m.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <ol className="grid grid-cols-6 gap-3 pb-1" aria-hidden>
              {dayMoments.map((d, i) => (
                <li key={d.time}>
                  <span className="block h-[2px] overflow-hidden rounded-full bg-white/15">
                    <motion.span
                      className="block h-full origin-left bg-saffron-2"
                      initial={false}
                      animate={{ scaleX: i <= active ? 1 : 0 }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </span>
                  <span className={`mt-2.5 block text-[13px] font-medium tabular-nums transition-colors duration-500 ${i <= active ? 'text-white' : 'text-white/40'}`}>
                    {d.time}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mx-auto mt-6 w-full max-w-[1180px] text-[12.5px] text-white/40">Timings are indicative and change from day to day.</p>
      </motion.div>
    </div>
  )
}

function Timeline() {
  return (
    <div className="px-4 py-20">
      {heading}
      <ol className="relative mt-10">
        <span className="absolute top-3 bottom-3 left-[7px] w-px bg-gradient-to-b from-[#3b3f8f] via-saffron to-[#3b3f8f]" aria-hidden />
        {dayMoments.map((d, i) => (
          <motion.li
            key={d.time}
            className="relative pb-9 pl-9 last:pb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, ease, delay: Math.min(i, 1) * 0.05 }}
          >
            <span className="absolute top-2.5 left-0 h-[15px] w-[15px] rounded-full border-[1.5px] border-saffron-2 bg-night" aria-hidden />
            <span className="font-display text-[34px] leading-none font-semibold text-[#f2c27a] tabular-nums">{d.time}</span>
            <h3 className="mt-1 font-display text-[24px] leading-none font-semibold">{d.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.5] text-white/70">{d.body}</p>
          </motion.li>
        ))}
      </ol>
      <p className="mt-10 text-[12.5px] text-white/40">Timings are indicative and change from day to day.</p>
    </div>
  )
}
