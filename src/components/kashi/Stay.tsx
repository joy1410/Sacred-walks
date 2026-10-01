import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { stay, type Convenience } from '../../data/kashi'
import { IconBoat, IconBus, IconDoctor, IconHotel, IconMeal, IconTeam } from '../icons'
import { useScrollRange } from '../../lib/useScrollRange'
import { ease, inView, SectionHeading } from './shared'

const icons: Record<Convenience['icon'], typeof IconHotel> = {
  hotel: IconHotel,
  meal: IconMeal,
  bus: IconBus,
  boat: IconBoat,
  doctor: IconDoctor,
  team: IconTeam,
}

/** the photo holds still in its frame while the page moves past it, so it reads as a window */
export default function Stay() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useScrollRange(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="stay" data-opaque aria-labelledby="stay-title" className="bg-mist px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <motion.div
          ref={ref}
          className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-night sm:aspect-[4/3] lg:aspect-[4/5] lg:max-h-[640px] lg:w-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 1.1, ease }}
        >
          <motion.img
            src="/images/kashi/balcony.webp"
            alt="A haveli balcony over the Ganga"
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
            style={{ y }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-black/0 p-6 pt-20 text-white md:p-8 md:pt-24">
            <p className="max-w-[380px] text-[15px] leading-[1.5] text-white/85">
              Isha offers this programme not as a tour but as a possibility for profound spiritual transformation.
            </p>
          </div>
        </motion.div>

        <div>
          <SectionHeading
            label="Stay"
            id="stay-title"
            title="Rest well, walk lightly"
            lede="Everything practical is taken care of, so your attention can stay with the places themselves."
          />
          <ul className="mt-9 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {stay.map((c, i) => {
              const Icon = icons[c.icon]
              return (
                <motion.li
                  key={c.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 1, ease, delay: 0.1 + i * 0.05 }}
                >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[16px] font-semibold text-ink">{c.title}</span>
                      <span className="mt-0.5 block text-[14.5px] leading-[1.45] text-ink-soft">{c.body}</span>
                    </span>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
