import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform, type MotionValue, type PanInfo, type Variants } from 'motion/react'
import { stories, type Story } from '../data/journey'
import { BlurText } from './hero/BlurIn'
import { blur } from '../lib/lite'
import { IconChevronLeft, IconChevronRight, IconPause, IconPlay } from './icons'

const DURATION = 7 // seconds per story
const ease = [0.16, 1, 0.3, 1] as const
// the carousel's spring: settles fast, no bounce
const slide = { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 } as const
// the throw out to the side: a looser spring, so it's still travelling when it turns
const toss = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const
// how far into the throw the card swaps layer and starts its way back
const TURN = 0.7

// the focus-pull the hero and journey panels use, per line
const panel: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 14, ...blur(8), transition: { duration: 0.25 } },
  show: { opacity: 1, y: 0, ...blur(0), transition: { duration: 0.9, ease } },
}

/** a card's place: resting in the pile at some depth, or thrown out to one side */
type Pose = { kind: 'rest'; depth: number } | { kind: 'out'; dir: 1 | -1 }
type Move = { id: number; dir: 1 | -1; kind: 'next' | 'prev' }

const TILT = [0, -2.2, 2.6, -1.4]

/**
 * Participant voices as a deck of cards, one story at a time.
 *
 * "Tuck and rise": the front card is thrown aside and slipped under the pile
 * while the next one rises to the front and pulls its words into focus.
 * Previous runs it in reverse, drawing the bottom card out and laying it on top.
 * Swipe the card on touch, arrows on desktop, and it walks itself on a timer.
 */
export default function StoriesSection() {
  const n = stories.length
  const [order, setOrder] = useState(() => stories.map((_, i) => i))
  const [move, setMove] = useState<Move | null>(null)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)

  const deckRef = useRef<HTMLDivElement>(null)
  const inView = useInView(deckRef, { amount: 0.4 })
  const revealed = useInView(deckRef, { once: true, amount: 0.3 })

  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = deckRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  // latest state for callbacks fired from timers and animations
  const state = useRef({ order, move })
  state.current = { order, move }

  const next = useCallback((dir: 1 | -1 = -1) => {
    const { order, move } = state.current
    if (move) return
    setMove({ id: order[0], dir, kind: 'next' })
  }, [])
  const prev = useCallback(() => {
    const { order, move } = state.current
    if (move) return
    setMove({ id: order[order.length - 1], dir: -1, kind: 'prev' })
  }, [])

  // the throw has landed: the card changes layer while it's off to the side
  const onOut = useCallback(() => {
    const { move } = state.current
    if (!move) return
    setOrder((o) => (move.kind === 'next' ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]))
    setMove(null)
  }, [])

  const shown = move?.kind === 'next' ? order[1] : move?.kind === 'prev' ? move.id : order[0]

  const goTo = (i: number) => {
    if (i === shown || move) return
    if (i === order[1]) next()
    else if (i === order[n - 1]) prev()
    else setOrder((o) => [...o.slice(o.indexOf(i)), ...o.slice(0, o.indexOf(i))])
  }

  const poseOf = (id: number): Pose => {
    if (move?.id === id) return { kind: 'out', dir: move.dir }
    // on next, everyone behind the thrown card moves up a place straight away
    const pile = move?.kind === 'next' ? order.filter((i) => i !== move.id) : order
    return { kind: 'rest', depth: pile.indexOf(id) }
  }
  const layerOf = (id: number, pose: Pose) => {
    // thrown forward card stays on top until it lands; a drawn back card stays under
    if (move?.id === id) return move.kind === 'next' ? n + 1 : 0
    return n - (pose.kind === 'rest' ? pose.depth : 0)
  }

  // timer as a motion value, so pausing freezes the fill where it is
  const fill = useMotionValue(0)
  const fillWidth = useTransform(fill, (v) => `${v * 100}%`)
  const running = playing && !hovered && !dragging && inView && !move
  useEffect(() => fill.set(0), [shown, fill])
  useEffect(() => {
    if (!running) return
    const controls = animate(fill, 1, {
      duration: (1 - fill.get()) * DURATION,
      ease: 'linear',
      onComplete: () => next(),
    })
    return () => controls.stop()
  }, [shown, running, next, fill])

  const controls = (
    <Controls
      shown={shown}
      playing={playing}
      fillWidth={fillWidth}
      onPick={goTo}
      onToggle={() => setPlaying((p) => !p)}
    />
  )

  return (
    <section
      id="stories"
      data-opaque
      aria-labelledby="stories-title"
      className="overflow-x-clip bg-mist px-4 py-20 md:px-5 md:py-24 lg:flex lg:h-svh lg:min-h-[700px] lg:flex-col lg:pt-[88px] lg:pb-8"
    >
      {/* the deck stops at 640px tall (as the yatra card does); past that the heading and deck centre together */}
      <div className="mx-auto flex w-full max-w-[1180px] flex-col lg:min-h-0 lg:flex-1 lg:justify-center">
        <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
          <h2 id="stories-title" className="font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-[0.98] font-semibold text-ink">
            <BlurText text="Stories from the journey" inView />
          </h2>
          <div className="hidden shrink-0 items-center gap-3 pb-1 md:flex">
            {controls}
            <RoundButton label="Previous story" onClick={prev}>
              <IconChevronLeft className="h-4 w-4" />
            </RoundButton>
            <RoundButton label="Next story" onClick={() => next()}>
              <IconChevronRight className="h-4 w-4" />
            </RoundButton>
          </div>
        </div>

        {/* the pile: every card in one grid cell, so it sizes to the tallest */}
        <motion.div
          ref={deckRef}
          className="relative grid grid-rows-[minmax(0,1fr)] pr-7 md:pr-12 lg:max-h-[640px] lg:min-h-0 lg:flex-1"
          role="region"
          aria-roledescription="carousel"
          aria-label="Participant stories"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          initial={{ opacity: 0, y: 28 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease }}
        >
          {stories.map((s, id) => {
            const pose = poseOf(id)
            const top = pose.kind === 'rest' && pose.depth === 0
            return (
              <DeckCard
                key={s.name}
                story={s}
                pose={pose}
                layer={layerOf(id, pose)}
                width={width}
                live={top && revealed}
                canDrag={top && !move}
                onOut={onOut}
                onSwipe={next}
                onDragging={setDragging}
              />
            )
          })}
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-3 md:hidden">{controls}</div>
      </div>
    </section>
  )
}

