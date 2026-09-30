import { motion } from 'motion/react'

/**
 * "divine": gilded italic with a hand-drawn halo that draws itself in,
 * a bindu below the baseline and a twinkling sparkle, like a word that
 * has been anointed on the page.
 */
export default function DivineWord({ delay = 0.9 }: { delay?: number }) {
  return (
    <span className="relative inline-block px-[0.06em]">
      <span className="gilded relative z-10 font-display font-normal italic">divine</span>

      {/* halo */}
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[18%] h-[136%] w-[128%] overflow-visible"
        aria-hidden
      >
        <motion.path
          d="M22 50 C 12 26, 66 9, 116 10 C 168 11, 197 28, 189 49 C 181 69, 122 76, 78 72 C 38 68, 6 57, 26 33 C 34 24, 50 18, 64 15"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.75 }}
          transition={{ pathLength: { delay, duration: 2.2, ease: [0.65, 0, 0.35, 1] }, opacity: { delay, duration: 0.4 } }}
        />
      </svg>

      {/* sparkle */}
      <motion.svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -right-[0.18em] -top-[0.12em] h-[0.3em] w-[0.3em] text-gold"
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: [0, 1.15, 1], rotate: 0, opacity: 1 }}
        transition={{ delay: delay + 1.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <motion.path
          d="M12 0 C 12.8 8, 16 11.2, 24 12 C 16 12.8, 12.8 16, 12 24 C 11.2 16, 8 12.8, 0 12 C 8 11.2, 11.2 8, 12 0 Z"
          fill="currentColor"
          animate={{ opacity: [1, 0.45, 1], scale: [1, 0.82, 1] }}
          transition={{ delay: delay + 2.6, duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '12px 12px' }}
        />
      </motion.svg>

      {/* bindu */}
      <motion.span
        className="absolute -bottom-[0.06em] left-1/2 h-[0.09em] w-[0.09em] -translate-x-1/2 rounded-full bg-sindoor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 2, type: 'spring', stiffness: 260, damping: 14 }}
        aria-hidden
      />
    </span>
  )
}
