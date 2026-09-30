import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import type { Yatra } from '../../data/yatras'
import { IconArrowLeft, IconArrowRight, IconPin } from '../icons'

const DURATION = 6.5 // seconds per slide
const ease = [0.22, 1, 0.36, 1] as const

/**
 * Carousel with a wipe transition (clip-path) in the direction of travel,
 * slow Ken Burns drift, the Sadhguru quote on the image, and a segmented
 * indicator where the active segment fills over time like a timer.
 */
export default function ImageCarousel({ yatra }: { yatra: Yatra }) {
  const { images, quote, region } = yatra
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (next: number, d?: number) => {
      const n = (next + images.length) % images.length
      setState(([cur]) => [n, d ?? (next > cur ? 1 : -1)])
    },
    [images.length],
  )

  // timer as a motion value so hovering freezes the fill where it is
  const fill = useMotionValue(0)
  const fillWidth = useTransform(fill, (v) => `${v * 100}%`)
  useEffect(() => fill.set(0), [index, fill])
  useEffect(() => {
    if (paused) return
    const controls = animate(fill, 1, {
      duration: (1 - fill.get()) * DURATION,
      ease: 'linear',
      onComplete: () => go(index + 1, 1),
    })
    return () => controls.stop()
  }, [index, paused, go, fill])

  const img = images[index]

  return (
    <div
      className="group/carousel relative h-full min-h-[420px] overflow-hidden bg-dusk"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${yatra.title} photographs`}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={img.src}
          custom={dir}
          className="absolute inset-0"
          variants={{
            enter: (d: number) => ({ zIndex: 1, clipPath: d > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }),
            center: { zIndex: 1, clipPath: 'inset(0 0 0 0%)' },
            exit: { zIndex: 0, clipPath: 'inset(0 0 0 0%)', transition: { duration: 1.1 } },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease }}
        >
          <motion.img
            src={img.src}
            alt={img.caption}
            className="h-full w-full object-cover"
            initial={{ scale: 1.16, x: dir > 0 ? '4%' : '-4%' }}
            animate={{ scale: 1.03, x: '0%' }}
            transition={{ scale: { duration: DURATION + 2, ease: 'linear' }, x: { duration: 1.4, ease } }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* washes for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-dusk/90 via-dusk/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-dusk/45 to-transparent" />

      {/* top row: location + caption */}
      <div className="absolute inset-x-0 top-0 z-[3] flex items-start justify-between gap-4 p-5 text-paper md:p-6">
        <span className="flex items-center gap-1.5 rounded-full bg-paper/15 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase backdrop-blur-md">
          <IconPin className="h-3.5 w-3.5" />
          {region}
        </span>
        <div className="text-right">
          <p className="font-display text-sm tabular-nums tracking-wider text-paper/90">
            <span className="text-paper">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-paper/50"> / {String(images.length).padStart(2, '0')}</span>
          </p>
          <div className="relative mt-0.5 h-4 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={img.caption}
                className="text-[11px] text-paper/70"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                {img.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* bottom: quote + controls */}
      <div className="absolute inset-x-0 bottom-0 z-[3] flex flex-col gap-6 p-5 text-paper md:flex-row md:items-end md:justify-between md:gap-10 md:p-7">
        <figure className="max-w-md">
          <span className="block h-4 font-display text-4xl leading-none text-gold-light">&ldquo;</span>
          <blockquote className="font-display text-[1.2rem] leading-snug font-normal italic text-paper md:text-[1.35rem]">
            {quote.text}
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-paper/70">
            <span className="h-px w-6 bg-gold-light" />
            {quote.by}
          </figcaption>
        </figure>

        <div className="flex shrink-0 items-center gap-5">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose photograph">
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
                  className="group/dot relative flex h-6 items-center"
                >
                  <motion.span
                    layout
                    className="relative block h-[3px] overflow-hidden rounded-full bg-paper/35 group-hover/dot:bg-paper/60"
                    animate={{ width: active ? 40 : 6 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    {active && (
                      <motion.span className="absolute inset-y-0 left-0 bg-paper" style={{ width: fillWidth }} />
                    )}
                  </motion.span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <CarouselButton label="Previous photo" onClick={() => go(index - 1, -1)}>
              <IconArrowLeft className="h-4 w-4" />
            </CarouselButton>
            <CarouselButton label="Next photo" onClick={() => go(index + 1, 1)}>
              <IconArrowRight className="h-4 w-4" />
            </CarouselButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function CarouselButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="grid h-10 w-10 place-items-center rounded-full border border-paper/40 text-paper backdrop-blur-sm transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
    >
      {children}
    </motion.button>
  )
}
