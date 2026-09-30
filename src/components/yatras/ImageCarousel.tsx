import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import type { Yatra } from '../../data/yatras'
import { IconChevronLeft, IconChevronRight, IconPause, IconPlay } from '../icons'

const DURATION = 6 // seconds per slide
const ease = [0.16, 1, 0.3, 1] as const

/**
 * Airbnb gestures (hover arrows, glass badges) + Apple's carousel capsule
 * (dots where the active one stretches into a timer, with play/pause).
 * The Sadhguru quote sits on the image.
 */
export default function ImageCarousel({ yatra }: { yatra: Yatra }) {
  const { images, quote } = yatra
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)

  const go = useCallback(
    (next: number, d?: number) => {
      const n = (next + images.length) % images.length
      setState(([cur]) => [n, d ?? (next > cur ? 1 : -1)])
    },
    [images.length],
  )

  // timer as a motion value, so pausing freezes the fill where it is
  const fill = useMotionValue(0)
  const fillWidth = useTransform(fill, (v) => `${v * 100}%`)
  const running = playing && !hovered
  useEffect(() => fill.set(0), [index, fill])
  useEffect(() => {
    if (!running) return
    const controls = animate(fill, 1, {
      duration: (1 - fill.get()) * DURATION,
      ease: 'linear',
      onComplete: () => go(index + 1, 1),
    })
    return () => controls.stop()
  }, [index, running, go, fill])

  const img = images[index]

  return (
    <div
      className="group relative z-10 h-full min-h-[440px] overflow-hidden rounded-[24px] bg-night lg:min-h-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${yatra.title} photographs`}
    >
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.img
          key={img.src}
          src={img.src}
          alt={img.caption}
          custom={dir}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          variants={{
            enter: (d: number) => ({ x: `${d * 100}%`, scale: 1.08 }),
            center: { x: '0%', scale: 1 },
            exit: (d: number) => ({ x: `${d * -28}%`, scale: 1, opacity: 0.4 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 via-45% to-black/15" />

      {/* The carousel sits above the card-wide link (so it receives hover and
          its controls work); this layer carries the card's click through the photo. */}
      <a href={`/yatras/${yatra.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0" />

      {/* top: glass badges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          {yatra.region}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={img.caption}
            className="rounded-full bg-black/30 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-xl"
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
      <ArrowButton side="left" label="Previous photo" onClick={() => go(index - 1, -1)} />
      <ArrowButton side="right" label="Next photo" onClick={() => go(index + 1, 1)} />

      {/* bottom: quote + capsule */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 text-white md:flex-row md:items-end md:justify-between md:gap-8 md:p-6">
        <figure className="max-w-[26rem]">
          <blockquote className="text-[16px] leading-[1.4] font-medium tracking-[-0.01em] md:text-[17px]">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-2.5 flex items-center gap-2 text-[13px] text-white/70">
            <span className="h-px w-4 bg-saffron" />
            {quote.by}
          </figcaption>
        </figure>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <div className="flex h-9 items-center gap-2 rounded-full bg-white/15 px-3.5 backdrop-blur-xl" role="tablist" aria-label="Choose photograph">
            {images.map((im, i) => {
              const active = i === index
              return (
                <button
                  key={im.src}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Photo ${i + 1}: ${im.caption}`}
                  onClick={() => go(i)}
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
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-xl transition-colors hover:bg-white/25"
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
      className={`absolute top-1/2 ${side === 'left' ? 'left-4' : 'right-4'} grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-[opacity,transform,background-color] duration-300 hover:scale-105 hover:bg-white focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100`}
    >
      <Icon className="h-3.5 w-3.5" />
    </motion.button>
  )
}
