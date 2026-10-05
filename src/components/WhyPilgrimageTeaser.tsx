import { motion } from 'motion/react'
import { BlurText } from './hero/BlurIn'
import { MotionSiteLink } from './SiteLink'
import { IconArrowRight } from './icons'
import { blur } from '../lib/lite'

const ease = [0.16, 1, 0.3, 1] as const
const inView = { once: true, margin: '-15% 0px' } as const

// the article's closing contrast, cut to its two halves
const lines = [
  { text: 'A trek is about achievement.' },
  { text: 'A pilgrimage is about', accent: 'dissolution.' },
] as const

/**
 * For whoever has seen the yatras and the stories and is still deciding:
 * the deeper why, in one contrast, and a door to Sadhguru's article.
 * The trek line stays muted so the pilgrimage line answers it, as on the page itself.
 */
export default function WhyPilgrimageTeaser() {
  return (
    <section aria-labelledby="why-teaser-title" className="px-4 py-24 md:px-5 md:py-32">
      <div className="mx-auto max-w-[900px] text-center">
        <h2 id="why-teaser-title" className="type-label-sm text-ink-mute">
          <BlurText text="Why pilgrimage?" inView />
        </h2>

        <div className="mt-6 type-h2 text-balance md:mt-8">
          {lines.map((l, i) => (
            <motion.p
              key={l.text}
              className={i === 0 ? 'text-ink-mute/70' : 'mt-1 text-ink md:mt-2'}
              initial={{ opacity: 0, y: 16, ...blur(8) }}
              whileInView={{ opacity: 1, y: 0, ...blur(0) }}
              viewport={inView}
              transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.35 }}
            >
              {l.text}
              {'accent' in l && <span className="text-saffron"> {l.accent}</span>}
            </motion.p>
          ))}
        </div>

        <MotionSiteLink
          href="/why-pilgrimage"
          // same pill as the hero film's CTA
          className="group/why mt-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.14)] transition-colors duration-300 outline-none hover:text-saffron focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 active:text-saffron md:gap-2 md:px-5 md:py-2.5 md:text-[15px]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          viewport={inView}
          transition={{ duration: 0.9, ease, delay: 0.9 }}
        >
          Read the full article by Sadhguru
          <IconArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover/why:translate-x-0.5" />
        </MotionSiteLink>
      </div>
    </section>
  )
}
