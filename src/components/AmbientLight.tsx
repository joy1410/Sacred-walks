import { motion } from 'motion/react'

/*
 * Ambient "temple light" behind the white sections: a few large, soft washes of
 * marigold and turmeric drifting like haze, and a few hazy motes rising like
 * dust in a shaft of sunlight. Pure CSS (gradients + transforms), fixed to the
 * viewport, so it costs no layout and no JS per frame. Opaque sections (mist,
 * night) simply cover it.
 */

// deterministic pseudo-random so motes stay put across renders
const rand = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

// a sparse scatter of small motes: mostly evenly hazy, every third a crisper spark
const MOTE_COUNT = 12
const MOTES = Array.from({ length: MOTE_COUNT }, (_, i) => ({
  spark: i % 3 === 1,
  left: `${(i / MOTE_COUNT) * 100 + rand(i) * 6}%`,
  size: i % 3 === 1 ? 5 + rand(i + 100) * 7 : 7 + rand(i + 100) * 6,
  alpha: i % 3 === 1 ? 0.55 + rand(i + 200) * 0.3 : 0.35 + rand(i + 200) * 0.2,
  sway: 16 + rand(i + 250) * 30,
  dur: 26 + rand(i + 350) * 14,
  delay: -rand(i + 400) * 40,
}))

export default function AmbientLight() {
  return (
    <motion.div
      aria-hidden
      className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      // starts mild, then slowly warms up over the first ~40s
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0.9] }}
      transition={{ duration: 40, times: [0, 0.07, 1], ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="ambient-cloud ambient-cloud--a" />
      <span className="ambient-cloud ambient-cloud--b" />
      <span className="ambient-cloud ambient-cloud--c" />
      <span className="ambient-cloud ambient-cloud--d" />
      {MOTES.map((m, i) => (
        <span
          key={i}
          className={m.spark ? 'ambient-mote ambient-mote--spark' : 'ambient-mote'}
          style={
            {
              left: m.left,
              width: m.size,
              height: m.size,
              '--a': m.alpha,
              '--sway': `${m.sway}px`,
              animationDuration: `${m.dur}s, ${m.dur / 4}s`,
              animationDelay: `${m.delay}s, ${m.delay / 3}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  )
}
