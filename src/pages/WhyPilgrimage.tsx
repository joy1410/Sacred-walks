import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useScroll } from 'motion/react'
import { closing, hero, interlude, movers, parts, type Part } from '../data/whyPilgrimage'
import { BlurText, after } from '../components/hero/BlurIn'
import { QuoteMark } from '../components/QuoteSection'
import { ease, inView, Rise, SectionHeading } from '../components/kashi/shared'
import OtherYatras from '../components/yatras/OtherYatras'
import { useScrollRange } from '../lib/useScrollRange'
import { blur } from '../lib/lite'
import { photo } from '../lib/photo'

const T_TITLE = 0.25
const T_AFTER = after(T_TITLE, hero.title)

/**
 * Sadhguru's article on why pilgrimage, set as a long read: the yatra
 * page's framed film card opens it, three parts follow with the heading
 * held beside the text, and his closing words come last, signed.
 */
export default function WhyPilgrimage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Why Pilgrimage — Isha Sacred Walks'
    return () => {
      document.title = prev
    }
  }, [])

  const [first, second, third] = parts

  return (
    <main>
      <Hero />
      <PartSection part={first} after={<Movers />} />
      <PartSection part={second} />
      <Interlude />
      <PartSection part={third} />
      <Closing />
      <OtherYatras current="" label="Sacred Walks" title="Begin your pilgrimage" />
    </main>
  )
}

/** the Kashi hero's frame, a little shorter: photo settles in, words lift away on scroll */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useScrollRange(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useScrollRange(scrollYProgress, [0, 0.6], [0, -60])
  const textOpacity = useScrollRange(scrollYProgress, [0.05, 0.5], [1, 0], { clamp: true })

  return (
    <section
      ref={ref}
      aria-labelledby="why-title"
      className="px-4 pt-16 pb-4 md:px-[max(16px,2.5vw)] md:pb-[max(16px,2.5vw)]"
    >
      <div className="relative isolate flex h-[calc(88svh-80px)] min-h-[520px] flex-col justify-end overflow-hidden rounded-[24px] bg-night md:h-[calc(88svh-64px-max(16px,2.5vw))] md:min-h-[580px] md:rounded-[28px]">
        <motion.img
          {...photo(hero.image.src, { priority: true })}
          alt={hero.image.caption}
          width={1600}
          height={1066}
          // taller than the card and rising above it, so the scroll drift never shows a dark line along the top
          className="absolute inset-x-0 -top-[22%] -z-10 h-[122%] w-full object-cover"
          initial={{ scale: 1.15, ...blur(14) }}
          animate={{ scale: 1, ...blur(0) }}
          transition={{ duration: 1.8, ease }}
          style={{ y: imgY }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" aria-hidden />

        <motion.div className="px-5 pb-7 text-white md:px-10 md:pb-10 lg:px-14 lg:pb-12" style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="inline-flex rounded-full bg-white px-3 py-1.5 type-chip text-saffron-ink"
          >
            {hero.label}
          </motion.p>
          <h1 id="why-title" className="mt-4 max-w-[18ch] type-display-l text-balance md:mt-5">
            <BlurText text={hero.title} delay={T_TITLE} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: T_AFTER }}
            className="mt-4 max-w-[560px] type-lead-l text-white/85 md:mt-5"
          >
            {hero.lede}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * One part of the article: label and heading held on the left
 * (sticky on wide screens), Sadhguru's words in a reading column beside it.
 */
function PartSection({ part, after: extra }: { part: Part; after?: ReactNode }) {
  return (
    <section id={part.id} aria-labelledby={`${part.id}-title`} className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={part.label} id={`${part.id}-title`} title={part.title} />
        </div>
        <Rise delay={0.2} className="lg:pt-[52px]">
          <Paragraphs part={part} />
        </Rise>
      </div>
      {extra}
    </section>
  )
}

function Paragraphs({ part }: { part: Part }) {
  return (
    <div className="max-w-[640px]">
      {part.paragraphs.map((p, i) => (
        <p key={p.slice(0, 24)} className={`type-lead ${i === 0 ? 'text-ink' : 'text-ink-2'} [&:not(:first-child)]:mt-6`}>
          {p}
        </p>
      ))}
    </div>
  )
}

/**
 * The article's four movers as four lines of display type. The first three
 * stay muted; the pilgrim's line arrives last, in full ink, ending in saffron.
 */
function Movers() {
  return (
    <ul className="mx-auto mt-16 max-w-[1180px] border-t border-line-soft md:mt-24">
      {movers.map((m, i) => {
        const pilgrim = 'accent' in m
        return (
          <motion.li
            key={m.who}
            className={`border-b border-line-soft py-5 type-h3 md:py-7 ${pilgrim ? 'text-ink' : 'text-ink-mute/70'}`}
            initial={{ opacity: 0, y: 16, ...blur(8) }}
            whileInView={{ opacity: 1, y: 0, ...blur(0) }}
            viewport={inView}
            transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.15 + (pilgrim ? 0.25 : 0) }}
          >
            {m.who} {m.why}
            {pilgrim && <span className="text-saffron"> {m.accent}</span>}
          </motion.li>
        )
      })}
    </ul>
  )
}

/** a wide photograph that settles from 1.15× as it scrolls in, as the closing CTA's does */
function Interlude() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useScrollRange(scrollYProgress, [0, 1], [1.15, 1])

  return (
    <section ref={ref} className="p-4 md:p-[max(16px,2.5vw)]">
      <figure className="relative h-[56svh] min-h-[360px] overflow-hidden rounded-[24px] bg-night md:h-[72svh] md:rounded-[28px]">
        <motion.img
          {...photo(interlude.src)}
          alt={interlude.caption}
          width={1600}
          height={1066}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale }}
        />
        <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/30 px-3 py-1.5 type-chip text-white/90 backdrop-blur-md md:bottom-6 md:left-6">
          {interlude.caption}
        </figcaption>
      </figure>
    </section>
  )
}

/** the article's last words, set as the page's large quote: lotus above, signature below */
function Closing() {
  return (
    <section aria-label="Sadhguru's closing words" className="px-5 py-24 md:py-32">
      <figure className="relative mx-auto max-w-[760px] text-center">
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
          {/* the trek in a quieter ink, so the pilgrimage line answers it */}
          <blockquote className="type-quote text-balance">
            <p className="text-ink-mute">{closing[0]}</p>
            <p className="mt-5 text-ink">
              {closing[1].replace(/No-thing\.$/, '')}
              <span className="text-saffron">No-thing.</span>
            </p>
          </blockquote>
        </div>
        <motion.figcaption
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inView}
          transition={{ duration: 1.2, ease, delay: 0.4 }}
        >
          <img src="/images/sadhguru-signature.webp" alt="Sadhguru" width={358} height={169} className="block h-auto w-[150px] md:w-[180px]" />
        </motion.figcaption>
      </figure>
    </section>
  )
}
