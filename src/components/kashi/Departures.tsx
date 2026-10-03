import { departures } from '../../data/kashi'
import DateCard from './DateCard'
import { SectionHeading } from './shared'

/**
 * Right under the hero: when you can go, how many places remain, and the
 * one thing you must have done first, confirmed on the card before Register.
 */
export default function Departures() {
  return (
    <section id="dates" data-opaque aria-labelledby="dates-title" className="bg-mist px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label="Seats & registration" id="dates-title" title="Yatra dates" />

        <div className="mt-8 space-y-3 md:mt-10">
          {departures.map((d, i) => (
            <DateCard key={d.dates} d={d} delay={0.2 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
