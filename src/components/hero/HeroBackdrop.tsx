import { motion, type MotionValue, useTransform } from 'motion/react'

/**
 * Line illustration behind the hero: a rising sun mandala and layered
 * Himalayan ridgelines with Kailash at the centre, and a pilgrim's trail
 * that draws itself into the mountains. Drawn at very low contrast.
 */
export default function HeroBackdrop({ progress }: { progress: MotionValue<number> }) {
  const sunY = useTransform(progress, [0, 0.5], ['0%', '-18%'])
  const farY = useTransform(progress, [0, 0.5], ['0%', '-6%'])
  const nearY = useTransform(progress, [0, 0.5], ['0%', '4%'])
  const fade = useTransform(progress, [0.05, 0.45], [1, 0])

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: fade }} aria-hidden>
      {/* soft light behind the headline */}
      <div className="absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,184,119,0.28)_0%,rgba(216,184,119,0.08)_45%,transparent_70%)]" />

      {/* sun mandala */}
      <motion.svg
        viewBox="-300 -300 600 600"
        className="absolute left-1/2 top-[42%] h-[118vmin] w-[118vmin] -translate-x-1/2 -translate-y-1/2 text-gold"
        style={{ y: sunY }}
      >
        <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
          <circle r="120" strokeWidth="0.8" opacity="0.28" />
          <circle r="170" strokeWidth="0.6" opacity="0.2" strokeDasharray="1 5" />
          <circle r="232" strokeWidth="0.6" opacity="0.14" />
          <circle r="290" strokeWidth="0.5" opacity="0.1" strokeDasharray="2 9" />
        </g>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
          stroke="currentColor"
          opacity="0.16"
        >
          {Array.from({ length: 72 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={i % 2 ? -182 : -176}
              x2="0"
              y2={i % 2 ? -196 : -222}
              strokeWidth="0.7"
              transform={`rotate(${i * 5})`}
            />
          ))}
        </motion.g>
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 360, repeat: Infinity, ease: 'linear' }}
          fill="none"
          stroke="currentColor"
          opacity="0.14"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={i} d="M0 -240 C 14 -262, 14 -276, 0 -288 C -14 -276, -14 -262, 0 -240 Z" strokeWidth="0.7" transform={`rotate(${i * 22.5})`} />
          ))}
        </motion.g>
      </motion.svg>

      {/* mountains */}
      <div className="absolute inset-x-0 bottom-0 h-[46vh] min-h-[260px]">
        <motion.svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" style={{ y: farY }}>
          {/* far range */}
          <path
            d="M0 290 L90 262 L170 276 L260 226 L330 246 L420 188 L500 214 L580 160 L640 180 C 680 150, 700 108, 720 84 C 728 76, 736 74, 744 80 C 766 104, 790 146, 820 176 L880 150 L950 196 L1030 158 L1110 206 L1200 176 L1290 226 L1370 204 L1440 236"
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity="0.18"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* kailash snow striations */}
          <g stroke="var(--color-gold)" strokeOpacity="0.45" fill="none" strokeWidth="0.9" vectorEffect="non-scaling-stroke">
            <path d="M708 104 C 718 112, 746 112, 756 104" />
            <path d="M700 120 C 716 130, 750 130, 766 120" />
            <path d="M692 136 C 712 148, 756 148, 776 136" />
            <path d="M730 84 L 724 150" />
            <path d="M742 86 L 752 152" />
          </g>
          {/* mid range, filled with paper to occlude */}
          <path
            d="M0 330 L110 300 L200 318 L300 270 L380 296 L470 250 L560 286 L640 262 L700 290 L790 246 L870 282 L960 240 L1040 274 L1130 236 L1220 280 L1320 256 L1440 292 L1440 420 L0 420 Z"
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeOpacity="0.14"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>

        <motion.svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" style={{ y: nearY }}>
          <path
            d="M0 372 C 180 340, 300 360, 440 336 C 580 312, 660 350, 800 338 C 960 324, 1080 352, 1220 330 C 1320 316, 1400 330, 1440 336 L1440 420 L0 420 Z"
            fill="var(--color-paper-2)"
            stroke="var(--color-ink)"
            strokeOpacity="0.1"
            vectorEffect="non-scaling-stroke"
          />
          {/* pilgrim trail */}
          <motion.path
            d="M140 420 C 260 396, 380 404, 470 380 C 560 356, 600 336, 660 320 C 700 308, 716 290, 730 268"
            fill="none"
            stroke="var(--color-sindoor)"
            strokeOpacity="0.55"
            strokeWidth="1.2"
            strokeDasharray="2 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 3.2, ease: [0.65, 0, 0.35, 1] }}
          />
          {/* flags along the trail */}
          {[
            [470, 380],
            [600, 334],
          ].map(([x, y], i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.6, duration: 0.8 }}
            >
              <line x1={x} y1={y} x2={x} y2={y - 22} stroke="var(--color-ink)" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
              <path d={`M${x} ${y - 22} l12 4 l-12 4 z`} fill="var(--color-sindoor)" fillOpacity="0.6" />
            </motion.g>
          ))}
        </motion.svg>
      </div>
    </motion.div>
  )
}
