import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { yatraPage, type Yatra } from '../../data/yatras'
import { IconChevronLeft, IconChevronRight, IconPause, IconPlay } from '../icons'

const DURATION = 6 // seconds per slide
const ease = [0.16, 1, 0.3, 1] as const
// one spring for autoplay, dots, arrows and swipe release: settles fast, no bounce
const slide = { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 } as const

/**
 * Airbnb gestures (hover arrows, glass badges) + Apple's carousel capsule
 * (dots where the active one stretches into a timer, with play/pause).
 *
 * Photos sit side by side on one track that is translated as a whole: every
 * image stays mounted (no remount, no decode on change), and the same track
 * is dragged for swipe, so a gesture hands off to the spring with its velocity.
 */
export default function ImageCarousel({ yatra }: { yatra: Yatra }) {
  const { images, quote } = yatra
  const navigate = useNavigate()
  const n = images.length
  // pos can sit one step past either end, on a clone of the far image; once the
  // spring lands there it jumps (invisibly) to the real one, so the strip loops
  // forever instead of rewinding. The dots only ever see index.
  const [pos, setPos] = useState(0)
  const index = ((pos % n) + n) % n
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)

  const frameRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const widthRef = useRef(0)
  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const measure = () => {
      widthRef.current = el.clientWidth
      setWidth(el.clientWidth)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [])

  // track slot for a position: slot 0 is the leading clone
  const x = useMotionValue(0)
  const at = (p: number) => -(p + 1) * widthRef.current
  const wrap = useCallback((p: number) => (p >= n ? p - n : p < 0 ? p + n : p), [n])

  // from a clone, hop to its real twin (same pixels) before moving on
  const moveTo = useCallback(
    (next: (p: number) => number) =>
      setPos((p) => {
        const q = wrap(p)
        if (q !== p) x.set(-(q + 1) * widthRef.current)
        return next(q)
      }),
    [wrap, x],
  )
  const step = useCallback((d: number) => moveTo((p) => p + d), [moveTo])
  const goTo = (i: number) => moveTo(() => i)

  const jumped = useRef(false)
  const lastWidth = useRef(0)
  const settle = useCallback(
    (p: number, velocity = 0) =>
      animate(x, -(p + 1) * widthRef.current, {
        ...slide,
        velocity,
        onComplete: () => {
          const q = wrap(p)
          if (q === p) return
          jumped.current = true
          x.set(-(q + 1) * widthRef.current)
          setPos(q)
        },
      }),
    [wrap, x],
  )

  useEffect(() => {
    if (!width) return
    if (lastWidth.current !== width) {
      lastWidth.current = width
      x.set(at(pos))
      return
    }
    if (jumped.current) {
      jumped.current = false
      return
    }
    const controls = settle(pos)
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, width])

  // A tap opens the yatra, but only a real one: the finger went down and came
  // up in (nearly) the same place, quickly, with no drag or scroll in between.
  // motion's onTap fired after short swipes too, because the drag lock is
  // already released when the tap gesture sees the pointer lift.
  const press = useRef<{ x: number; y: number; t: number; moved: boolean } | null>(null)
  const TAP_SLOP = 8 // px
  // moves are watched on the window: the finger can wander off the track (onto the capsule) mid-swipe
  const onPointerDown = (e: React.PointerEvent) => {
    const p = { x: e.clientX, y: e.clientY, t: e.timeStamp, moved: false }
    press.current = p
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - p.x, ev.clientY - p.y) > TAP_SLOP) p.moved = true
    }
    const end = (ev: PointerEvent) => {
      if (ev.type === 'pointercancel') p.moved = true // the browser took it for a scroll
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }
  const onClick = (e: React.MouseEvent) => {
    const p = press.current
    press.current = null
    if (!p || p.moved || Math.hypot(e.clientX - p.x, e.clientY - p.y) > TAP_SLOP || e.timeStamp - p.t > 500) return
    // only yatras with their own page go anywhere
    const page = yatraPage(yatra.slug)
    if (page) navigate(page)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false)
    const swipe = info.offset.x + info.velocity.x * 0.2
    const threshold = width * 0.18
    if (swipe < -threshold) step(1)
    else if (swipe > threshold) step(-1)
    else settle(pos, info.velocity.x) // not far enough: spring back
  }

  // timer as a motion value, so pausing freezes the fill where it is
  const fill = useMotionValue(0)
  const fillWidth = useTransform(fill, (v) => `${v * 100}%`)
  const inView = useInView(frameRef, { amount: 0.3 })
  const running = playing && !hovered && !dragging && inView
  useEffect(() => fill.set(0), [index, fill])
  useEffect(() => {
    if (!running) return
    const controls = animate(fill, 1, {
      duration: (1 - fill.get()) * DURATION,
      ease: 'linear',
      onComplete: () => step(1),
    })
    return () => controls.stop()
  }, [index, running, step, fill])

  const img = images[index]

  return (
    <div
      ref={frameRef}
      className="group relative z-10 h-48 overflow-hidden rounded-[24px] bg-night md:h-full md:min-h-[440px] lg:min-h-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${yatra.title} photographs`}
    >
      {/* the track: swipe or drag it; a plain tap opens the yatra (the card's click) */}
      <motion.div
        className="absolute inset-y-0 left-0 flex cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ x, width: width * (n + 2) || '100%' }}
        drag="x"
        dragConstraints={{ left: -(n + 1) * width, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => {
          setDragging(true)
          if (press.current) press.current.moved = true
        }}
        onDragEnd={onDragEnd}
        onPointerDown={onPointerDown}
        onClick={onClick}
      >
        {[images[n - 1], ...images, images[0]].map((im, slot) => (
          <img
            key={slot}
            src={im.src}
            alt={slot - 1 === index ? im.caption : ''}
            aria-hidden={slot - 1 !== index}
            draggable={false}
            decoding="async"
            className="h-full shrink-0 object-cover select-none"
            style={{ width: width || '100%' }}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 via-55% to-black/15" />

      {/* top: glass badges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <span className="rounded-full bg-white px-3 py-1.5 type-chip text-ink shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          {yatra.region}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={img.caption}
            className="rounded-full bg-black/30 px-3 py-1.5 type-caption font-medium text-white md:backdrop-blur-xl"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease }}
          >
            {img.caption}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Airbnb hover arrows */}
      <ArrowButton side="left" label="Previous photo" onClick={() => step(-1)} />
      <ArrowButton side="right" label="Next photo" onClick={() => step(1)} />

      {/* bottom: quote + capsule */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end gap-8 p-3 text-white md:justify-between md:p-6">
        {/* quote is desktop-only: on phones the photo stays a compact header */}
        <figure className="hidden max-w-[26rem] md:block">
          <blockquote className="type-body font-medium">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-2.5 flex items-center gap-2 type-caption text-white/70">
            <span className="h-px w-4 bg-saffron" />
            {quote.by}
          </figcaption>
        </figure>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <div className="flex h-9 items-center gap-2 rounded-full bg-white/15 px-3.5 md:backdrop-blur-xl" role="tablist" aria-label="Choose photograph">
            {images.map((im, i) => {
              const active = i === index
              return (
                <button
                  key={im.src}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Photo ${i + 1}: ${im.caption}`}
                  onClick={() => goTo(i)}
                  className="flex h-6 items-center"
                >
                  <motion.span
                    className="relative block h-[7px] overflow-hidden rounded-full bg-white/45 hover:bg-white/70"
                    animate={{ width: active ? 36 : 7 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    {active && <motion.span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: fillWidth }} />}
                  </motion.span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white md:backdrop-blur-xl transition-colors hover:bg-white/25"
          >
            {playing ? <IconPause className="h-3.5 w-3.5" /> : <IconPlay className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

function ArrowButton({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  const Icon = side === 'left' ? IconChevronLeft : IconChevronRight
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className={`absolute top-1/2 hidden md:grid ${side === 'left' ? 'left-4' : 'right-4'} h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-[opacity,transform,background-color] duration-300 hover:scale-105 hover:bg-white focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100`}
    >
      <Icon className="h-3.5 w-3.5" />
    </motion.button>
  )
}
