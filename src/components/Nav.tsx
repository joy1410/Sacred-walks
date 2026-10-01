import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { yatras } from '../data/yatras'
import { IconChevronDown } from './icons'

const pill =
  'rounded-full px-3 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:bg-black/[0.06] hover:text-ink'

/** Yatras link with a hover / focus menu listing every yatra. */
function YatrasMenu() {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  // short grace period so the pointer can travel from the link to the panel
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <li
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <a
        href="#yatras"
        aria-haspopup="true"
        aria-expanded={open}
        className={`${pill} flex items-center gap-1 ${open ? 'bg-black/[0.06] text-ink' : ''}`}
      >
        Yatras
        <IconChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5"
          >
            <ul className="w-[300px] rounded-2xl border border-black/[0.06] bg-white/95 p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              {yatras.map((y) => (
                <li key={y.slug}>
                  <a
                    href="#yatras"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-mist focus-visible:bg-mist"
                  >
                    <img
                      src={y.images[0]?.src.replace(/w=\d+/, 'w=160')}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-ink">{y.title}</span>
                      <span className="block truncate text-[11.5px] text-ink-soft">
                        {y.region} · {y.days} days
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

const ease = [0.65, 0, 0.35, 1] as const

/** Full-screen saffron sheet for phones: blooms out of the burger, links rise in. */
function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock the page only once the sheet has fully bloomed, and release it once it has
  // fully closed (unmount). Locking flips the page's overflow, which relayouts the
  // whole document (and on phones can toggle the address bar); doing that at the
  // first frame stalled the bloom midway.
  const lenis = useLenis()
  const [bloomed, setBloomed] = useState(false)
  useEffect(() => {
    if (!bloomed) return
    lenis?.stop()
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
      lenis?.start()
    }
  }, [bloomed, lenis])

  // bloom out of the burger (top-right) far enough to cover the farthest corner
  const [reach] = useState(() => Math.hypot(window.innerWidth, window.innerHeight))
  const circle = (r: number) => `circle(${r}px at calc(100% - 28px) 24px)`

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  })

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: circle(0) }}
      animate={{ clipPath: circle(reach), transition: { duration: 0.75, ease: [0.7, 0, 0.2, 1] } }}
      exit={{ clipPath: circle(0), transition: { duration: 0.55, ease: [0.7, 0, 0.3, 1], delay: 0.05 } }}
      onAnimationComplete={(def) => {
        // fires for the exit too; only the open bloom should lock the page
        if (typeof def === 'object' && def !== null && 'clipPath' in def && def.clipPath === circle(reach)) setBloomed(true)
      }}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-saffron px-4 text-white will-change-[clip-path] md:hidden"
    >
      <div className="flex h-12 shrink-0 items-center justify-between">
        <Link to="/" onClick={onClose} aria-label="Isha Sacred Walks home">
          <img src="/images/logo-nav.webp" alt="Isha Sacred Walks" width={220} height={111} className="h-9 w-auto brightness-0 invert" />
        </Link>
        {/* the header's burger, morphed into a cross, sits above this spot */}
      </div>

      <nav className="flex flex-1 flex-col pt-10 pb-10">
        <motion.a {...rise(0)} href="#yatras" onClick={onClose} className="font-display text-[44px] leading-none">
          Yatras
        </motion.a>
        <ul className="mt-5 space-y-1 border-l border-white/30 pl-4">
          {yatras.map((y, i) => (
            <motion.li key={y.slug} {...rise(i + 1)}>
              <a href="#yatras" onClick={onClose} className="flex items-baseline justify-between gap-3 py-2">
                <span className="text-[17px] font-medium">{y.title}</span>
                <span className="shrink-0 text-[12.5px] text-white/70">
                  {y.region} · {y.days}d
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <motion.a {...rise(yatras.length + 1)} href="#about" onClick={onClose} className="mt-10 font-display text-[44px] leading-none">
          About
        </motion.a>

        <motion.a
          {...rise(yatras.length + 2)}
          href="#yatras"
          onClick={onClose}
          className="mt-auto self-start rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-saffron-ink"
        >
          Enquire
        </motion.a>
      </nav>
    </motion.div>
  )
}

/** Two bars that fold into a cross; the bars lengthen so the cross reads larger than the burger. */
function BurgerIcon({ open }: { open: boolean }) {
  const t = { duration: 0.35, ease }
  const bar = 'absolute top-1/2 h-[1.8px] -mt-[0.9px] rounded-full bg-current'
  return (
    <span className="relative block h-6 w-6" aria-hidden>
      <motion.span
        className={bar}
        initial={false}
        animate={open ? { y: 0, rotate: 45, left: 0, right: 0 } : { y: -4, rotate: 0, left: 4, right: 4 }}
        transition={t}
      />
      <motion.span
        className={bar}
        initial={false}
        animate={open ? { y: 0, rotate: -45, left: 0, right: 0 } : { y: 4, rotate: 0, left: 4, right: 4 }}
        transition={t}
      />
    </span>
  )
}

/** Apple-style global bar: thin, translucent, hairline once you scroll. */
export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 border-b px-4 md:px-5 transition-colors duration-300 ${
          menuOpen
            ? 'z-[70] border-transparent bg-transparent' // floats over the sheet so the burger can become its close button
            : `z-50 md:backdrop-blur-xl md:backdrop-saturate-[1.8] ${scrolled ? 'border-black/[0.08] bg-white/95 md:bg-white/75' : 'border-transparent bg-white/0'}`
        }`}
      >
        <nav className="mx-auto flex h-12 max-w-[1180px] items-center justify-between">
          <Link
            to="/"
            className={`flex items-center transition-opacity duration-200 ${menuOpen ? 'pointer-events-none opacity-0' : ''}`}
            aria-label="Isha Sacred Walks home"
          >
            <img src="/images/logo-nav.webp" alt="Isha Sacred Walks" width={220} height={111} className="h-9 w-auto" />
          </Link>

          <ul className="hidden items-center gap-2 md:flex">
            <YatrasMenu />
            <li>
              <a href="#about" className={`${pill} block`}>
                About
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href="#yatras"
              className={`rounded-full bg-saffron px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-[background-color,opacity] duration-200 hover:bg-saffron-ink ${menuOpen ? 'pointer-events-none opacity-0' : ''}`}
            >
              Enquire
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`-mr-1.5 grid h-9 w-9 place-items-center rounded-full transition-colors duration-300 md:hidden ${
                menuOpen ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-black/[0.06]'
              }`}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </header>

      {/* sibling of the header: its backdrop-filter would otherwise trap a fixed child */}
      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  )
}
