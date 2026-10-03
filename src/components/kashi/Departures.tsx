import { departures, innerEngineering } from '../../data/kashi'
import { IconArrowUpRight } from '../icons'
import DateCard from './DateCard'
import { Rise, SectionHeading } from './shared'

/**
 * Right under the hero: when you can go, how many places remain, and the
 * one thing you must have done first, before anyone reaches for Register.
 */
export default function Departures() {
  return (
    <section id="dates" data-opaque aria-labelledby="dates-title" className="bg-mist px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-end lg:gap-14">
          <SectionHeading
            label="Dates & availability"
            id="dates-title"
            title="Choose your departure"
            lede="Registrations are open. Applications are processed on a first-come, first-served basis."
          />

          <Rise delay={0.2}>
            <aside className="rounded-[22px] border border-saffron/20 bg-saffron-soft p-5 md:p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-saffron-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden />
                Before you register
              </span>
              <h3 className="mt-3 font-display text-[26px] leading-none font-semibold text-ink md:text-[28px]">{innerEngineering.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.5] text-ink-2">{innerEngineering.body}</p>
              <a
                href={innerEngineering.link.href}
                target="_blank"
                rel="noreferrer"
                className="group/link mt-3 inline-flex items-center gap-1 text-[14.5px] font-medium text-saffron-ink hover:text-saffron"
              >
                {innerEngineering.link.label}
                <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </aside>
          </Rise>
        </div>

        <div className="mt-10 space-y-3 md:mt-12">
          {departures.map((d, i) => (
            <DateCard key={d.dates} d={d} delay={0.2 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
