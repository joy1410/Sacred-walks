import { useLayoutEffect, useRef } from 'react'
import { motion, useScroll, cubicBezier } from 'motion/react'
import HeroBackdrop from './HeroBackdrop'
import DivineWord from './DivineWord'
import { BlurText, after } from './BlurIn'
import { useScrollRange } from '../../lib/useScrollRange'

const ease = [0.16, 1, 0.3, 1] as const
const inOut = cubicBezier(0.65, 0, 0.35, 1)

// one continuous focus front across the whole headline
const LINE1 = 'Make a life-transforming journey to'
const T_LINE1 = 0.15
const T_PLACES = after(T_LINE1, LINE1)
const T_OF = after(T_PLACES, 'places')
const T_DIVINE = after(T_OF, 'of')
const T_CONNECTION = after(T_DIVINE, 'divine')

/**
 * Scroll-driven hero. The circle inside the headline is the film itself,
 * already playing. Scrolling parts the words and the circle grows into a
 * rounded video card.
 *
 * Geometry lives in CSS variables: the measured slot rect (--sx/--sy/--sw/--sh)
 * and a single 0→1 morph value (--m) that Motion drives per frame.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  // the morph uses nearly the whole pinned distance, so every scroll tick
  // visibly changes something; no dead hold at the end
  const m = useScrollRange(scrollYProgress, [0.02, 0.92], [0, 1], { ease: inOut })
  const videoScale = useScrollRange(scrollYProgress, [0, 1], [1.45, 1])

  const line1Y = useScrollRange(scrollYProgress, [0.05, 0.5], ['0%', '-60%'])
  const line1Opacity = useScrollRange(scrollYProgress, [0.22, 0.46], [1, 0], { clamp: true })
  // words stay solid while they part, and fade only as the growing card reaches them
  const wordsOpacity = useScrollRange(scrollYProgress, [0.28, 0.52], [1, 0], { clamp: true })
  const metaOpacity = useScrollRange(scrollYProgress, [0.1, 0.3], [1, 0])


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

  return (
    <section ref={sectionRef} className="relative h-[190vh] bg-white" aria-label="Introduction">
      <motion.div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden [--fb:max(16px,2.5vw)] [--fr:28px] [--ft:64px] [--fx:max(16px,2.5vw)]"
        style={{ '--m': m } as never}
      >
        <HeroBackdrop progress={scrollYProgress} />

        {/* copy sits in the bottom 30%, on the same 1080 grid as the nav */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[30%] min-h-[220px] flex-col justify-end px-5 pb-[6vh]">
          <div className="mx-auto w-full max-w-[1080px]">
            <motion.div style={{ opacity: metaOpacity }}>
              <motion.p
                className="mb-3 text-[14px] font-semibold tracking-[-0.01em] text-saffron"
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease }}
              >
                Sacred Walks · 2026–27 season
              </motion.p>
            </motion.div>

            <h1 className="font-display text-[clamp(2.25rem,4.9vw,4.4rem)] leading-[1] font-semibold tracking-[-0.005em] text-ink-2">
              {/* scroll choreography lives on the wrappers; the load-in blur lives on the letters */}
              <motion.span className="block" style={{ y: line1Y, opacity: line1Opacity }}>
                <BlurText text={LINE1} delay={T_LINE1} />
              </motion.span>

              <span className="mt-[0.04em] block md:whitespace-nowrap">
                {/* the words ride the film's edges: each side moves exactly as far as that
                    edge of the film has travelled (same --m), so the film pushes them apart */}
                <span className="inline-block" style={{ transform: 'translateX(calc((var(--fx) - var(--sx, 0px)) * var(--m)))' }}>
                  <motion.span style={{ opacity: wordsOpacity }} className="inline-block">
                    <BlurText text="places" delay={T_PLACES} />
                  </motion.span>
                </span>

                {/* the slot the film grows from: 1.3× cap height, centred on the capitals (CSS cap unit),
                    never transformed so it measures true */}
                <span ref={slotRef} className="mx-[0.2em] inline-block h-[1.3cap] w-[1.3cap] align-[-0.15cap]" aria-hidden />

                <span
                  className="inline-block"
                  style={{ transform: 'translateX(calc((100vw - var(--fx) - var(--sx, 0px) - var(--sw, 0px)) * var(--m)))' }}
                >
                  <motion.span style={{ opacity: wordsOpacity }} className="inline-block">
                    <BlurText text="of" delay={T_OF} /> <DivineWord delay={T_DIVINE} />{' '}
                    <BlurText text="connection" delay={T_CONNECTION} />
                  </motion.span>
                </span>
              </span>
            </h1>
          </div>
        </div>

        {/* the film. It opens as an iris the moment the focus front reaches the slot
            (right after "places"), so the circle is born from the sentence, not before it */}
        <motion.div
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(75% at 50% 50%)' }}
          transition={{ duration: 1.3, ease, delay: T_OF }}
          className="absolute z-20 overflow-hidden bg-night"
          style={{
            // circle (slot rect) → rounded card inset from the edges (--fx/--ft/--fb)
            left: 'calc(var(--sx, 50%) * (1 - var(--m)) + var(--fx) * var(--m))',
            top: 'calc(var(--sy, 50%) * (1 - var(--m)) + var(--ft) * var(--m))',
            width: 'calc(var(--sw, 0px) + (100% - 2 * var(--fx) - var(--sw, 0px)) * var(--m))',
            height: 'calc(var(--sh, 0px) + (100% - var(--ft) - var(--fb) - var(--sh, 0px)) * var(--m))',
            // px radius (always circular corners, never an ellipse): starts at half the
            // circle's height, shrinks with (1 - m)² relative to the current height,
            // and settles on the card radius --fr
            borderRadius:
              'calc((var(--sh, 0px) + (100svh - var(--ft) - var(--fb) - var(--sh, 0px)) * var(--m)) / 2 * (1 - var(--m)) * (1 - var(--m)) + var(--fr) * var(--m))',
          }}
        >
          <motion.video
            className="h-full w-full object-cover"
            style={{ scale: videoScale }}
            src="/media/hero.mp4"
            poster="/media/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            initial={{ filter: 'blur(14px)' }}
            animate={{ filter: 'blur(0px)' }}
            transition={{ duration: 1.6, ease, delay: T_OF }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
