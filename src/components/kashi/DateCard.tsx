import { useId, useSyncExternalStore } from 'react'
import { motion, type Variants } from 'motion/react'
import { ENQUIRE_URL, innerEngineering, REGISTER_URL, type Departure, type Pool } from '../../data/kashi'
import { IconArrowRight, IconArrowUpRight, IconCheck, IconInfo } from '../icons'
import { ease, inView } from './shared'

/** a visitor on Indian time most likely lives in India; they can still switch */
function guessPool(pools: Pool[]): Pool['id'] {
  let tz = ''
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    /* no Intl: fall through to the first pool */
  }
  const india = tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta'
  return pools.find((p) => p.id === (india ? 'india' : 'international'))?.id ?? pools[0].id
}

const few = (p: Pool) => p.seatsLeft <= 20

/*
 * The answer is about the visitor, not the card: pick it in the dates
 * section and the registration card at the foot of the page already agrees.
 */
let chosen: Pool['id'] | null = null
const listeners = new Set<() => void>()
const choose = (id: Pool['id']) => {
  chosen = id
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

// one in-view trigger per card; the seat bars fill from it
const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay } }),
}
const bar: Variants = {
  hidden: { scaleX: 0 },
  show: ({ taken, delay }: { taken: number; delay: number }) => ({ scaleX: taken, transition: { duration: 1.2, ease, delay } }),
}

/**
 * One date, one card, one way in. The date is what people are choosing, so
 * it appears once, with its details right under it; the programme's two
 * groups sit side by side with yours highlighted, preselected from the
 * visitor's timezone so most people never need to touch it. Each group
 * carries its own seats, and the single CTA names the date it registers for.
 * Inner Engineering is a hard prerequisite, so it shares the footer with the
 * buttons: the one place everyone about to register is already looking.
 */
export default function DateCard({ d, dark = false, delay = 0 }: { d: Departure; dark?: boolean; delay?: number }) {
  const poolId = useSyncExternalStore(subscribe, () => chosen ?? guessPool(d.pools))
  const name = useId()
  const pool = d.pools.find((p) => p.id === poolId) ?? d.pools[0]

  const t = dark
    ? {
        card: 'bg-white/10 text-white backdrop-blur-md',
        mute: 'text-white/60',
        soft: 'text-white/75',
        tile: 'bg-white/[0.06] ring-1 ring-white/15 hover:bg-white/10',
        on: 'bg-white/15 ring-2 ring-white',
        track: 'bg-white/15',
        dot: 'border-white/40',
        dotOn: 'border-white bg-white text-ink',
        bar: 'bg-white/80',
        warn: 'text-[#ffb59c]',
        link: 'text-white hover:text-white/80',
        rule: 'border-white/15',
        icon: 'bg-white/15 text-white',
        ghost: 'text-white ring-1 ring-white/40 hover:bg-white/10',
      }
    : {
        card: 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-28px_rgba(0,0,0,0.18)]',
        mute: 'text-ink-mute',
        soft: 'text-ink-soft',
        tile: 'bg-mist ring-1 ring-transparent hover:ring-line',
        on: 'bg-mist ring-2 ring-saffron',
        track: 'bg-line-soft',
        dot: 'border-line',
        dotOn: 'border-saffron bg-saffron text-white',
        bar: 'bg-ink-2',
        warn: 'text-saffron-ink',
        link: 'text-saffron-ink hover:text-saffron',
        rule: 'border-line-soft',
        icon: 'bg-saffron-soft text-saffron-ink',
        ghost: 'text-ink ring-1 ring-line hover:bg-mist',
      }

  return (
    <motion.article
      className={`rounded-[26px] p-4 md:p-6 ${t.card}`}
      variants={card}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      <header className="px-1">
        <h3 className="type-title-l tabular-nums">{d.short}</h3>
        <p className={`mt-2 type-body-sm tabular-nums ${t.soft}`}>
          {d.year} · {d.days} days · {d.language}
        </p>
      </header>

      <fieldset className="mt-5 md:mt-6">
        <legend className="sr-only">Seats by group</legend>
        <div className="grid gap-2 sm:grid-cols-2 md:gap-2.5">
          {d.pools.map((p, i) => {
            const on = p.id === pool.id
            return (
              <label
                key={p.id}
                className={`relative flex cursor-pointer gap-3.5 rounded-[18px] p-4 transition-[background-color,box-shadow] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-saffron md:p-5 ${on ? t.on : t.tile}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={p.id}
                  checked={on}
                  onChange={() => choose(p.id)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-[1.5px] transition-colors ${on ? t.dotOn : t.dot}`}
                  aria-hidden
                >
                  {on && <IconCheck className="h-3 w-3" strokeWidth={2.6} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block type-label">{p.label}</span>
                  <span className={`mt-0.5 block type-body-sm ${t.soft}`}>{p.who}</span>

                  <span className="mt-4 flex items-baseline justify-between gap-3 type-caption tabular-nums">
                    <span>
                      <b className="font-semibold">{p.seatsLeft} seats left</b>
                      <span className={t.mute}> of {p.seats}</span>
                    </span>
                    {few(p) && <span className={`font-medium ${t.warn}`}>Filling fast</span>}
                  </span>
                  <span className={`mt-2 block h-[4px] overflow-hidden rounded-full ${t.track}`} aria-hidden>
                    <motion.span
                      className={`block h-full origin-left rounded-full ${t.bar}`}
                      variants={bar}
                      custom={{ taken: 1 - p.seatsLeft / p.seats, delay: delay + 0.3 + i * 0.1 }}
                    />
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <footer className={`mt-5 flex flex-col gap-5 border-t px-1 pt-5 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-10 md:pt-6 ${t.rule}`}>
        <div className="flex gap-3.5">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${t.icon}`} aria-hidden>
            <IconInfo className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="type-label">{innerEngineering.title}</p>
            <p className={`mt-1 type-body-sm ${t.soft}`}>
              {innerEngineering.body}{' '}
              <a
                href={innerEngineering.link.href}
                target="_blank"
                rel="noreferrer"
                className={`group/link inline-flex items-center gap-1 font-medium whitespace-nowrap ${t.link}`}
              >
                {innerEngineering.link.label}
                <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
          <motion.a
            href={REGISTER_URL}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.98 }}
            className="group/reg inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-8 py-4 type-button whitespace-nowrap text-white transition-colors hover:bg-[#b93c1b] sm:order-2"
          >
            Register for {d.short}
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/reg:translate-x-0.5" />
          </motion.a>
          <a
            href={ENQUIRE_URL}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center rounded-full px-7 py-4 type-button whitespace-nowrap transition-colors sm:order-1 ${t.ghost}`}
          >
            Enquire
          </a>
        </div>
      </footer>
    </motion.article>
  )
}
