import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { BlurText } from '../hero/BlurIn'

export const ease = [0.16, 1, 0.3, 1] as const
export const inView = { once: true, margin: '-15% 0px' } as const
/** fixed nav (48) + the sticky section bar (52) */
export const STICKY_OFFSET = 48 + 52

/**
 * Section heading for the yatra page: a small label naming the
 * section plainly (it matches the bar above), then the display line,
 * which comes into focus letter by letter like every heading on the site.
 */
export function SectionHeading({
  label,
  title,
  lede,
  id,
  dark = false,
  className = '',
}: {
  label: string
  title: string
  lede?: ReactNode
  id: string
  dark?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <motion.p
        className={`text-[13px] font-semibold md:text-[14px] ${dark ? 'text-white/60' : 'text-ink-mute'}`}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.8, ease }}
      >
        {label}
      </motion.p>
      <h2
        id={id}
        className={`mt-3 font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-[1.04] font-semibold text-balance ${dark ? 'text-white' : 'text-ink'}`}
      >
        <BlurText text={title} inView />
      </h2>
      {lede && (
        <motion.p
          className={`mt-5 max-w-[560px] text-[17px] leading-[1.45] md:text-[19px] ${dark ? 'text-white/70' : 'text-ink-soft'}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.9, ease, delay: 0.35 }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  )
}

/** rise-and-settle for a block as it enters */
export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}
