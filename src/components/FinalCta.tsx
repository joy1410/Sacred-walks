import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { u } from '../data/yatras'
import { BlurText, after } from './hero/BlurIn'
import { IconArrowRight } from './icons'
import { useScrollRange } from '../lib/useScrollRange'

const ease = [0.16, 1, 0.3, 1] as const
const inView = { once: true, margin: '-15% 0px' } as const
const HEADLINE = 'Ready to take the first step?'

/**
 * One last door. The card is framed like the hero's finished film (same inset
 * and radius) and the photo settles from 1.15× as it arrives, the hero's
 * scroll-in inverted, so the page closes the way it opened.
 */
export default function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useScrollRange(scrollYProgress, [0, 1], [1.15, 1])

  return (
    <section ref={ref} aria-labelledby="cta-title" className="p-4 md:p-[max(16px,2.5vw)]">
      <div className="relative flex min-h-[78svh] items-center justify-center overflow-hidden rounded-[24px] bg-night px-6 py-20 text-center md:rounded-[28px]">
        <motion.img
          src={u('1764753757089-ba31eb338384', 2400)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale }}
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />

        <div className="relative max-w-[760px] text-white">
          <h2 id="cta-title" className="font-display text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[1.02] font-semibold">
            <BlurText text={HEADLINE} delay={0.1} inView />
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1, ease, delay: after(0.1, HEADLINE) }}
          >
            <p className="mx-auto mt-6 max-w-[480px] text-[16px] leading-[1.5] text-white/80 md:text-[18px]">
              Four yatras, each a doorway. Find the one that is calling you, or talk to us and we'll help you choose.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-2.5 sm:flex-row">
              <a
                href="#yatras"
                className="group/view inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-mist"
              >
                Explore the yatras
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/view:translate-x-0.5" />
              </a>
              <motion.a
                href="#"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full bg-saffron px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#b93c1b]"
              >
                Enquire
              </motion.a>
            </div>

            <p className="mt-7 text-[13px] text-white/60 tabular-nums">
              Or call <a href="tel:+918144123123" className="text-white/85 hover:text-white">+91 81441 23123</a> (India) ·{' '}
              <a href="tel:+19312186466" className="text-white/85 hover:text-white">+1 931 218 6466</a> (USA)
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
