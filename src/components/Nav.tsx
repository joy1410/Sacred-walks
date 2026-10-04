import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { yatraPage, yatras, type Yatra } from '../data/yatras'
import { ENQUIRE_URL } from '../data/kashi'
import SiteLink, { MotionSiteLink } from './SiteLink'
import { IconChevronDown } from './icons'

const pill =
  'rounded-full px-3.5 py-1.5 type-button-sm text-ink-2 transition-colors hover:bg-black/[0.06] hover:text-ink'
/** the page you're on: the hover state, held (neutral, so the yatra page's saffron section bar stays the only accent) */
const pillOn = 'bg-black/[0.06] text-ink'

/** which top-level item the current page belongs to */
function useCurrent() {
  const { pathname } = useLocation()
  return {
    yatras: pathname.startsWith('/yatras/'),
    why: pathname === '/why-pilgrimage',
  }
}

/** Yatras menu: opens on hover, focus or click; only yatras with a page are links. */
function YatrasMenu({ current }: { current: boolean }) {
  const { pathname } = useLocation()
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
      <button
        type="button"
        // hover has usually opened it already, so a click only ever opens; leaving, Escape or blur closes
        onClick={show}
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={current ? 'page' : undefined}
        className={`${pill} flex items-center gap-1 ${open || current ? pillOn : ''}`}
      >
        Yatras
        <IconChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5"
          >
            {/* solid white: a see-through panel greyed over the dark yatra heroes and washed out the mist rows */}
            <ul className="w-[300px] rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)]">
              {yatras.map((y) => {
                const page = yatraPage(y.slug)
                return (
                  <li key={y.slug}>
                    {page === pathname ? (
                      // the yatra you're on: the other rows' hover state, held, and not a link back to itself
                      <div aria-current="page" className="flex items-center gap-3 rounded-xl bg-mist p-2">
                        <MenuRow y={y} />
                      </div>
                    ) : page ? (
                      <SiteLink
                        href={page}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-mist focus-visible:bg-mist"
                      >
                        <MenuRow y={y} />
                      </SiteLink>
                    ) : (
                      <div className="flex items-center gap-3 p-2">
                        <MenuRow y={y} />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function MenuRow({ y }: { y: Yatra }) {
  return (
    <>
      <img src={y.images[0]?.src.replace(/w=\d+/, 'w=160')} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
      <span className="min-w-0">
        <span className="block truncate type-body-sm font-medium text-ink">{y.title}</span>
        <span className="block truncate type-caption text-ink-soft">
          {y.region} · {y.days} days
        </span>
      </span>
    </>
  )
}

/** a yatra in the phone sheet's list */
function SheetRow({ y, on = false }: { y: Yatra; on?: boolean }) {
  return (
    <>
      <span className="type-body font-medium">
        {y.title}
        {/* the yatra you're on: the sheet's white dot, smaller */}
        {on && <span aria-hidden className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-white align-middle" />}
      </span>
      <span className="shrink-0 type-caption text-white/70">
        {y.region} · {y.days}d
      </span>
    </>
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

  // Bloom out of the burger (top-right) far enough to cover the farthest corner. The bloom
  // is a saffron disc grown with transform, which the GPU animates on its own. (An animated
  // clip-path repaints the whole sheet every frame on the main thread; on phones it stalled
  // midway as the links began to rise, then jumped to full screen.) The disc is drawn at
  // half its final size, so the scaled layer stays small.
  const [reach] = useState(() => Math.hypot(window.innerWidth, window.innerHeight))
  const bloom = 'scale(2)'

  // every link starts rising only once the disc has covered it, on any phone or small tablet
  const current = useCurrent()
  const { pathname } = useLocation()
  // the page you're on carries a small white dot after its name
  const dot = (on: boolean) => on && <span aria-hidden className="ml-3 inline-block h-2.5 w-2.5 rounded-full bg-white align-middle" />

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  })

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] overflow-hidden text-white md:hidden"
    >
      <motion.div
        aria-hidden
        initial={{ transform: 'scale(0)' }}
        animate={{ transform: bloom, transition: { duration: 0.75, ease: [0.7, 0, 0.2, 1] } }}
        exit={{ transform: 'scale(0)', transition: { duration: 0.55, ease: [0.7, 0, 0.3, 1], delay: 0.05 } }}
        onAnimationComplete={(def) => {
          // fires for the exit too; only the open bloom should lock the page
          if (typeof def === 'object' && def !== null && 'transform' in def && def.transform === bloom) setBloomed(true)
        }}
        className="absolute rounded-full bg-saffron will-change-transform"
        style={{ width: reach, height: reach, left: `calc(100% - 28px - ${reach / 2}px)`, top: 24 - reach / 2 }}
      />

      <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain px-4">
        <div className="flex h-12 shrink-0 items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <Link to="/" onClick={onClose} aria-label="Isha Sacred Walks home">
              <img src="/images/logo-nav.webp" alt="Isha Sacred Walks" width={220} height={111} className="h-9 w-auto brightness-0 invert" />
            </Link>
          </motion.div>
          {/* the header's burger, morphed into a cross, sits above this spot */}
        </div>

        <nav className="flex flex-1 flex-col pt-10 pb-10">
          {/* a heading over the list, not a link */}
          <motion.p {...rise(0)} className="font-display text-[44px] leading-none">
            Yatras
            {dot(current.yatras)}
          </motion.p>
          <ul className="mt-5 space-y-1 border-l border-white/30 pl-4">
            {yatras.map((y, i) => (
              <motion.li key={y.slug} {...rise(i + 1)}>
                {yatraPage(y.slug) === pathname ? (
                  // the yatra you're on: marked with the dot, not a link back to itself
                  <div aria-current="page" className="flex items-baseline justify-between gap-3 py-2">
                    <SheetRow y={y} on />
                  </div>
                ) : yatraPage(y.slug) ? (
                  <SiteLink href={yatraPage(y.slug)!} onClick={onClose} className="flex items-baseline justify-between gap-3 py-2">
                    <SheetRow y={y} />
                  </SiteLink>
                ) : (
                  <div className="flex items-baseline justify-between gap-3 py-2">
                    <SheetRow y={y} />
                  </div>
                )}
              </motion.li>
            ))}
          </ul>

          <MotionSiteLink
            {...rise(yatras.length + 1)}
            href="/why-pilgrimage"
            onClick={onClose}
            aria-current={current.why ? 'page' : undefined}
            className="mt-10 font-display text-[44px] leading-none"
          >
            Why pilgrimage
            {dot(current.why)}
          </MotionSiteLink>

          {/* no About page yet: shown, not linked */}
          <motion.p {...rise(yatras.length + 2)} className="mt-6 font-display text-[44px] leading-none text-white/50">
            About
          </motion.p>

          <motion.a
            {...rise(yatras.length + 3)}
            href={ENQUIRE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-auto self-start rounded-full bg-white px-5 py-2.5 type-button-sm text-saffron-ink"
          >
            Enquire
          </motion.a>
        </nav>
      </div>
    </div>
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

/**
 * Apple-style global bar: thin, solid white with a hairline once you scroll (no backdrop blur: it
 * re-blurred the drifting ambient light every frame). On the homepage it starts clear, so the open
 * illustrated hero and its haze run up to the top edge; the other pages open on a framed card, so
 * there it is white from the start.
 */
export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))
  const [menuOpen, setMenuOpen] = useState(false)
  const current = useCurrent()
  const { pathname } = useLocation()
  const clear = pathname === '/' && !scrolled

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 border-b px-4 md:px-5 transition-colors duration-300 ${
          menuOpen
            ? 'z-[70] border-transparent bg-transparent' // floats over the sheet so the burger can become its close button
            : `z-50 ${clear ? 'bg-white/0' : 'bg-white'} ${scrolled ? 'border-black/[0.08]' : 'border-transparent'}`
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
            <YatrasMenu current={current.yatras} />
            <li>
              <SiteLink
                href="/why-pilgrimage"
                aria-current={current.why ? 'page' : undefined}
                className={`${pill} block ${current.why ? pillOn : ''}`}
              >
                Why pilgrimage
              </SiteLink>
            </li>
            <li>
              {/* no About page yet: shown, not linked */}
              <span className="block cursor-default rounded-full px-3.5 py-1.5 type-button-sm text-ink-mute">About</span>
            </li>
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href={ENQUIRE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full bg-ink px-4 py-1.5 type-button-sm text-white transition-[background-color,opacity] duration-200 hover:bg-ink-2 ${menuOpen ? 'pointer-events-none opacity-0' : ''}`}
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

      {/* sibling of the header, so the full-screen sheet is never trapped by anything the header styles */}
      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  )
}
