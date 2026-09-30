import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { yatras } from '../../data/yatras'
import YatraCard from './YatraCard'

const ease = [0.22, 1, 0.36, 1] as const

export default function YatraSection() {
  const [[active, dir], setActive] = useState<[number, number]>([0, 0])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (i: number) => setActive(([cur]) => [i, i > cur ? 1 : -1])

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + yatras.length) % yatras.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  const y = yatras[active]

  return (
    <section id="yatras" className="relative scroll-mt-24 bg-paper px-5 pb-40 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* heading */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, ease }}
          >
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-sindoor" />
              Yatras
            </p>
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1] font-medium tracking-[-0.015em]">
              Choose your <em className="font-normal text-gold">path</em>
            </h2>
          </motion.div>
          <motion.p
            className="max-w-sm text-[14.5px] leading-relaxed text-ink-soft"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, ease, delay: 0.1 }}
          >
            Each yatra is held with sadhana, care and the guidance of Isha volunteers who have walked the path
            before you.
          </motion.p>
        </div>

        {/* tabs */}
        <div
          role="tablist"
          aria-label="Yatra destinations"
          onKeyDown={onKey}
          className="relative mb-8 flex overflow-x-auto border-b border-line [scrollbar-width:none]"
        >
          {yatras.map((t, i) => {
            const isActive = i === active
            return (
              <button
                key={t.slug}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`tab-${t.slug}`}
                aria-selected={isActive}
                aria-controls={`panel-${t.slug}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                className="group relative isolate flex min-w-[9.5rem] flex-1 items-baseline justify-center gap-2 px-4 pt-3 pb-4 outline-none md:justify-start"
              >
                <span
                  className={`font-display text-sm tabular-nums transition-colors duration-500 ${
                    isActive ? 'text-gold' : 'text-ink-mute'
                  }`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`text-[15px] font-medium whitespace-nowrap transition-colors duration-500 ${
                    isActive ? 'text-ink' : 'text-ink-soft group-hover:text-ink'
                  }`}
                >
                  {t.tab}
                </span>
                <span className="ml-auto hidden text-[11px] text-ink-mute md:inline">{t.days}d</span>

                {isActive && (
                  <motion.span
                    layoutId="yatra-tab-indicator"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-ink"
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  >
                    <span className="absolute -top-[3px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink md:left-4" />
                  </motion.span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="yatra-tab-glow"
                    className="absolute inset-0 -z-10 rounded-t-2xl bg-gradient-to-t from-gold/10 to-transparent"
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={y.slug}
              id={`panel-${y.slug}`}
              role="tabpanel"
              aria-labelledby={`tab-${y.slug}`}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 48, filter: 'blur(6px)' }),
                center: { opacity: 1, x: 0, filter: 'blur(0px)' },
                exit: (d: number) => ({ opacity: 0, x: d * -48, filter: 'blur(6px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease }}
            >
              <YatraCard yatra={y} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
