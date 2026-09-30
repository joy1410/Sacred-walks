import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const
const inView = { once: true, margin: '-20% 0px' } as const

/**
 * Static, compact quote. Only the ornaments move: the quote marks settle
 * in, then the signature writes itself underneath.
 */
export default function QuoteSection() {
  return (
    <section className="bg-white px-5 py-24 md:py-32">
      <figure className="relative mx-auto max-w-[820px] text-center">
        <QuoteMark className="mx-auto mb-6 h-8 w-10 md:absolute md:-top-2 md:-left-20 md:mb-0 md:h-10 md:w-12" delay={0.1} />

        <blockquote className="font-display text-[clamp(1.8rem,3.4vw,2.85rem)] leading-[1.14] font-medium text-ink-2">
          A pilgrimage is not an achievement but an opportunity to subdue the sense of who you are and to access
          the <span className="text-saffron">beyond</span>.
        </blockquote>

        <figcaption className="mt-10 flex justify-center">
          <Signature />
        </figcaption>
      </figure>
    </section>
  )
}

function QuoteMark({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 50 40"
      className={`block text-saffron ${className}`}
      aria-hidden
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 1, ease, delay }}
    >
      <path
        fill="currentColor"
        d="M0 40V23.6C0 10.4 6.6 2.4 19.2 0l2 4.6C14.4 7 11 11.6 10.6 18.4H20V40H0Zm28 0V23.6C28 10.4 34.6 2.4 47.2 0l2 4.6C42.4 7 39 11.6 38.6 18.4H48V40H28Z"
      />
    </motion.svg>
  )
}

/**
 * Signature that writes itself left → right once in view.
 * Placeholder lettering: replace with the official Sadhguru signature SVG.
 */
function Signature() {
  return (
    <motion.span
      role="img"
      aria-label="Sadhguru"
      className="block font-[family-name:var(--font-signature)] text-[3.6rem] leading-[1.1] text-ink"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={inView}
      transition={{ duration: 1.8, ease: [0.45, 0, 0.25, 1], delay: 0.5 }}
    >
      Sadhguru
    </motion.span>
  )
}
