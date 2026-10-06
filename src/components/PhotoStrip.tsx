import { useLayoutEffect, useRef } from 'react'
import {
  motion,
  type PanInfo,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { gallery, type Shot } from '../data/gallery'
import { photo } from '../lib/photo'

const ease = [0.16, 1, 0.3, 1] as const
const SPEED = 38 // px per second at rest

/**
 * A ribbon of yatra photographs drifting under the stories. It idles slowly
 * to the left; page scroll pushes it along (and back, when scrolling up), so
 * the strip seems to travel with the reader. Hover eases it to a stop, and
 * it can be grabbed and flung by hand; a fling coasts out on its momentum.
 *
 * The set is rendered twice and the track wraps by one set's width, so it
 * runs forever without a seam.
 */
export default function PhotoStrip() {
  const reduced = useReducedMotion()
  const setRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  // no need to drive the ribbon while it is off screen
  const onScreen = useInView(sectionRef)
  const setWidth = useRef(0)
  useLayoutEffect(() => {
    const el = setRef.current
    if (!el) return
    const ro = new ResizeObserver(() => (setWidth.current = el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // scroll velocity → extra speed, smoothed so a flick swells and settles
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 })
  const boost = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false })
  // hover eases the whole thing to rest rather than freezing it
  const pace = useSpring(1, { damping: 30, stiffness: 120 })

  const x = useMotionValue(0)
  const dir = useRef(1)
  const held = useRef(false)
  const fling = useRef(0) // px/s left over from a release, decaying to nothing

  // keep x inside one set's width, so the copy covers the seam either way
  const wrapTo = (v: number) => {
    const w = setWidth.current
    if (!w) return v
    return ((v % w) - w) % w
  }

  useAnimationFrame((_, delta) => {
    if (reduced || !onScreen || !setWidth.current || held.current) return
    const dt = delta / 1000
    const b = boost.get()
    // scrolling up turns the strip around; it keeps that heading until scrolled down again
    if (b < -0.05) dir.current = -1
    else if (b > 0.05) dir.current = 1
    const drift = dir.current * SPEED * (1 + Math.abs(b)) * pace.get()
    fling.current *= Math.pow(0.04, dt) // momentum bleeds off over about a second
    if (Math.abs(fling.current) < 4) fling.current = 0
    x.set(wrapTo(x.get() - drift * dt + fling.current * dt))
  })

  const onPan = (_: PointerEvent, info: PanInfo) => x.set(wrapTo(x.get() + info.delta.x))
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    held.current = false
    fling.current = info.velocity.x
    // carry on drifting the way it was thrown
    if (Math.abs(info.velocity.x) > 50) dir.current = info.velocity.x < 0 ? 1 : -1
  }

  return (
    // the grey of the stories gives way to the page's warm light under the strip,
    // so the closing card sits in the glow rather than on grey
    <section
      ref={sectionRef}
      // from here to the footer the ambient light rests
      data-still-light
      aria-label="Moments from the yatras"
      className="overflow-hidden bg-[linear-gradient(to_bottom,var(--color-mist)_0%,var(--color-mist)_55%,transparent_100%)] pt-24 pb-24 md:pt-40 md:pb-36"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1, ease }}
        // the ribbon dissolves into the page at both edges
        className={`[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] ${reduced ? 'overflow-x-auto' : ''}`}
        onMouseEnter={() => pace.set(0)}
        onMouseLeave={() => pace.set(1)}
      >
        <motion.div
          className={`flex w-max ${reduced ? '' : 'cursor-grab touch-pan-y will-change-transform active:cursor-grabbing'}`}
          style={{ x }}
          onPanStart={reduced ? undefined : () => ((held.current = true), (fling.current = 0))}
          onPan={reduced ? undefined : onPan}
          onPanEnd={reduced ? undefined : onPanEnd}
        >
          <div ref={setRef} className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4">
            {gallery.map((s) => (
              <Tile key={s.src} shot={s} />
            ))}
          </div>
          {/* the seam: an identical copy that slides in as the first one leaves */}
          <div className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4" aria-hidden>
            {gallery.map((s) => (
              <Tile key={s.src} shot={s} decorative />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Tile({ shot, decorative = false }: { shot: Shot; decorative?: boolean }) {
  return (
    <figure
      className={`group/tile relative h-[clamp(150px,17vw,230px)] shrink-0 overflow-hidden rounded-[20px] bg-mist-2 ${
        shot.tall ? 'aspect-[4/5]' : 'aspect-[3/2]'
      }`}
    >
      <img
        {...photo(shot.src)}
        alt={decorative ? '' : shot.alt}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] select-none group-hover/tile:scale-[1.05]"
      />
      {/* glass badge, as on the yatra photos: always on touch, on hover with a mouse */}
      <figcaption className="pointer-events-none absolute bottom-3 left-3 translate-y-1 rounded-full bg-black/30 px-3 py-1.5 type-caption font-medium text-white opacity-0 md:backdrop-blur-xl transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] group-hover/tile:translate-y-0 group-hover/tile:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
        {shot.yatra}
      </figcaption>
    </figure>
  )
}
