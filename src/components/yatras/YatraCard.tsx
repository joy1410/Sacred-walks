import { motion, type Variants } from 'motion/react'
import type { Yatra, YatraStatus } from '../../data/yatras'
import ImageCarousel from './ImageCarousel'
import DifficultyMeter from './DifficultyMeter'
import { IconArrowRight, IconRoute, IconSadhana, IconSunrise } from '../icons'

const ease = [0.16, 1, 0.3, 1] as const
const highlightIcons = [IconRoute, IconSunrise, IconSadhana]

const panel: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

/**
 * Status-first listing card: can I go (pill), what is it (title + facts),
 * what will I live through (highlights), what next (footer, which changes
 * with the registration state and never dead-ends).
 *
 * The whole card opens the yatra page (Airbnb pattern): the title link is
 * stretched over the card, and the few real controls (carousel buttons, the
 * status action) sit above it on z-10, so they keep their own clicks.
 */
export default function YatraCard({ yatra }: { yatra: Yatra }) {
  const s = yatra.status

  return (
    <article className="group/card relative grid cursor-pointer gap-2 rounded-[32px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_40px_80px_-30px_rgba(0,0,0,0.28)] has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-saffron lg:h-full lg:grid-cols-[1.55fr_1fr]">
      <ImageCarousel yatra={yatra} />

      <motion.div className="flex min-h-0 flex-col px-3 pt-3 pb-2 *:shrink-0 md:px-7 md:pt-7 md:pb-4" variants={panel} initial="hidden" animate="show">
        <motion.div variants={item}>
          <StatusPill status={s} />
        </motion.div>

        <motion.h3 variants={item} className="mt-3 font-display text-[30px] leading-[1] font-semibold text-ink md:mt-4 md:text-[40px]">
          <a
            href={`/yatras/${yatra.slug}`}
            className="card-link inline-flex items-center gap-2 outline-none after:absolute after:inset-0 after:rounded-[32px]"
          >
            {yatra.title}
            {/* the only visible hint that the card opens: an arrow that answers hover */}
            <IconArrowRight className="h-5 w-5 -translate-x-1 text-ink-mute opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:text-saffron group-hover/card:opacity-100" />
          </a>
        </motion.h3>
        <motion.p variants={item} className="mt-1 text-[15px] tracking-[-0.015em] text-ink-soft md:mt-1.5 md:text-[16px]">
          {yatra.tagline}
        </motion.p>

        {/* facts: spread edge to edge; dividers are their own flex items so each
            sits centred in its gap */}
        <motion.div
          variants={item}
          className="mt-4 flex items-center justify-between border-y border-line-soft px-1 py-2.5 text-[14px] md:mt-5 md:px-3 md:py-3 md:text-[15px] font-semibold whitespace-nowrap text-ink tabular-nums"
        >
          <span>{yatra.days} days</span>
          <span className="h-4 w-px bg-line-soft" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <DifficultyMeter level={yatra.difficulty} />
            {yatra.difficultyLabel}
          </span>
          <span className="h-4 w-px bg-line-soft" aria-hidden />
          <span>{yatra.seasonShort}</span>
        </motion.div>

        <motion.ul variants={item} className="mt-4 space-y-2.5 md:mt-6 md:space-y-3.5">
          {yatra.highlights.map((h, i) => {
            const Icon = highlightIcons[i % highlightIcons.length]
            return (
              <li key={h} className="flex items-center gap-3.5">
                <Icon className="h-5 w-5 shrink-0 text-ink" />
                <span className="text-[14px] leading-snug text-ink-2 md:text-[15px]">{h}</span>
              </li>
            )
          })}
        </motion.ul>

        <motion.div variants={item} className="mt-auto pt-4 md:pt-6">
          <StatusNote status={s} />
          <StatusAction status={s} slug={yatra.slug} />
        </motion.div>
      </motion.div>
    </article>
  )
}

function StatusPill({ status }: { status: YatraStatus }) {
  if (status.state === 'open') {
    const few = status.seatsLeft !== undefined && status.seatsLeft <= 20
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-saffron-soft py-1.5 pr-3 pl-2.5 text-[13px] font-semibold text-saffron-ink">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-saffron opacity-40 motion-reduce:hidden" />
          <span className="relative h-2 w-2 rounded-full bg-saffron" />
        </span>
        {few ? 'Few seats left' : 'Registrations open'}
      </span>
    )
  }
  const label = status.state === 'soon' ? `Registrations open ${status.opens}` : `Closed for ${status.completed}`
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-mist py-1.5 pr-3 pl-2.5 text-[13px] font-semibold text-ink-2">
      <span className="h-2 w-2 rounded-full border-[1.5px] border-ink-mute" />
      {label}
    </span>
  )
}

function StatusNote({ status }: { status: YatraStatus }) {
  return (
    <div className="rounded-2xl bg-mist px-3.5 py-2.5 text-[13.5px] leading-snug text-ink-2 md:px-4 md:py-3 md:text-[14px]">
      {status.state === 'open' && (
        <>
          <span className="block text-[12px] text-ink-mute">Next departure</span>
          <b className="font-semibold text-ink tabular-nums">{status.departure}</b>
          {status.seatsLeft !== undefined && <span className="tabular-nums"> · {status.seatsLeft} seats left</span>}
        </>
      )}
      {status.state === 'soon' && (
        <>
          <b className="font-semibold text-ink">{status.season} departures.</b> Registration opens {status.opens}. We'll tell you the
          moment it does.
        </>
      )}
      {status.state === 'closed' && (
        <>
          <b className="font-semibold text-ink">
            {status.opens ? `${status.next} registrations open in ${status.opens}.` : `${status.next} dates coming soon.`}
          </b>{' '}
          Join the waitlist to be notified when registration opens.
        </>
      )}
    </div>
  )
}

/**
 * "View yatra" (outline, always the same) beside the state's own action (saffron).
 * Both sit above the card link on z-10 so each keeps its own click.
 */
function StatusAction({ status, slug }: { status: YatraStatus; slug: string }) {
  const label = status.state === 'open' ? 'Register' : status.state === 'soon' ? 'Notify me' : `Join ${status.next} waitlist`

  return (
    <div className="relative z-10 mt-2.5 flex gap-2 md:mt-3 md:gap-2.5">
      <a
        href={`/yatras/${slug}`}
        tabIndex={-1}
        className="group/view flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-white px-2.5 py-3 text-[14px] md:px-4 md:py-3.5 md:text-[15px] font-medium whitespace-nowrap text-ink transition-colors hover:border-ink/40 hover:bg-mist"
      >
        View yatra
        <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/view:translate-x-0.5" />
      </a>
      <motion.a
        href="#"
        whileTap={{ scale: 0.98 }}
        className={`flex flex-1 items-center justify-center rounded-full px-2.5 py-3 text-[14px] md:px-4 md:py-3.5 md:text-[15px] font-medium whitespace-nowrap transition-colors ${
          // filled saffron only when you can act now; otherwise saffron outline
          status.state === 'open'
            ? 'bg-saffron text-white hover:bg-[#b93c1b]'
            : 'border border-saffron text-saffron-ink hover:bg-saffron-soft'
        }`}
      >
        {label}
      </motion.a>
    </div>
  )
}
