import { motion } from 'motion/react'
import { cost, ENQUIRE_URL, type Highlight } from '../../data/kashi'
import { IconCheck, IconDoctor, IconHotel, IconMeal, IconPhone, IconPlus } from '../icons'
import { ease, inView, Rise, SectionHeading } from './shared'

const icons: Record<Highlight['icon'], typeof IconHotel> = {
  hotel: IconHotel,
  meal: IconMeal,
  doctor: IconDoctor,
}

/**
 * What the contribution covers: the three things people ask about first,
 * then the plain included / not included list. The amount isn't published,
 * so it closes the section as a quiet line that routes to enquiry, rather
 * than a second headline competing with the section's own.
 */
export default function Cost() {
  return (
    <section id="included" aria-labelledby="included-title" className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label="What’s included" id="included-title" title="What your contribution covers" />

        <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-3 md:gap-5">
          {cost.highlights.map((h, i) => {
            const Icon = icons[h.icon]
            return (
              <li key={h.title}>
                <Rise delay={i * 0.08} className="h-full rounded-[28px] border border-line-soft bg-white p-6 md:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-saffron-soft text-saffron">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-[19px] font-semibold text-ink md:mt-10">{h.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-ink-soft">{h.body}</p>
                </Rise>
              </li>
            )
          })}
        </ul>

        <Rise className="mt-3 md:mt-5">
          <div className="rounded-[28px] border border-line-soft bg-white">
            <div className="grid gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-9">
              <div>
                <h3 className="text-[15px] font-semibold text-ink">Also included</h3>
                <ul className="mt-4 space-y-3">
                  {cost.included.map((c, i) => (
                    <motion.li
                      key={c}
                      className="flex gap-3 text-[15px] leading-snug text-ink-2"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={inView}
                      transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.05 }}
                    >
                      <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-saffron text-white">
                        <IconCheck className="h-3 w-3" />
                      </span>
                      {c}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">Not included</h3>
                <ul className="mt-4 space-y-3">
                  {cost.excluded.map((c) => (
                    <li key={c} className="flex gap-3 text-[15px] leading-snug text-ink-soft">
                      <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line text-ink-mute">
                        <IconPlus className="h-3 w-3 rotate-45" />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-line-soft p-6 md:flex-row md:items-center md:justify-between md:px-9 md:py-7">
              <div>
                <p className="text-[17px] font-semibold text-ink">The 2026 contribution is shared on enquiry</p>
                <p className="mt-1 max-w-[520px] text-[15px] leading-[1.5] text-ink-soft">
                  The team will send the amount, payment details and the registration form for your group.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                <motion.a
                  href={ENQUIRE_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full bg-saffron px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#b93c1b]"
                >
                  Enquire now
                </motion.a>
                <a
                  href="tel:+918144123123"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-[15px] font-medium whitespace-nowrap text-ink tabular-nums transition-colors hover:border-ink/40"
                >
                  <IconPhone className="h-4 w-4" />
                  +91 81441 23123
                </a>
              </div>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  )
}
