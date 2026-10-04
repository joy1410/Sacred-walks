import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const
const inView = { once: true, margin: '-20% 0px' } as const

/**
 * Static, compact quote. Only the lotus blooms and the signature fades in
 * underneath; the words and the quote mark stay still.
 */
export default function QuoteSection() {
  return (
    <section className="px-5 py-24 md:py-32">
      <figure className="relative mx-auto max-w-[720px] text-center">
        <Lotus />
        <div className="relative">
          <QuoteMark className="mx-auto mb-6 h-8 w-10 md:absolute md:-top-1 md:-left-12 md:mb-0 md:h-10 md:w-12" />

          <blockquote className="font-display text-[clamp(1.8rem,3.4vw,2.85rem)] leading-[1.14] font-medium text-balance text-ink">
            The very idea behind a pilgrimage is fundamentally to <span className="text-saffron">subdue</span> the sense
            of who&nbsp;you&nbsp;are.
          </blockquote>
        </div>

        <figcaption className="mt-8 flex justify-center">
          <Signature />
        </figcaption>
      </figure>
    </section>
  )
}

/** The saffron mark that opens every Sadhguru quote; Kashi Krama's quote shares it. */
export function QuoteMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={`block text-saffron ${className}`} aria-hidden>
      <path
        fill="currentColor"
        d="M0 40V23.6C0 10.4 6.6 2.4 19.2 0l2 4.6C14.4 7 11 11.6 10.6 18.4H20V40H0Zm28 0V23.6C28 10.4 34.6 2.4 47.2 0l2 4.6C42.4 7 39 11.6 38.6 18.4H48V40H28Z"
      />
    </svg>
  )
}

/** A small lotus crowning the quote. It blooms open from its base as the section arrives. */
function Lotus() {
  return (
    <motion.img
      src="/images/Design%20elements/lotus.webp"
      alt=""
      aria-hidden
      width={811}
      height={441}
      loading="lazy"
      decoding="async"
      className="mx-auto mb-5 block h-auto w-[150px] origin-bottom md:mb-8 md:w-[210px]"
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 1.4, ease }}
    />
  )
}

/** Sadhguru's signature, fading in once the quote is in view. */
function Signature() {
  return (
    <motion.img
      src="/images/sadhguru-signature.webp"
      alt="Sadhguru"
      width={358}
      height={169}
      className="block h-auto w-[150px] md:w-[180px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={inView}
      transition={{ duration: 1.2, ease, delay: 0.4 }}
    />
  )
}
