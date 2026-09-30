import { useMemo } from 'react'
import { motion, type MotionValue } from 'motion/react'
import { useScrollRange } from '../../lib/useScrollRange'

const CX = 800
const CY = 420

/** A closed, organic ring: terrain-like wobble that drifts from ring to ring. */
function ring(r: number, k: number, steps = 120) {
  let d = ''
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * Math.PI * 2
    const w =
      1 +
      0.085 * Math.sin(3 * t + k * 0.35) +
      0.05 * Math.sin(5 * t - k * 0.22 + 1.3) +
      0.035 * Math.sin(2 * t + k * 0.5 + 0.4)
    const x = CX + Math.cos(t) * r * w * 1.45
    const y = CY + Math.sin(t) * r * w * 0.82
    d += `${s ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }
  return d + 'Z'
}

/**
 * Topographic map of the sacred mountain, drawn in hairlines.
 * A saffron route circles the summit: the parikrama. It stays calm and
 * map-like (Apple Maps / Airbnb), so it reads as place without ornament.
 */
export default function HeroBackdrop({ progress }: { progress: MotionValue<number> }) {
  const contours = useMemo(() => Array.from({ length: 16 }, (_, k) => ring(38 + k * 34, k)), [])
  const route = useMemo(() => ring(38 + 5 * 34, 5), [])

  const scale = useScrollRange(progress, [0, 0.5], [1, 1.18])
  const opacity = useScrollRange(progress, [0.04, 0.4], [1, 0])

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }} aria-hidden>
      <motion.svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_70%_60%_at_50%_42%,black_30%,transparent_78%)]"
        style={{ scale }}
      >
        {contours.map((d, k) => (
          <motion.path
            key={k}
            d={d}
            fill="none"
            stroke="#1d1d1f"
            strokeOpacity={k % 4 === 0 ? 0.11 : 0.055}
            strokeWidth={k % 4 === 0 ? 1.1 : 0.8}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, delay: 0.1 + k * 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* parikrama route, the dashes walk slowly clockwise */}
        <motion.path
          d={route}
          fill="none"
          stroke="var(--color-saffron)"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 9"
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, strokeDashoffset: [0, -200] }}
          transition={{
            opacity: { delay: 1.4, duration: 1.2 },
            strokeDashoffset: { duration: 14, repeat: Infinity, ease: 'linear' },
          }}
        />
      </motion.svg>

    </motion.div>
  )
}
