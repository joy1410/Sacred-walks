import { motion, type Variants } from 'motion/react'
import { kashi, overview, reasons, type Reason } from '../../data/kashi'
import { blur } from '../../lib/lite'
import { QuoteMark } from '../QuoteSection'
import { ease, inView, Rise, SectionHeading } from './shared'

// one trigger per tile: the card rises, its photo settles inside it, and
// only once the card has landed do the words follow, line by line
const TEXT_AFTER = 0.45
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, ease, delay: d } }),
}
const photo: Variants = {
  hidden: { scale: 1.18 },
  show: (d: number) => ({ scale: 1, transition: { duration: 1.6, ease, delay: d } }),
}
const panel: Variants = {
  hidden: {},
  show: (d: number) => ({ transition: { staggerChildren: 0.12, delayChildren: d + TEXT_AFTER } }),
}
// the journey panels' per-line focus pull
const item: Variants = {
  hidden: { opacity: 0, y: 16, ...blur(8) },
  show: { opacity: 1, y: 0, ...blur(0), transition: { duration: 0.9, ease } },
}

// alternating wide / narrow so the grid reads as a wall of windows, not a table
const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

/**
 * The city in one section: Sadhguru's words crown it (the homepage quote's
 * lotus and signature), the overview sits beside its heading, and four
 * windows say why Kashi, drawn from Sadhguru's talks on the city.
 */
export default function AboutKashi() {
  return (
    <section id="about" aria-labelledby="about-title" className="px-4 pt-20 pb-24 md:px-5 md:pt-28 md:pb-32">
      <Quote />

      <div className="mx-auto mt-20 max-w-[1180px] md:mt-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading label="About Kashi" id="about-title" title="The city of light" />
            <Rise delay={0.3}>
              <p className="mt-6 text-[21px] leading-[1.35] font-medium tracking-[-0.02em] text-ink-2 md:text-[25px]">
                {overview.lead.before}
                <span className="text-saffron">{overview.lead.accent}</span>
                {overview.lead.after}
              </p>
            </Rise>
          </div>
          <Rise delay={0.2} className="lg:pt-[52px]">
            {overview.body.map((p) => (
              <p key={p.slice(0, 20)} className="mb-5 text-[16px] leading-[1.6] text-ink-soft md:text-[17px]">
                {p}
              </p>
            ))}
          </Rise>
        </div>

        <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-12 md:gap-5">
          {reasons.map((r, i) => (
            <Tile key={r.title} reason={r} index={i} className={spans[i]} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Quote() {
  return (
    <figure className="mx-auto max-w-[760px] text-center">
      <motion.img
        src="/images/Design%20elements/lotus.webp"
        alt=""
        aria-hidden
        width={811}
        height={441}
        loading="lazy"
        decoding="async"
        className="mx-auto mb-6 block h-auto w-[130px] origin-bottom md:mb-8 md:w-[170px]"
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 1.4, ease }}
      />
      <div className="relative">
        <QuoteMark className="mx-auto mb-6 h-8 w-10 md:absolute md:-top-1 md:-left-12 md:mb-0 md:h-10 md:w-12" />
        <blockquote className="font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.14] font-medium text-balance text-ink">
          The creation of Kashi is the most phenomenal effort in building{' '}
          <span className="text-saffron">structures of consciousness</span> ever made on the planet.
        </blockquote>
      </div>
      <motion.figcaption
        className="mt-7 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={inView}
        transition={{ duration: 1.2, ease, delay: 0.4 }}
      >
        <img src="/images/sadhguru-signature.webp" alt={kashi.quote.by} width={358} height={169} className="block h-auto w-[140px] md:w-[170px]" />
      </motion.figcaption>
    </figure>
  )
}

function Tile({ reason, index, className }: { reason: Reason; index: number; className: string }) {
  const delay = (index % 2) * 0.1
  return (
    <motion.article
      className={`group/tile relative aspect-[4/5] overflow-hidden rounded-[28px] bg-night sm:aspect-[4/3] md:aspect-auto md:h-[480px] ${className}`}
      variants={card}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {/* settles as it arrives, then answers hover with a slow lean in */}
      <motion.div className="absolute inset-0" variants={photo} custom={delay}>
        <img
          src={reason.image.src}
          alt={reason.image.caption}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/tile:scale-[1.05]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/0" aria-hidden />

      <motion.div
        variants={panel}
        custom={delay}
        className="absolute inset-x-0 bottom-0 p-6 text-white md:p-9"
      >
        <motion.h3 variants={item} className="max-w-[22ch] font-display text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.04] font-semibold">
          {reason.title}
        </motion.h3>
        <motion.p variants={item} className="mt-3 max-w-[440px] text-[15px] leading-[1.45] text-white/80 md:text-[16px]">
          {reason.body}
        </motion.p>
      </motion.div>
    </motion.article>
  )
}
