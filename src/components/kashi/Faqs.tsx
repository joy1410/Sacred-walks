import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ENQUIRE_URL, faqs } from '../../data/kashi'
import { IconArrowUpRight, IconPlus } from '../icons'
import { ease, Rise, SectionHeading } from './shared'

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faqs" data-opaque aria-labelledby="faqs-title" className="bg-mist px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="lg:sticky lg:top-[132px] lg:self-start">
          <SectionHeading label="FAQs" id="faqs-title" title="Questions, answered" />
          <Rise delay={0.3}>
            <p className="mt-5 max-w-[360px] type-body text-ink-soft">
              Something else on your mind? The Sacred Walks team is a message or a call away.
            </p>
            <a
              href={ENQUIRE_URL}
              target="_blank"
              rel="noreferrer"
              className="group/link mt-5 inline-flex items-center gap-1 type-button text-saffron-ink hover:text-saffron"
            >
              Ask the team
              <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </Rise>
        </div>

        <Rise delay={0.1}>
          <ul className="space-y-2">
            {faqs.map((f, i) => {
              const on = open === i
              return (
                <li key={f.q} className="rounded-[22px] bg-white transition-shadow duration-300 hover:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)]">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={on}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className="flex w-full items-center justify-between gap-5 rounded-[22px] px-5 py-5 text-left type-label text-ink outline-none focus-visible:ring-2 focus-visible:ring-saffron md:px-7 md:py-6"
                    >
                      {f.q}
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${on ? 'bg-saffron text-white' : 'bg-mist text-ink'}`}
                      >
                        <IconPlus className={`h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] ${on ? 'rotate-45' : ''}`} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 type-body text-ink-soft md:px-7 md:pb-7">
                          {Array.isArray(f.a) ? (
                            <ul className="space-y-1.5">
                              {f.a.map((a) => (
                                <li key={a} className="flex gap-2.5">
                                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" aria-hidden />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="max-w-[620px]">{f.a}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Rise>
      </div>
    </section>
  )
}
