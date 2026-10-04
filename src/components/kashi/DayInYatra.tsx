import { useRef, useState } from 'react'
import { AnimatePresence, motion, transform, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
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

// where the sun is for each stretch of the day: 0 and 1 are the horizon,
// below 0 is before sunrise and above 1 after sunset
const SUN_AT = [-0.12, -0.03, 0.3, 0.55, 0.88, 1.03, 1.12]
// where each moment starts in the scroll; the dark at either end is kept short
// and about even, so night turns to sunrise, and sunset to the end, quickly
const STOPS = [0, 0.1, 0.28, 0.46, 0.7, 0.9, 1]
// lamps along the river, lit while the sun is down
const LAMPS = [9, 15, 22, 30, 66, 74, 81, 89]
// lens ghosts: k is how far along the line from the sun through the sky's
// middle each sits (past 1 lands on the far side), with its size and tint
const GHOSTS = [
  { k: 0.55, size: 12, color: 'rgba(255,236,200,0.6)' },
  { k: 1.25, size: 44, color: 'rgba(255,214,170,0.2)' },
  { k: 1.6, size: 18, color: 'rgba(190,220,255,0.35)' },
  { k: 1.9, size: 72, color: 'rgba(255,200,150,0.12)' },
]
// the disc's colour by the sun's place: low and red at the horizon, warm gold
// as it climbs, near white at the top of the arc, and back through gold to red
const SUN_COLOR: [number[], string[]] = [
  [-0.02, 0.04, 0.16, 0.5, 0.84, 0.96, 1.02],
  ['#c8381c', '#ff6a2e', '#ffb867', '#fff8e8', '#ffc678', '#ff6a2e', '#c8381c'],
]
// the sky: black at night, deep blue as the light comes, open blue by day,
// warm at the horizon around sunrise and sunset; the river below stays darker
const SKY_AT = [-0.12, -0.03, 0.04, 0.3, 0.55, 0.85, 1.0, 1.08, 1.12]
const SKY_TOP = ['#0a0a0b', '#14163a', '#2a3a78', '#2c66a8', '#2a6cb6', '#2f5f9e', '#262b66', '#121331', '#0a0a0b']
const SKY_LOW = ['#0a0a0b', '#2e2752', '#c96a45', '#7fb0d6', '#93c0e2', '#d9a868', '#c45a36', '#2b2450', '#0a0a0b']
const RIVER = ['#0a0a0b', '#0e0f22', '#1d1b30', '#14273c', '#152a42', '#1f2233', '#1a1428', '#0c0c18', '#0a0a0b']
// the sun's height in the arc's box, as a fraction from the top
const SUN_Y = '(1 - sin(var(--s) * 180deg))'

/**
 * Bonding with light: the rhythm most days share, told by the sun. Not a
 * timetable: the moments are times of day, and the copy says plainly that
 * days differ. On desktop the section pins and scrolling carries the sun
 * from below the horizon before dawn, over its arc, and down again after
 * the evening arati; lamps along the river burn while it is dark, so the day
 * runs from first lamp to last. The sky glow warms from indigo to saffron to
 * gold and back. Motion drives one variable (--s, the sun's place) and CSS
 * positions the sun from it (sin() gives the arc, and dips below past its ends).
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
    title="What a typical day looks like"
    dark
  />
)

function SunDay() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // a short hold at each end (the sky is already moving by then)
  const p = useScrollRange(scrollYProgress, [0.02, 0.97], [0, 1])
  // each moment owns its stretch of the scroll; the sun's pace changes with it
  const sun = useScrollRange(p, STOPS, SUN_AT)
  // the blue lifts quickly through dawn and breaks into saffron right at the horizon
  const glow = useScrollRange(
    sun,
    [-0.12, -0.07, -0.02, 0.04, 0.5, 0.9, 1.03, 1.12],
    ['#2c2f73', '#4348a6', '#8a4f8c', '#e8622c', '#ffe7b8', '#f08a3e', '#3b3f8f', '#2c2f73'],
  )
  const sunColor = useScrollRange(sun, ...SUN_COLOR)
  // the flare only shows while the sun is well up
  const flare = useScrollRange(sun, [0.04, 0.2, 0.8, 0.96], [0, 1, 1, 0])
  // the pale rim round the disc belongs to the high sun; low on the horizon it is all red
  const rim = useScrollRange(sun, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0])
  const sunBloom = useTransform(
    rim,
    (f) =>
      `0 0 6px 2px rgba(255,255,255,${(0.35 * f).toFixed(3)}), 0 0 22px 6px currentColor, 0 0 60px 18px color-mix(in srgb, currentColor 45%, transparent)`,
  )
  const wash = useTransform(glow, (c) => `radial-gradient(closest-side, ${c}, transparent)`)
  const skyTop = useScrollRange(sun, SKY_AT, SKY_TOP)
  const skyLow = useScrollRange(sun, SKY_AT, SKY_LOW)
  const river = useScrollRange(sun, SKY_AT, RIVER)
  const sky = useTransform(
    () =>
      `linear-gradient(to bottom, ${skyTop.get()} 0%, ${skyLow.get()} calc(100% - 263px), ${river.get()} calc(100% - 262px), ${river.get()} 100%)`,
  )
  const sunOpacity = useScrollRange(sun, [-0.06, 0, 1, 1.06], [0, 1, 1, 0])
  const lampsOpacity = useScrollRange(sun, [-0.12, -0.04, 0.03, 0.92, 1.02, 1.12], [1, 1, 0, 0, 1, 1])
  const [active, setActive] = useState(0)
  useMotionValueEvent(p, 'change', (v) => {
    const i = Math.min(dayMoments.length - 1, Math.max(0, STOPS.findLastIndex((s) => v >= s)))
    setActive((prev) => (prev === i ? prev : i))
  })
  const m = dayMoments[active]

  return (
    <div ref={ref} className="h-[360vh]">
      <motion.div
        className="sticky top-[100px] flex h-[calc(100svh-100px)] flex-col overflow-hidden px-5 pt-12 pb-8"
        style={{ '--s': sun } as never}
      >
        <motion.div className="absolute inset-0 -z-10" style={{ background: sky }} aria-hidden />
        <div className="mx-auto w-full max-w-[1180px]">{heading}</div>

        {/* the sky: arc, glow and sun share one box so CSS can place the sun on the arc */}
        <div className="relative mx-auto mt-6 min-h-0 w-full max-w-[1180px] flex-1">
          <div className="absolute inset-x-[4%] top-[6%] bottom-[230px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <path d={ARC} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
            {/* the trail behind the sun: the same arc, solid, uncovered left to right as it climbs */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              style={{ clipPath: 'inset(-20px calc((1 - clamp(0, var(--s), 1)) * 100%) -20px -20px)' }}
              aria-hidden
            >
              {/* the path keeps the colour the sun had at each point: red at the
                  horizons, gold on the climb, pale at the top */}
              <defs>
                <linearGradient id="sun-trail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
                  <stop offset="0" stopColor="#ff6a2e" />
                  <stop offset="0.18" stopColor="#ffb867" />
                  <stop offset="0.5" stopColor="#fff3dc" />
                  <stop offset="0.82" stopColor="#ffc678" />
                  <stop offset="1" stopColor="#ff6a2e" />
                </linearGradient>
              </defs>
              <path d={ARC} fill="none" stroke="url(#sun-trail)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* a zero-size anchor; left/top percentages refer to the arc's box */}
            <div
              className="absolute h-0 w-0"
              style={{ left: 'calc(var(--s) * 100%)', top: `calc(${SUN_Y} * 100%)` }}
            >
              <motion.span
                className="absolute top-1/2 left-1/2 block h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45"
                style={{ background: wash }}
                aria-hidden
              />
              {/* the disc, with a tight bright core and a wider bloom in its own colour */}
              <motion.span
                className="absolute top-1/2 left-1/2 block h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  backgroundColor: sunColor,
                  color: sunColor,
                  opacity: sunOpacity,
                  boxShadow: sunBloom,
                }}
                aria-hidden
              />
            </div>
            {/* lens ghosts, strung on the line from the sun through the middle of the sky */}
            <motion.div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen" style={{ opacity: flare }} aria-hidden>
              {GHOSTS.map((g) => (
                <span
                  key={g.k}
                  className="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: `calc((var(--s) + (0.5 - var(--s)) * ${g.k}) * 100%)`,
                    top: `calc((${SUN_Y} + (0.75 - ${SUN_Y}) * ${g.k}) * 100%)`,
                    width: g.size,
                    height: g.size,
                    background: `radial-gradient(closest-side, ${g.color}, transparent)`,
                    boxShadow: g.size > 30 ? `inset 0 0 0 1px ${g.color}` : undefined,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* the river line the sun rises from and sets into */}
          <span className="absolute inset-x-0 bottom-[230px] h-px bg-white/15" aria-hidden />
          <motion.div className="absolute inset-x-0 bottom-[230px]" style={{ opacity: lampsOpacity }} aria-hidden>
            {LAMPS.map((x) => (
              <Diya key={x} x={x} />
            ))}
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_1.2fr] items-end gap-10">
            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={m.when}
                  initial={{ opacity: 0, y: 16, ...blur(8) }}
                  animate={{ opacity: 1, y: 0, ...blur(0) }}
                  exit={{ opacity: 0, y: -12, ...blur(6) }}
                  transition={{ duration: 0.55, ease }}
                >
                  <span className="type-label text-[#f2c27a]">{m.when}</span>
                  <h3 className="mt-2 type-title-l">{m.title}</h3>
                  <p className="mt-3 max-w-[480px] type-lead text-white/80">{m.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <ol className="grid grid-cols-6 gap-3 pb-1" aria-hidden>
              {dayMoments.map((d, i) => (
                <li key={d.when}>
                  <span className="block h-[2px] overflow-hidden rounded-full bg-white/15">
                    <motion.span
                      className="block h-full origin-left bg-saffron-2"
                      initial={false}
                      animate={{ scaleX: i <= active ? 1 : 0 }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </span>
                  <span className={`mt-2.5 block type-caption font-medium whitespace-nowrap transition-colors duration-500 ${i <= active ? 'text-white' : 'text-white/55'}`}>
                    {d.when}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// a small clay lamp: a shallow bowl and one flame
function Diya({ x }: { x: number }) {
  return (
    <svg
      viewBox="0 0 16 14"
      className="absolute bottom-0 h-[14px] w-[16px] -translate-x-1/2 overflow-visible"
      style={{ left: `${x}%` }}
    >
      <path d="M1 8.5h14C14 11.5 11.5 13 8 13S2 11.5 1 8.5Z" fill="#b5652f" />
      <path
        d="M8 1.2C9.6 3.4 10 4.8 10 5.7a2 2 0 0 1-4 0c0-.9.4-2.3 2-4.5Z"
        fill="#ffcf7a"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,170,80,0.9))' }}
      />
    </svg>
  )
}

// where the sun sits in the middle of each moment, for the phone timeline's dots
const MOMENT_SUN = dayMoments.map((_, i) => (SUN_AT[i] + SUN_AT[i + 1]) / 2)
const sunColorAt = transform(...SUN_COLOR)
// the phone sky, keyed to the list rather than the sun: the moments are evenly
// spaced, so dawn and dusk each get a real stretch of scroll (around the turn
// into Morning and through Evening) instead of the sliver they get on desktop
const PHONE_AT = [0, 0.1, 0.17, 0.25, 0.33, 0.45, 0.6, 0.71, 0.8, 0.9, 1]
const PHONE_TOP = ['#0a0a0b', '#15163d', '#2c2a66', '#5a3d78', '#2c5f9f', '#2a6cb6', '#2c64a6', '#3a3f80', '#2e2560', '#131433', '#0a0a0b']
const PHONE_LOW = ['#0a0a0b', '#272356', '#9a4a52', '#c8602f', '#4f86b8', '#4b88c2', '#a07a5a', '#c4602f', '#9a3b2c', '#231d45', '#0a0a0b']

/**
 * Phones: the same moments as a list. The sky behind it follows the day as the
 * list scrolls past: night, a saffron dawn, blue, a red dusk, night again. Each
 * moment's dot is the sun as it is then (none in the dark). The tones stay deep
 * enough for the white text throughout.
 */
function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.55', 'end 0.55'] })
  const skyTop = useScrollRange(scrollYProgress, PHONE_AT, PHONE_TOP)
  const skyLow = useScrollRange(scrollYProgress, PHONE_AT, PHONE_LOW)
  const sky = useTransform(() => `linear-gradient(to bottom, ${skyTop.get()} 15%, ${skyLow.get()})`)
  return (
    <div className="relative overflow-clip px-4 py-20">
      <motion.div className="sticky top-0 -mx-4 -mt-20 -mb-[calc(100svh-5rem)] h-[100svh]" style={{ background: sky }} aria-hidden />
      <div className="relative">
        {heading}
        <ol ref={ref} className="relative mt-10">
          <span
            className="absolute top-3 bottom-3 left-[7px] w-px"
            style={{ background: 'linear-gradient(to bottom, #3b3f8f, #ff6a2e 18%, #ffb867 30%, #fff3dc 45%, #ffc678 62%, #ff6a2e 78%, #3b3f8f)' }}
            aria-hidden
          />
          {dayMoments.map((d, i) => {
            const up = MOMENT_SUN[i] > 0 && MOMENT_SUN[i] < 1
            const c = sunColorAt(MOMENT_SUN[i])
            return (
              <motion.li
                key={d.when}
                className="relative pb-9 pl-9 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.9, ease, delay: Math.min(i, 1) * 0.05 }}
              >
                <span
                  className="absolute top-0.5 left-0 h-[15px] w-[15px] rounded-full border-[1.5px]"
                  style={
                    up
                      ? { backgroundColor: c, borderColor: c, boxShadow: `0 0 12px 3px color-mix(in srgb, ${c} 55%, transparent)` }
                      : { backgroundColor: '#0a0a0b', borderColor: '#8a8fd0' }
                  }
                  aria-hidden
                />
                <span className="type-label-sm text-[#f2c27a]">{d.when}</span>
                <h3 className="mt-1 type-title-s">{d.title}</h3>
                <p className="mt-2 type-body-sm text-white/75">{d.body}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