function DeckCard({
  story,
  pose,
  layer,
  width,
  live,
  canDrag,
  onOut,
  onSwipe,
  onDragging,
}: {
  story: Story
  pose: Pose
  layer: number
  width: number
  live: boolean
  canDrag: boolean
  onOut: () => void
  onSwipe: (dir: 1 | -1) => void
  onDragging: (d: boolean) => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const veil = useMotionValue(0)

  const onOutRef = useRef(onOut)
  onOutRef.current = onOut

  const dir = pose.kind === 'out' ? pose.dir : 0
  const depth = pose.kind === 'rest' ? pose.depth : -1
  useEffect(() => {
    // the pile fans out to the right: each card behind sits a step further right
    const peek = width < 768 ? 12 : 20
    const out = pose.kind === 'out'
    const t = out ? toss : slide
    const target = out
      ? { x: dir * width * 0.66, y: 0, scale: 0.94, rotate: dir * 9, veil: 0 }
      : { x: depth * peek, y: 0, scale: 1 - depth * 0.05, rotate: TILT[depth] ?? 0, veil: Math.min(depth * 0.32, 0.64) }
    // the turn happens mid-flight: the card swaps layer while still moving out, and the
    // return spring inherits its velocity, so the throw and the tuck read as one arc
    let turned = false
    const turn = () => {
      if (turned) return
      turned = true
      onOutRef.current()
    }
    const watch = out
      ? x.on('change', (v) => {
          if (Math.abs(v) >= Math.abs(target.x) * TURN) turn()
        })
      : undefined
    if (out && Math.abs(x.get()) >= Math.abs(target.x) * TURN) queueMicrotask(turn)
    const runs = [
      animate(x, target.x, { ...t, onComplete: out ? turn : undefined }),
      animate(y, target.y, t),
      animate(scale, target.scale, t),
      animate(rotate, target.rotate, t),
      animate(veil, target.veil, { duration: 0.5, ease }),
    ]
    return () => {
      watch?.()
      runs.forEach((r) => r.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose.kind, dir, depth, width])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    onDragging(false)
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (Math.abs(swipe) > width * 0.2) onSwipe(swipe > 0 ? 1 : -1)
    else {
      animate(x, 0, { ...slide, velocity: info.velocity.x })
      animate(rotate, 0, slide)
    }
  }

  return (
    <motion.div
      className={`[grid-area:1/1] min-h-0 ${canDrag ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''}`}
      style={{ x, y, scale, rotate, zIndex: layer, transformOrigin: '100% 50%' }}
      drag={canDrag ? 'x' : false}
      dragMomentum={false}
      onDragStart={() => onDragging(true)}
      onDrag={() => rotate.set(x.get() / 32)}
      onDragEnd={onDragEnd}
      aria-hidden={!live}
    >
      <figure className="relative flex h-full flex-col gap-2 rounded-[32px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] lg:grid lg:grid-cols-[1.35fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-mist-2 lg:aspect-auto lg:h-full">
          {story.image && (
            <img
              src={story.image.src}
              alt={story.image.caption}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover select-none"
            />
          )}
        </div>

        <motion.div
          variants={panel}
          initial="hidden"
          animate={live ? 'show' : 'hidden'}
          className="flex flex-1 flex-col px-4 pt-4 pb-5 select-none md:px-6 lg:justify-center lg:px-10 lg:py-10"
        >
          <motion.div variants={item}>
            <QuoteMark className="mb-5 h-6 w-8 text-saffron-2 md:h-7 md:w-9" />
          </motion.div>
          <motion.blockquote
            variants={item}
            className="font-display text-[clamp(1.45rem,min(2.3vw,3.6svh),2.15rem)] leading-[1.12] font-medium text-ink"
          >
            {story.text}
          </motion.blockquote>
          <motion.div variants={item}>
            <Attribution story={story} />
          </motion.div>
        </motion.div>

        {/* cards further down the pile recede into the page */}
        <motion.span className="pointer-events-none absolute inset-0 rounded-[32px] bg-mist" style={{ opacity: veil }} aria-hidden />
      </figure>
    </motion.div>
  )
}

/** Apple's capsule from the yatra carousel: the active dot stretches into a timer */
function Controls({
  shown,
  playing,
  fillWidth,
  onPick,
  onToggle,
}: {
  shown: number
  playing: boolean
  fillWidth: MotionValue<string>
  onPick: (i: number) => void
  onToggle: () => void
}) {
  return (
    <>
      <div className="flex h-11 items-center gap-2 rounded-full bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_3px_10px_rgba(0,0,0,0.06)]" role="tablist" aria-label="Choose story">
        {stories.map((s, i) => {
          const active = i === shown
          return (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Story ${i + 1}: ${s.name}`}
              onClick={() => onPick(i)}
              className="flex h-6 items-center"
            >
              <motion.span
                className="relative block h-[7px] overflow-hidden rounded-full bg-line hover:bg-ink-mute"
                animate={{ width: active ? 36 : 7 }}
                transition={{ duration: 0.5, ease }}
              >
                {active && <motion.span className="absolute inset-y-0 left-0 rounded-full bg-saffron" style={{ width: fillWidth }} />}
              </motion.span>
            </button>
          )
        })}
      </div>
      <RoundButton label={playing ? 'Pause stories' : 'Play stories'} onClick={onToggle}>
        {playing ? <IconPause className="h-3.5 w-3.5" /> : <IconPlay className="h-3.5 w-3.5" />}
      </RoundButton>
    </>
  )
}

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06),0_3px_10px_rgba(0,0,0,0.06)] transition-[transform,background-color] duration-300 hover:scale-105"
    >
      {children}
    </motion.button>
  )
}

function Attribution({ story }: { story: Story }) {
  return (
    <figcaption className="mt-6 flex items-center gap-3 text-[14px]">
      <span className="h-px w-6 bg-saffron" aria-hidden />
      <span className="font-semibold text-ink">{story.name}</span>
      <span className="text-ink-mute">{story.yatra}</span>
    </figcaption>
  )
}

function QuoteMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={`block ${className}`} aria-hidden>
      <path
        fill="currentColor"
        d="M0 40V23.6C0 10.4 6.6 2.4 19.2 0l2 4.6C14.4 7 11 11.6 10.6 18.4H20V40H0Zm28 0V23.6C28 10.4 34.6 2.4 47.2 0l2 4.6C42.4 7 39 11.6 38.6 18.4H48V40H28Z"
      />
    </svg>
  )
}
