import { motion } from 'motion/react'
import { yatraPage, yatras, type Yatra } from '../../data/yatras'
import SiteLink from '../SiteLink'
import { IconArrowRight } from '../icons'
import DifficultyMeter from './DifficultyMeter'
import { StatusPill } from './YatraCard'
import { ease, inView, SectionHeading } from '../kashi/shared'

/**
 * Closes a yatra page before the footer: the other walks, so a reader for
 * whom this one isn't right still has somewhere to go. A compact cousin of
 * YatraCard (one photo, the same pill and facts), and the whole card is the link.
 */
export default function OtherYatras({
  current,
  label = 'More Sacred Walks',
  title = 'Other yatras',
}: {
  current: string
  label?: string
  title?: string
}) {
  const others = yatras.filter((y) => y.slug !== current)

  return (
    <section aria-labelledby="other-yatras-title" className="px-4 pt-20 md:px-5 md:pt-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} id="other-yatras-title" title={title} />

        {/* phones: a swipeable row (the next card peeks in); wider: three across */}
        <ul className={`-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pt-2 pb-12 [scrollbar-width:none] md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-5 ${others.length === 4 ? 'lg:grid-cols-4' : ''} md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden`}>
          {others.map((y, i) => (
            <motion.li
              key={y.slug}
              className="w-[82%] shrink-0 snap-start md:w-auto"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 1, ease, delay: 0.1 + i * 0.1 }}
            >
              <Card yatra={y} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Card({ yatra }: { yatra: Yatra }) {
  const cover = yatra.images[0]
  const page = yatraPage(yatra.slug)

  return (
    <article
      className={`relative flex h-full flex-col rounded-[28px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] ${
        // only a yatra with its own page lifts on hover; the rest are shown, not linked
        page
          ? 'group/card transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_40px_80px_-30px_rgba(0,0,0,0.28)] has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-saffron'
          : ''
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-[22px] bg-mist">
        <img
          // a third of the page wide: no need for the carousel's full-width photo
          src={cover.src.replace('w=1800', 'w=900')}
          alt={cover.caption}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-4 pb-3 md:px-4">
        <div>
          <StatusPill status={yatra.status} />
        </div>
        <h3 className="mt-3 type-title-m text-ink">
          {page ? (
            <SiteLink
              href={page}
              className="card-link inline-flex items-center gap-2 outline-none after:absolute after:inset-0 after:rounded-[28px]"
            >
              {yatra.title}
              <IconArrowRight className="h-5 w-5 shrink-0 -translate-x-1 text-ink-mute opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:text-saffron group-hover/card:opacity-100" />
            </SiteLink>
          ) : (
            yatra.title
          )}
        </h3>
        <p className="mt-1.5 mb-4 type-body-sm text-ink-soft">{yatra.tagline}</p>

        <div className="mt-auto flex items-center justify-between border-t border-line-soft px-1 pt-3 type-label-sm whitespace-nowrap text-ink tabular-nums">
          <span>{yatra.days} days</span>
          <span className="h-4 w-px bg-line-soft" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <DifficultyMeter level={yatra.difficulty} />
            {yatra.difficultyLabel}
          </span>
          <span className="h-4 w-px bg-line-soft" aria-hidden />
          <span>{yatra.seasonShort}</span>
        </div>
      </div>
    </article>
  )
}
