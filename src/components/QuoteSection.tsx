import { useRef, type ReactNode } from 'react'
import { motion, type MotionValue, useScroll, useTransform } from 'motion/react'

type Token = { text: string; kind?: 'strike' | 'beyond' }

const line1: Token[] = [
  { text: 'A' },
  { text: 'pilgrimage' },
  { text: 'is' },
  { text: 'not' },
  { text: 'an' },
  { text: 'achievement.', kind: 'strike' },
]
const line2: Token[] = [
  { text: 'It' },
  { text: 'is' },
  { text: 'an' },
  { text: 'opportunity' },
  { text: 'to' },
  { text: 'access' },
  { text: 'the' },
  { text: 'beyond.', kind: 'beyond' },
]

const total = line1.length + line2.length
const REVEAL_END = 0.62

/**
 * Words brighten as you read down the page.
 *  • "achievement" is struck through with a sindoor line: the quote refuses it.
 *  • "beyond" is gilded, and a line leaves it and runs off the edge of the page.
 */
export default function QuoteSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.55'] })

  const strike = useTransform(scrollYProgress, [0.3, 0.42], [0, 1])
  const beyondLine = useTransform(scrollYProgress, [REVEAL_END, 0.92], [0, 1])
  const attribution = useTransform(scrollYProgress, [0.7, 0.9], [0, 1])
  const glyphY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const attributionY = useTransform(attribution, [0, 1], [16, 0])

  let i = 0
  const renderLine = (tokens: Token[]) =>
    tokens.map((t) => {
      const idx = i++
      const start = (idx / total) * REVEAL_END
      const end = start + REVEAL_END / total + 0.04
      return (
        <Word key={idx} progress={scrollYProgress} range={[start, end]}>
          {t.kind === 'strike' ? (
            <span className="relative inline-block">
              achievement.
              <svg
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="pointer-events-none absolute left-[-3%] top-[46%] h-[0.28em] w-[104%] overflow-visible"
                aria-hidden
              >
                <motion.path
                  d="M2 12 C 60 6, 140 14, 200 8 C 240 5, 275 9, 298 7"
                  fill="none"
                  stroke="var(--color-sindoor)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: strike }}
                />
              </svg>
            </span>
          ) : t.kind === 'beyond' ? (
            <span className="relative inline-block">
              <em className="gilded pr-[0.08em] font-normal">beyond</em>
              <span className="text-gold">.</span>
              <motion.span
                aria-hidden
                className="absolute left-[calc(100%+0.3em)] top-[58%] h-px w-[60vw] origin-left bg-gradient-to-r from-gold via-gold/60 to-transparent"
                style={{ scaleX: beyondLine }}
              />
              <motion.span
                aria-hidden
                className="absolute left-[calc(100%+0.3em)] top-[58%] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sindoor"
                style={{ opacity: beyondLine }}
              />
            </span>
          ) : (
            t.text
          )}
        </Word>
      )
    })

  return (
    <section ref={ref} className="relative overflow-x-clip bg-paper px-5 py-[22vh] md:px-10">
      <div className="relative mx-auto max-w-6xl">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -left-2 -top-24 select-none font-display text-[16rem] leading-none text-gold/15 md:-left-16"
          style={{ y: glyphY }}
        >
          &ldquo;
        </motion.span>

        <p className="eyebrow mb-12 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-sindoor" />
          On pilgrimage
        </p>

        <blockquote className="font-display text-[clamp(2.1rem,5.2vw,5rem)] font-light leading-[1.12] tracking-[-0.015em] text-ink">
          <span className="block">{renderLine(line1)}</span>
          <span className="block md:pl-[12%]">{renderLine(line2)}</span>
        </blockquote>

        <motion.footer
          className="mt-16 flex items-center gap-5 md:pl-[12%]"
          style={{ opacity: attribution, y: attributionY }}
        >
          <span className="h-px w-14 bg-ink/30" />
          <span className="font-display text-2xl italic text-ink-2">Sadhguru</span>
        </motion.footer>
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.13, 1])
  const blur = useTransform(progress, range, ['blur(6px)', 'blur(0px)'])
  return (
    <>
      <motion.span className="inline-block" style={{ opacity, filter: blur }}>
        {children}
      </motion.span>{' '}
    </>
  )
}
