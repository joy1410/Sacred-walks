import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  cubicBezier,
} from 'motion/react'
import HeroBackdrop from './HeroBackdrop'
import DivineWord from './DivineWord'

const ease = [0.22, 1, 0.36, 1] as const
const breath = cubicBezier(0.65, 0, 0.35, 1)

/**
 * Scroll-driven hero. The small circle that sits inside the headline is the
 * video itself, already playing. As you scroll, the words part and the
 * circle grows into a full-bleed film.
 *
 * The video box is positioned with CSS variables: the measured slot rect
 * (--sx/--sy/--sw/--sh) and a 0→1 morph value (--m). That keeps the
 * geometry in CSS and lets Motion drive a single number per frame.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [expanded, setExpanded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // morph: circle → full bleed
  const m = useTransform(scrollYProgress, [0.03, 0.58], [0, 1], { ease: breath })
  const videoScale = useTransform(m, [0, 1], [1.35, 1])
  const ringOpacity = useTransform(m, [0, 0.12], [1, 0])

  // headline choreography
  const line1Y = useTransform(scrollYProgress, [0, 0.4], ['0%', '-120%'])
  const line1Opacity = useTransform(scrollYProgress, [0.02, 0.26], [1, 0])
  const leftX = useTransform(scrollYProgress, [0.02, 0.5], ['0vw', '-42vw'])
  const rightX = useTransform(scrollYProgress, [0.02, 0.5], ['0vw', '42vw'])
  const wordsOpacity = useTransform(scrollYProgress, [0.18, 0.42], [1, 0])
  const metaOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  // on-film overlay
  const overlayOpacity = useTransform(scrollYProgress, [0.6, 0.74], [0, 1])
  const overlayY = useTransform(scrollYProgress, [0.6, 0.78], [40, 0])

  useMotionValueEvent(m, 'change', (v) => setExpanded(v > 0.9))

  // measure the inline slot relative to the pinned stage
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current
      const slot = slotRef.current
      if (!stage || !slot) return
      const s = stage.getBoundingClientRect()
      const r = slot.getBoundingClientRect()
      stage.style.setProperty('--sx', `${r.left - s.left}px`)
      stage.style.setProperty('--sy', `${r.top - s.top}px`)
      stage.style.setProperty('--sw', `${r.width}px`)
      stage.style.setProperty('--sh', `${r.height}px`)
    }
    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    if (stageRef.current) ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [])

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted) v.play()
  }

  return (
    <section ref={sectionRef} className="relative h-[330vh]" aria-label="Introduction">
      <motion.div
        ref={stageRef}
        className="grain sticky top-0 h-svh w-full overflow-hidden bg-paper"
        style={{ '--m': m } as never}
      >
        <HeroBackdrop progress={scrollYProgress} />

        {/* headline */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <motion.p
            className="eyebrow mb-8 flex items-center gap-3"
            style={{ opacity: metaOpacity }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
          >
            <span className="h-px w-8 bg-gold" />
            Isha Sacred Walks · Yatras 2026–27
            <span className="h-px w-8 bg-gold" />
          </motion.p>

          <h1 className="font-display text-[clamp(2.4rem,6.4vw,6.4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-ink">
            <motion.span className="block" style={{ y: line1Y, opacity: line1Opacity }}>
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: '40%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.1 }}
              >
                Make a life-transforming journey to
              </motion.span>
            </motion.span>

            <span className="mt-[0.06em] flex items-center justify-center whitespace-nowrap">
              <motion.span style={{ x: leftX, opacity: wordsOpacity }} className="inline-block">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: '40%' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease, delay: 0.25 }}
                >
                  places
                </motion.span>
              </motion.span>

              {/* the slot the video grows out of: never transformed, so it measures true */}
              <span ref={slotRef} className="mx-[0.2em] inline-block h-[0.86em] w-[0.86em] shrink-0 translate-y-[0.04em]" aria-hidden />

              <motion.span style={{ x: rightX, opacity: wordsOpacity }} className="inline-block">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: '40%' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease, delay: 0.4 }}
                >
                  of <DivineWord delay={1.1} /> connection
                </motion.span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
            style={{ opacity: metaOpacity }}
          >
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-soft uppercase">Scroll to begin</span>
            <span className="relative h-10 w-px overflow-hidden bg-line">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-gold"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.div>
        </div>

        {/* pulsing ring around the seed circle */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute z-20 rounded-full border border-gold/60"
          style={{
            opacity: ringOpacity,
            left: 'calc(var(--sx) - 7px)',
            top: 'calc(var(--sy) - 7px)',
            width: 'calc(var(--sw) + 14px)',
            height: 'calc(var(--sh) + 14px)',
          }}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-gold/50"
            animate={{ scale: [1, 1.45], opacity: [0.8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.span>

        {/* the film */}
        <div
          className="absolute z-20 overflow-hidden bg-dusk shadow-[0_30px_80px_-40px_rgba(29,24,19,0.6)]"
          style={{
            left: 'calc(var(--sx, 50%) * (1 - var(--m)))',
            top: 'calc(var(--sy, 50%) * (1 - var(--m)))',
            width: 'calc(var(--sw, 0px) + (100% - var(--sw, 0px)) * var(--m))',
            height: 'calc(var(--sh, 0px) + (100% - var(--sh, 0px)) * var(--m))',
            borderRadius: 'calc(var(--sh, 0px) / 2 * (1 - var(--m)) + 0px)',
          }}
        >
          <motion.video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ scale: videoScale }}
            src="/media/hero.mp4"
            poster="/media/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* legibility wash + overlay copy once full-bleed */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dusk/75 via-dusk/10 to-dusk/20"
            style={{ opacity: overlayOpacity }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex flex-col gap-8 p-6 text-paper md:flex-row md:items-end md:justify-between md:p-12"
            style={{ opacity: overlayOpacity, y: overlayY }}
          >
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] uppercase text-gold-light">
                Sacred Walks
              </p>
              <p className="font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.02] font-light">
                Walk where the sages <em className="font-normal">walked.</em>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSound}
                tabIndex={expanded ? 0 : -1}
                className="pointer-events-auto flex items-center gap-3 rounded-full border border-paper/35 px-5 py-3 text-[13px] font-medium backdrop-blur-md transition-colors hover:bg-paper/10"
                aria-pressed={!muted}
              >
                <SoundBars active={!muted} />
                {muted ? 'Sound on' : 'Sound off'}
              </button>
              <a
                href="#yatras"
                tabIndex={expanded ? 0 : -1}
                className="pointer-events-auto rounded-full bg-paper px-6 py-3 text-[13px] font-semibold text-ink transition-colors hover:bg-paper-2"
              >
                Explore yatras
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function SoundBars({ active }: { active: boolean }) {
  return (
    <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-current"
          animate={active ? { height: ['30%', `${h * 100}%`, '30%'] } : { height: '30%' }}
          transition={active ? { duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' } : { duration: 0.3 }}
        />
      ))}
    </span>
  )
}
