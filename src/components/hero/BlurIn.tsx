import { motion } from 'motion/react'
import { blur } from '../../lib/lite'

/** Seconds between letters: small enough that several letters are mid-focus at once. */
export const CHAR_STAGGER = 0.022
const DURATION = 0.9
const ease = [0.25, 0.1, 0.25, 1] as const

/**
 * Progressive blur: letters come into focus one after another, so at any
 * instant the phrase runs sharp → blurred along a moving front.
 * Words stay unbreakable (nowrap); each letter animates independently.
 */
export function BlurText({
  text,
  delay = 0,
  className,
  onDone,
  inView = false,
}: {
  text: string
  delay?: number
  className?: string
  /** play when scrolled into view instead of on mount */
  inView?: boolean
  /** fires when the last letter is fully in focus */
  onDone?: () => void
}) {
  const words = text.split(' ')
  // letter offset where each word starts (+1 per space)
  const starts = words.map((_, i) => words.slice(0, i).reduce((sum, w) => sum + w.length + 1, 0))
  const shown = { opacity: 1, ...blur(0) }
  const play = inView ? { whileInView: shown, viewport: { once: true, margin: '-15% 0px' } } : { animate: shown }

  return (
    <span className={className} role="text" aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden>
          <span className="inline-block whitespace-nowrap">
            {[...w].map((ch, ci) => (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ opacity: 0, ...blur(12) }}
                {...play}
                transition={{ duration: DURATION, ease, delay: delay + (starts[wi] + ci) * CHAR_STAGGER }}
                onAnimationComplete={wi === words.length - 1 && ci === w.length - 1 ? onDone : undefined}
              >
                {ch}
              </motion.span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}

/** Delay at which the next phrase should start so the focus front runs on continuously. */
export const after = (delay: number, text: string) => delay + (text.length + 1) * CHAR_STAGGER
