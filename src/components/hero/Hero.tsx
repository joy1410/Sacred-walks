import { useLayoutEffect, useRef } from 'react'
import { motion, useScroll, cubicBezier } from 'motion/react'
import DivineWord from './DivineWord'
import { BlurText, after } from './BlurIn'
import { useScrollRange } from '../../lib/useScrollRange'
import { blur, lite } from '../../lib/lite'

const ease = [0.16, 1, 0.3, 1] as const
const inOut = cubicBezier(0.65, 0, 0.35, 1)
// width's curve starts sooner than height's, so the frame widens while it rises
const widen = cubicBezier(0.4, 0, 0.35, 1)

// one continuous focus front across the whole headline
const LINE1 = 'Make a spiritual journey to'
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
  const measureRef = useRef<() => void>(() => {})

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  // the morph uses nearly the whole pinned distance, so every scroll tick
  // visibly changes something; no dead hold at the end.
  // Width and height grow together from the first tick, but height runs on a
  // shorter clock: it tops out halfway while width keeps going, so the frame
  // stays squarer (~1.6:1 at full height) before opening out to the wide card.
  const mh = useScrollRange(scrollYProgress, [0.02, 0.5], [0, 1], { ease: inOut })
  const mw = useScrollRange(scrollYProgress, [0.02, 0.92], [0, 1], { ease: widen })
  const videoScale = useScrollRange(scrollYProgress, [0, 1], [1.45, 1])

  const line1Y = useScrollRange(scrollYProgress, [0.05, 0.5], ['0%', '-60%'])
  const line1Opacity = useScrollRange(scrollYProgress, [0.12, 0.34], [1, 0], { clamp: true })
  // words stay solid while they part, and fade only as the growing card reaches them
  const wordsOpacity = useScrollRange(scrollYProgress, [0.4, 0.64], [1, 0], { clamp: true })
  // the illustration clears out almost immediately, so the film grows over white, not the art
  const artOpacity = useScrollRange(scrollYProgress, [0, 0.1], [1, 0], { clamp: true })
  const artScale = useScrollRange(scrollYProgress, [0, 0.1], [1, 1.04], { clamp: true })

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
    measureRef.current = measure
    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    if (stageRef.current) ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[190vh]" aria-label="Introduction">
      <motion.div
        ref={stageRef}
        className="hero-stage sticky top-0 h-svh w-full overflow-hidden"
        style={{ '--mw': mw, '--mh': mh } as never}
      >
        {/* one composition: a 2:1 box holding the illustration, with the headline set into
            its empty upper-left corner. On desktop the type is sized in container units, so
            text and art scale as a single picture, capped at 1440px so the headline stays near the
            content column on wide screens. On mobile the headline sits below the art. */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center pt-14 pb-[3svh]">
          <div className="@container relative flex w-full flex-col md:block md:aspect-[2/1] md:w-[min(100vw,170svh,1440px)]">
            {/* portrait art on phones, the wide panorama from md up */}
            <picture className="contents">
              <source media="(min-width: 768px)" srcSet="/images/hero.webp" />
              <motion.img
                src="/images/hero_mobile.webp"
                alt=""
                aria-hidden="true"
                // intrinsic size reserves the art's space before it loads; the headline
                // (and so the slot) sits below it, so measure again once it arrives
                width={1024}
                height={1536}
                onLoad={() => measureRef.current()}
                className="block max-h-[62svh] w-full object-contain object-bottom md:absolute md:inset-0 md:h-full md:max-h-none"
                style={{ opacity: artOpacity, scale: artScale }}
              />
            </picture>

            <div className="relative mt-6 px-5 md:absolute md:left-[6%] md:top-[25%] md:mt-0 md:px-0">
            <h1 className="font-display text-[8.5vw] leading-[1.1] md:text-[3.8cqw] md:leading-[1.25] font-semibold tracking-[-0.005em] text-ink">
              {/* scroll choreography lives on the wrappers; the load-in blur lives on the letters */}
              <motion.span className="block whitespace-nowrap" style={{ y: line1Y, opacity: line1Opacity }}>
                <BlurText text={LINE1} delay={T_LINE1} />
              </motion.span>

              <span className="mt-[0.04em] block md:whitespace-nowrap">
                {/* the words ride the film's edges: each side moves exactly as far as that
                    edge of the film has travelled (same --m), so the film pushes them apart */}
                <span className="inline-block" style={{ transform: 'translateX(calc((var(--fx) - var(--sx, 0px)) * var(--mw) * var(--ride)))' }}>
                  <motion.span style={{ opacity: wordsOpacity }} className="inline-block">
                    <BlurText text="places" delay={T_PLACES} />
                  </motion.span>
                </span>

                {/* the slot the film grows from: 1.3× cap height, centred on the capitals (CSS cap unit),
                    never transformed so it measures true */}
                <span ref={slotRef} className="mx-[0.2em] inline-block h-[1.3cap] w-[1.3cap] align-[-0.15cap]" aria-hidden />

                <span
                  className="block md:inline-block"
                  style={{ transform: 'translateX(calc((100vw - var(--fx) - var(--sx, 0px) - var(--sw, 0px)) * var(--mw) * var(--ride)))' }}
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
        </div>

        {/* the film. It opens as an iris the moment the focus front reaches the slot
            (right after "places"), so the circle is born from the sentence, not before it */}
        <motion.div
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(75% at 50% 50%)' }}
          transition={{ duration: 1.3, ease, delay: T_OF }}
          className="absolute z-20 overflow-hidden bg-night"
          style={{
            // circle (slot rect) → rounded card; final size/placement per breakpoint in .hero-stage
            left: 'calc(var(--sx, 50%) * (1 - var(--mw)) + var(--fx) * var(--mw))',
            top: 'calc(var(--sy, 50%) * (1 - var(--gh)) + var(--T) * var(--gh))',
            width: 'calc(var(--sw, 0px) + (100% - 2 * var(--fx) - var(--sw, 0px)) * var(--mw))',
            height: 'calc(var(--sh, 0px) + (var(--H) - var(--sh, 0px)) * var(--gh))',
            // px radius (always circular corners, never an ellipse): starts at half the
            // circle's height, shrinks with (1 - m)² relative to the current height,
            // and settles on the card radius --fr
            borderRadius:
              'calc((var(--sh, 0px) + (var(--H) - var(--sh, 0px)) * var(--gh)) / 2 * (1 - var(--gh)) * (1 - var(--gh)) + var(--fr) * var(--gh))',
          }}
        >
          <motion.video
            className="h-full w-full object-cover"
            style={{ scale: videoScale }}
            // 720p cut on phones: a quarter of the bytes and far cheaper to decode
            src={lite ? '/media/hero-mobile.mp4' : '/media/hero.mp4'}
            poster="/media/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            initial={blur(14)}
            animate={blur(0)}
            transition={{ duration: 1.6, ease, delay: T_OF }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
