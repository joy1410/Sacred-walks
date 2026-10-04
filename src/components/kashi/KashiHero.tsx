import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { kashi } from '../../data/kashi'
import { BlurText, after } from '../hero/BlurIn'
import DifficultyMeter from '../yatras/DifficultyMeter'
import { IconArrowRight, IconPin } from '../icons'
import { useScrollRange } from '../../lib/useScrollRange'
import { blur } from '../../lib/lite'
import { ease, STICKY_OFFSET } from './shared'

const T_TITLE = 0.25
const T_AFTER = after(T_TITLE, kashi.title)

/**
 * Opens where the homepage hero ends: a framed film card (same inset and
 * radius) holding the ghats at first light. The photo arrives out of focus
 * at 1.15× and settles, as the homepage film does; on scroll it drifts
 * down behind the frame while the words lift away.
 */
export default function KashiHero() {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useScrollRange(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useScrollRange(scrollYProgress, [0, 0.6], [0, -60])
  const textOpacity = useScrollRange(scrollYProgress, [0.05, 0.5], [1, 0], { clamp: true })

  const toSection = (id: string) => () => {
    if (lenis) lenis.scrollTo(`#${id}`, { offset: -STICKY_OFFSET + 1 })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      aria-labelledby="kashi-title"
      className="px-4 pt-16 pb-4 md:px-[max(16px,2.5vw)] md:pb-[max(16px,2.5vw)]"
    >
      <div className="relative isolate flex h-[calc(100svh-80px)] min-h-[560px] flex-col justify-end overflow-hidden rounded-[24px] bg-night md:h-[calc(100svh-64px-max(16px,2.5vw))] md:min-h-[620px] md:rounded-[28px]">
        <motion.img
          src={kashi.hero.src}
          alt={kashi.hero.caption}
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[30%_50%]"
          initial={{ scale: 1.15, ...blur(14) }}
          animate={{ scale: 1, ...blur(0) }}
          transition={{ duration: 1.8, ease }}
          style={{ y: imgY }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/10" aria-hidden />

        {/* where the photo stands, set like a place mark in the corner */}
        <motion.div className="absolute top-4 left-5 md:top-6 md:left-10 lg:left-14" style={{ opacity: textOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.3 }}
            className="flex items-center gap-1.5 rounded-full bg-black/30 py-1.5 pr-3 pl-2.5 type-chip text-white/90 backdrop-blur-md"
          >
            <IconPin className="h-4 w-4" />
            {kashi.region}
          </motion.p>
        </motion.div>

        <motion.div className="px-5 pb-6 text-white md:px-10 md:pb-10 lg:px-14 lg:pb-12" style={{ y: textY, opacity: textOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-2.5 type-chip text-saffron-ink">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-saffron opacity-40 motion-reduce:hidden" />
                <span className="relative h-2 w-2 rounded-full bg-saffron" />
              </span>
              Registrations open
            </span>
          </motion.div>

          <h1
            id="kashi-title"
            className="mt-4 type-display-xl md:mt-5"
          >
            <BlurText text={kashi.title} delay={T_TITLE} />
          </h1>

          <div className="mt-2 flex flex-col gap-6 md:mt-3 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: T_AFTER }}
            >
              <p className="type-lead-l text-white/90">{kashi.tagline}</p>
              {/* the card's facts row, set in glass */}
              <div className="mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-white/12 px-4 py-2.5 type-label-sm whitespace-nowrap tabular-nums md:mt-5 md:gap-x-5 md:px-5 md:py-3 md:backdrop-blur-md">
                <span>{kashi.days} days</span>
                <span className="h-4 w-px bg-white/25" aria-hidden />
                <span className="inline-flex items-center gap-1.5">
                  <DifficultyMeter level={1} />
                  Gentle
                </span>
                <span className="h-4 w-px bg-white/25" aria-hidden />
                <span>{kashi.dates}</span>
                <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden />
                <span className="hidden sm:inline">{kashi.language}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: T_AFTER + 0.12 }}
              className="flex gap-2.5"
            >
              <button
                type="button"
                onClick={toSection('itinerary')}
                className="group/view inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-6 py-3.5 type-button whitespace-nowrap text-ink transition-colors hover:bg-mist lg:flex-none"
              >
                See the itinerary
                <IconArrowRight className="h-4 w-4 rotate-90 transition-transform duration-300 group-hover/view:translate-y-0.5" />
              </button>
              {/* registering starts at the dates, where the prerequisite sits */}
              <motion.button
                type="button"
                onClick={toSection('dates')}
                whileTap={{ scale: 0.98 }}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-saffron px-7 py-3.5 type-button whitespace-nowrap text-white transition-colors hover:bg-[#b93c1b] lg:flex-none"
              >
                Register
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
