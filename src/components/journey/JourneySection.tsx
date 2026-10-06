import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, type Variants } from 'motion/react'
import { beats, type Beat } from '../../data/journey'
import { BlurText } from '../hero/BlurIn'
import { useScrollRange } from '../../lib/useScrollRange'
import { blur } from '../../lib/lite'
import { useIsMobile } from '../../lib/useIsMobile'
import { photo, SIZES } from '../../lib/photo'

const ease = [0.16, 1, 0.3, 1] as const

const panel: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
// the same focus-pull the hero uses on its letters, applied per line
const item: Variants = {
  hidden: { opacity: 0, y: 16, ...blur(8) },
  show: { opacity: 1, y: 0, ...blur(0), transition: { duration: 0.9, ease } },
}

/**
 * "More than a journey": what sets an Isha yatra apart, one photograph each.
 * Desktop: the section pins and vertical scroll drives a horizontal track.
 * Mobile: the panels sit in a swipeable row that snaps each card to the
 * centre, its neighbours peeking in equally on both sides (10vw gutters on
 * the row let the first and last cards centre too); text set low over the photo.
 *
 * Like the hero, Motion drives one 0→1 CSS variable (--p) and the geometry
 * is plain CSS; --ride switches the horizontal travel off below md.
 */
export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // short holds at both ends so the first and last frames get a beat of stillness
  const p = useScrollRange(scrollYProgress, [0.04, 0.96], [0, 1])
  // the intro holds at the left while the first panel slides over it, fading as it goes
  const fade = useScrollRange(scrollYProgress, [0.04, 0.13], [1, 0])
  const [active, setActive] = useState(-1)

  return (
    <section
      ref={sectionRef}
      id="journey"
      data-opaque
      aria-labelledby="journey-title"
      className="relative bg-white py-20 [--ride:0] md:h-[460vh] md:py-0 md:[--ride:1]"
    >
      <motion.div
        className="flex flex-col md:sticky md:top-0 md:h-svh md:overflow-hidden"
        style={{ '--p': p, '--fade': fade } as never}
      >
        <Intro />

        {/* the row fills the screen until the cards hit their 640px cap (+ pt/pb). Past that, the
            spare height splits evenly between this spacer and the rail's zone below, so the cards
            stay centred and the rail floats midway between them and the bottom of the screen */}
        <div aria-hidden className="hidden md:block md:flex-1" />
        <div className="flex min-h-0 flex-1 md:relative md:z-10 md:flex-[0_1_716px] md:pt-16 md:pb-3">
          <div
            // overflow-x: auto would make overflow-y auto too, and the cards'
            // rising entrance (y: 56) then turns the row into a vertical
            // scroller; clip y, with bottom room so the rise isn't cut off
            className="-mb-16 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-[10vw] pb-16 [scrollbar-width:none] md:mb-0 md:w-max md:pb-0 md:snap-none md:gap-5 md:overflow-visible md:px-[max(16px,2.5vw)] [&::-webkit-scrollbar]:hidden"
            // the track's right edge meets the screen's right edge exactly at p = 1
            style={{ transform: 'translateX(calc((100vw - 100%) * var(--p) * var(--ride)))' }}
          >
            <IntroSpacer setActive={setActive} />
            {beats.map((b, i) => (
              <BeatPanel key={b.short} beat={b} index={i} setActive={setActive} />
            ))}
          </div>
        </div>

        <Rail active={active} />
      </motion.div>
    </section>
  )
}

type SetActive = (i: number) => void

/** reports when a panel crosses the middle of the screen (desktop track) */
function useCentred(index: number, setActive: SetActive) {
  const ref = useRef<HTMLDivElement>(null)
  const centred = useInView(ref, { margin: '0px -45% 0px -45%' })
  useEffect(() => {
    if (centred) setActive(index)
  }, [centred, index, setActive])
  return ref
}

/** holds the intro's place at the head of the desktop track */
function IntroSpacer({ setActive }: { setActive: SetActive }) {
  const ref = useCentred(-1, setActive)
  return <div ref={ref} aria-hidden className="hidden shrink-0 md:block md:w-[min(34vw,460px)]" />
}

/**
 * Desktop: pinned to the left of the stage, under the track, so the panels
 * slide over it while --fade takes it out. Mobile: simply heads the stack.
 */
