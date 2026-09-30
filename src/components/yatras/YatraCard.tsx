import { motion, type Variants } from 'motion/react'
import type { Yatra } from '../../data/yatras'
import ImageCarousel from './ImageCarousel'
import DifficultyMeter from './DifficultyMeter'
import { IconArrowRight, IconCalendar, IconClock, IconPeak, IconUsers } from '../icons'

const ease = [0.22, 1, 0.36, 1] as const

const panel: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export default function YatraCard({ yatra }: { yatra: Yatra }) {
  const facts = [
    { icon: IconClock, label: 'Duration', value: `${yatra.days} days` },
    { icon: IconCalendar, label: 'Season', value: yatra.season },
    yatra.maxAltitude
      ? { icon: IconPeak, label: 'Max altitude', value: yatra.maxAltitude }
      : { icon: IconUsers, label: 'Group', value: yatra.groupSize },
  ]

  return (
    <article className="grid overflow-hidden rounded-[28px] border border-line bg-[#fbf8f2] shadow-[0_40px_80px_-50px_rgba(29,24,19,0.45)] lg:h-[600px] lg:grid-cols-[1.5fr_1fr]">
      <ImageCarousel yatra={yatra} />

      <motion.div
        className="flex flex-col p-7 md:p-9"
        variants={panel}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="flex items-center justify-between gap-3">
          <span className="eyebrow">{yatra.region}</span>
          <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[11px] font-medium text-ink-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-sindoor/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-sindoor" />
            </span>
            Next departure · {yatra.nextDeparture}
          </span>
        </motion.div>

        <motion.h3
          variants={item}
          className="mt-5 font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1] font-medium tracking-[-0.01em] text-ink"
        >
          {yatra.title}
        </motion.h3>
        <motion.p variants={item} className="mt-2 font-display text-xl italic text-ink-soft">
          {yatra.tagline}
        </motion.p>

        <motion.p variants={item} className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">
          {yatra.summary}
        </motion.p>

        {/* key facts */}
        <motion.dl variants={item} className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line-soft bg-line-soft">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#fbf8f2] p-4">
              <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase text-ink-mute">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </dt>
              <dd className="mt-1.5 text-[14px] font-semibold text-ink">{value}</dd>
            </div>
          ))}
          <div className="bg-[#fbf8f2] p-4">
            <dt className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-ink-mute">Difficulty</dt>
            <dd className="mt-1.5 flex items-center gap-2.5 text-[14px] font-semibold text-ink">
              <DifficultyMeter level={yatra.difficulty} />
              {yatra.difficultyLabel}
            </dd>
          </div>
        </motion.dl>

        {/* highlights */}
        <motion.ul variants={item} className="mt-6 space-y-2.5">
          {yatra.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-[13.5px] text-ink-2">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-gold" />
              {h}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="mt-auto flex flex-wrap gap-3 pt-8">
          <a
            href="#"
            className="flex-1 rounded-full border border-ink/20 px-6 py-3.5 text-center text-[13.5px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink/[0.03]"
          >
            Enquire now
          </a>
          <a
            href="#yatras"
            className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink-2"
          >
            Explore yatra
            <IconArrowRight className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-sacred)] group-hover:translate-x-1" />
          </a>
        </motion.div>
      </motion.div>
    </article>
  )
}
