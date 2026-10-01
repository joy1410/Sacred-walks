import { motion } from 'motion/react'
import { cost, ENQUIRE_URL } from '../../data/kashi'
import { IconCheck, IconPlus } from '../icons'
import { ease, inView, Rise, SectionHeading } from './shared'

/**
 * The contribution isn't published, so this answers the question that is:
 * what it covers. The ask routes to enquiry, never a dead end.
 */
export default function Cost() {
  return (
    <section id="cost" aria-labelledby="cost-title" className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label="Cost" id="cost-title" title="What your contribution covers" />

        <Rise className="mt-10 md:mt-14">
          <div className="grid gap-2 rounded-[32px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col rounded-[26px] bg-saffron-soft p-6 md:p-9">
              <p className="text-[14px] font-semibold text-saffron-ink">Contribution for 2026</p>
              <p className="mt-3 font-display text-[clamp(2.6rem,4.6vw,4rem)] leading-[0.95] font-semibold text-ink">Shared on enquiry</p>
              <p className="mt-4 max-w-[380px] text-[15px] leading-[1.55] text-ink-2">
                Send an enquiry and the team will share the contribution, payment details and the registration form for your group.
              </p>
              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:mt-auto lg:pt-10">
                <motion.a
                  href={ENQUIRE_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-saffron px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#b93c1b]"
                >
                  Enquire now
                </motion.a>
                <a
                  href="tel:+918144123123"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-ink/15 bg-white px-6 py-3.5 text-[15px] font-medium whitespace-nowrap text-ink tabular-nums transition-colors hover:border-ink/40"
                >
                  +91 81441 23123
                </a>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:p-9">
              <div>
                <h3 className="text-[15px] font-semibold text-ink">Included</h3>
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
          </div>
        </Rise>
      </div>
    </section>
  )
}