function Intro() {
  return (
    <div className="flex shrink-0 flex-col justify-center px-4 pb-6 md:absolute md:inset-y-0 md:left-[max(16px,2.5vw)] md:z-0 md:w-[min(34vw,460px)] md:translate-x-[calc((1_-_var(--fade))*-32px)] md:px-0 md:pt-16 md:pr-8 md:pb-24 md:opacity-(--fade)">
      <h2 id="journey-title" className="type-h2 text-ink">
        <BlurText text="More than a journey" inView />
      </h2>
      <motion.p
        className="mt-5 max-w-[400px] type-lead text-ink-soft"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.9, ease, delay: 0.4 }}
      >
        Isha Sacred Walks are primarily designed for a deep inner experience. Everything else, from meals and comfort to
        medical care, is taken care of.
      </motion.p>
    </div>
  )
}

function BeatPanel({ beat, index, setActive }: { beat: Beat; index: number; setActive: SetActive }) {
  const ref = useCentred(index, setActive)
  const seen = useInView(ref, { once: true, amount: 0.45 })
  // mobile entrance: the row rises and settles while each photo eases back,
  // the same settle as the hero film and the closing card. The wide side
  // margins count cards still waiting off to the right as arrived, so the
  // whole row lands together rather than each card as it's swiped in.
  const stacked = useIsMobile()
  const arrived = useInView(ref, { once: true, margin: '0px 400% -10% 400%' })
  const enter = !stacked || arrived

  return (
    <motion.article
      ref={ref}
      initial={stacked ? { opacity: 0, y: 56, scale: 0.94 } : false}
      animate={enter ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 1.1, ease, delay: stacked ? Math.min(index, 2) * 0.08 : 0 }}
      className="relative aspect-[3/4] w-[80vw] shrink-0 snap-center overflow-hidden rounded-[28px] bg-night md:aspect-auto md:h-full md:max-h-[640px] md:w-[min(64vw,1040px)] md:self-center"
    >
      {/* the photo drifts against the track, so it reads as a window rather than a slide */}
      <motion.img
        {...photo(beat.image.src, { sizes: SIZES.journey })}
        alt={beat.image.caption}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: stacked ? 1.28 : 1.12 }}
        animate={enter ? { scale: 1.12 } : undefined}
        transition={{ duration: 1.6, ease }}
        style={{ translate: 'calc((var(--p) - 0.5) * -7% * var(--ride)) 0' }}
      />
      {/* on phones the text climbs to mid-card; the shade fades out just above the heading */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 via-35% to-black/0 to-60% md:from-black/75 md:via-black/20 md:via-50% md:to-black/0 md:to-100%"
        aria-hidden
      />

      <span className="absolute top-4 right-4 rounded-full bg-black/25 px-3 py-1 type-caption text-white/85 md:backdrop-blur-md md:top-5 md:right-5">
        {beat.image.caption}
      </span>

      <motion.div
        variants={panel}
        initial="hidden"
        animate={seen ? 'show' : 'hidden'}
        className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10"
      >
        <motion.h3
          variants={item}
          className="max-w-[16ch] type-h3"
        >
          {beat.title}
        </motion.h3>
        <motion.p variants={item} className="mt-3 max-w-[460px] type-body text-white/90 md:mt-4 md:text-white/80">
          {beat.body}
        </motion.p>
      </motion.div>
    </motion.article>
  )
}

/** where you are on the walk; desktop only, since mobile reads top to bottom */
function Rail({ active }: { active: number }) {
  return (
    <div className="hidden px-[max(16px,2.5vw)] pb-5 md:flex md:flex-1 md:flex-col md:justify-center" aria-hidden>
      <ol className="mx-auto grid w-full max-w-[1180px] grid-cols-5 gap-5">
        {beats.map((b, i) => {
          const on = i <= active
          return (
            <li key={b.short}>
              <span className="block h-[2px] overflow-hidden rounded-full bg-line-soft">
                <motion.span
                  className="block h-full origin-left bg-saffron"
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={{ duration: 0.7, ease }}
                />
              </span>
              <span
                className={`mt-2.5 block type-body-sm font-medium transition-colors duration-500 ${on ? 'text-ink' : 'text-ink-mute'}`}
              >
                {b.short}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
