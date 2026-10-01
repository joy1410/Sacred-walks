import { motion } from 'motion/react'
import { departures, innerEngineering, REGISTER_URL, type Departure } from '../../data/kashi'
import { IconArrowRight, IconArrowUpRight } from '../icons'
import { ease, inView, Rise, SectionHeading } from './shared'

/** One departure as a row: when, who it's for, how full it is, and the way in. */
function DepartureRow({ d, index }: { d: Departure; index: number }) {
  const taken = 1 - d.seatsLeft / d.seats
  const few = d.seatsLeft <= 20

  return (
    <motion.li
      className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-5 rounded-[22px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-28px_rgba(0,0,0,0.18)] md:grid-cols-[1.1fr_1.3fr_1fr_auto] md:gap-x-8 md:p-5 md:pl-7"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.9, ease, delay: 0.2 + index * 0.1 }}
    >
      <span className="col-span-2 md:col-span-1">
        <span className="block font-display text-[30px] leading-none font-semibold text-ink tabular-nums md:text-[34px]">
          {d.dates.replace(/ \d{4}$/, '')}
        </span>
        <span className="mt-1.5 block text-[13px] text-ink-mute tabular-nums">
          {d.dates.slice(-4)} · {d.language}
        </span>
      </span>

      <span className="col-span-2 flex items-center gap-3.5 md:col-span-1">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist font-display text-[24px] leading-none font-semibold text-ink">
          {d.group}
        </span>
        <span>
          <span className="block text-[12px] text-ink-mute">Group {d.group}</span>
          <span className="block text-[15px] leading-snug font-semibold text-ink">{d.who}</span>
        </span>
      </span>

      <span className="col-span-2 md:col-span-1">
        <span className="flex items-baseline justify-between gap-3 text-[13px]">
          <span className="font-semibold text-ink tabular-nums">{d.seatsLeft} seats left</span>
          {few && <span className="font-medium text-saffron-ink">Filling fast</span>}
        </span>
        <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-line-soft">
          <motion.span
            className="block h-full origin-left rounded-full bg-saffron"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: taken }}
            viewport={inView}
            transition={{ duration: 1.2, ease, delay: 0.4 + index * 0.1 }}
          />
        </span>
        <span className="mt-1.5 block text-[12px] text-ink-mute tabular-nums">of {d.seats}</span>
      </span>

      <motion.a
        href={REGISTER_URL}
        target="_blank"
        rel="noreferrer"
        whileTap={{ scale: 0.98 }}
        className="group/reg col-span-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-saffron px-7 py-3.5 text-[15px] font-medium whitespace-nowrap text-white transition-colors hover:bg-[#b93c1b] md:col-span-1"
      >
        Register
        <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/reg:translate-x-0.5" />
      </motion.a>
    </motion.li>
  )
}

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

        <ul className="mt-10 space-y-2.5 md:mt-12">
          {departures.map((d, i) => (
            <DepartureRow key={d.group + d.dates} d={d} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
