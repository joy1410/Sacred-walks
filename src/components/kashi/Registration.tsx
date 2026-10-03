import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { departures, ENQUIRE_URL } from '../../data/kashi'
import { BlurText } from '../hero/BlurIn'
import { useScrollRange } from '../../lib/useScrollRange'
import DateCard from './DateCard'
import { ease, inView } from './shared'

const HEADLINE = 'Kashi is calling'

/**
 * The page closes as the homepage does: a card framed like the hero film,
 * its photo settling from 1.15× as it arrives. The dates sit on it
 * in glass: the same date card as the top of the page, so the two never disagree.
 */
export default function Registration() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useScrollRange(scrollYProgress, [0, 1], [1.15, 1])

  return (
    <section id="register" ref={ref} aria-labelledby="register-title" className="p-4 md:p-[max(16px,2.5vw)]">
      <div className="relative overflow-hidden rounded-[24px] bg-night px-5 py-20 md:rounded-[28px] md:px-10 md:py-28">
        <motion.img
          src="/images/kashi/ghat-fort.webp"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale }}
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />

        <div className="relative mx-auto max-w-[900px] text-white">
          <div className="text-center">
            <p className="text-[13px] font-semibold text-white/60 md:text-[14px]">Registration</p>
            <h2 id="register-title" className="mt-3 font-display text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[0.96] font-semibold">
              <BlurText text={HEADLINE} delay={0.1} inView />
            </h2>
            <motion.p
              className="mx-auto mt-5 max-w-[480px] text-[16px] leading-[1.5] text-white/80 md:text-[18px]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 1, ease, delay: 0.45 }}
            >
              Registrations for December 2026 are open. Applications are processed on a first-come, first-served basis.
            </motion.p>
          </div>

          <div className="mt-10 space-y-3 md:mt-14">
            {departures.map((d, i) => (
              <DateCard key={d.dates} d={d} dark delay={0.55 + i * 0.1} />
            ))}
          </div>

          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inView}
            transition={{ duration: 1, ease, delay: 0.8 }}
          >
            <a
              href={ENQUIRE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-mist"
            >
              Not sure yet? Enquire
            </a>
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
