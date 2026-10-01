import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { preparation } from '../../data/kashi'
import { IconCheck } from '../icons'
import { ease, Rise, SectionHeading } from './shared'

const STORE = 'kashi-packing'

const load = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? '[]')
  } catch {
    return []
  }
}

/**
 * What the yatra asks of you: the three requirements as cards, then the
 * packing list as something to use rather than read. Ticks are kept in
 * this browser only, a convenience for whoever is packing.
 */
export default function Preparation() {
  return (
    <section id="preparation" aria-labelledby="preparation-title" className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading label="Fitness & preparation" id="preparation-title" title="Arrive ready" lede={preparation.summary} />
          <Rise delay={0.2}>
            <div className="flex items-center gap-5 rounded-[24px] bg-mist px-6 py-5">
              <Meter />
              <div>
                <p className="font-display text-[30px] leading-none font-semibold text-ink">{preparation.difficultyLabel}</p>
                <p className="mt-1 text-[14px] text-ink-soft">Temple lanes, ghat steps, sitting on the ground</p>
              </div>
            </div>
          </Rise>
        </div>

        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-5">
          {preparation.requirements.map((r, i) => (
            <Rise key={r.title} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-[28px] border border-line-soft bg-white p-6 md:p-8">
                <span className="text-[13px] font-semibold text-saffron tabular-nums">0{i + 1}</span>
                <h3 className="mt-3 font-display text-[28px] leading-none font-semibold text-ink md:text-[32px]">{r.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.55] text-ink-soft">{r.body}</p>
              </article>
            </Rise>
          ))}
        </div>

        <Rise className="mt-3 md:mt-5">
          <Packing />
        </Rise>
      </div>
    </section>
  )
}

/** the card's three bars, at display size */
function Meter() {
  return (
    <span className="flex items-end gap-1" aria-hidden>
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          className={`w-[7px] origin-bottom rounded-full ${n <= 1 ? 'bg-saffron' : 'bg-line'}`}
          style={{ height: 10 + n * 9 }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.3 + n * 0.08 }}
        />
      ))}
    </span>
  )
}

function Packing() {
  const [packed, setPacked] = useState<string[]>(load)
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(packed))
    } catch {
      /* private mode: the list simply won't be remembered */
    }
  }, [packed])
  const toggle = (item: string) => setPacked((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]))
  const done = packed.filter((p) => preparation.packing.includes(p)).length
  const total = preparation.packing.length

  return (
    <div className="rounded-[28px] bg-mist p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-[28px] leading-none font-semibold text-ink md:text-[32px]">What to pack</h3>
          <p className="mt-2 text-[14.5px] text-ink-soft">Tap each item as it goes in the bag.</p>
        </div>
        <div className="w-full sm:w-[220px]">
          <p className="text-right text-[13px] font-medium text-ink-2 tabular-nums">
            {done} of {total} packed
          </p>
          <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-line-soft">
            <motion.span
              className="block h-full origin-left rounded-full bg-saffron"
              initial={false}
              animate={{ scaleX: done / total }}
              transition={{ duration: 0.6, ease }}
            />
          </span>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {preparation.packing.map((item) => {
          const on = packed.includes(item)
          return (
            <li key={item}>
              <motion.button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(item)}
                whileTap={{ scale: 0.96 }}
                className={`inline-flex items-center gap-1.5 rounded-full border py-2 pr-4 pl-3 text-[14px] font-medium transition-colors duration-300 ${
                  on ? 'border-saffron bg-saffron-soft text-saffron-ink' : 'border-black/10 bg-white text-ink-2 hover:border-black/25'
                }`}
              >
                <span
                  className={`grid h-[18px] w-[18px] place-items-center rounded-full transition-colors duration-300 ${on ? 'bg-saffron text-white' : 'border border-line text-transparent'}`}
                >
                  <IconCheck className="h-3 w-3" />
                </span>
                {item}
              </motion.button>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 border-t border-black/[0.06] pt-5 text-[14.5px] leading-[1.55] text-ink-2">
        <b className="font-semibold text-ink">Pack a personal medical kit</b> {preparation.medicalKit}
      </p>
    </div>
  )
}
