import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import Mark from './Mark'

const links = [
  { label: 'Yatras', href: '/#yatras' },
  { label: 'Sacred Spaces', href: '/#yatras' },
  { label: 'Stories', href: '/#yatras' },
  { label: 'About', href: '/#yatras' },
]

export default function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [raised, setRaised] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160)
    setRaised(y > 24)
  })

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          raised
            ? 'bg-paper/80 shadow-[0_1px_0_rgba(29,24,19,0.06),0_12px_32px_-18px_rgba(29,24,19,0.35)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 text-ink" aria-label="Isha Sacred Walks home">
          <Mark className="h-7 w-7" />
          <span className="flex flex-col leading-none">
            <span className="text-[9px] font-semibold tracking-[0.3em] text-ink-soft">ISHA</span>
            <span className="font-display text-[1.35rem] font-medium tracking-tight">Sacred Walks</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="group relative text-[13px] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-sacred)] group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/#yatras"
          className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink-2"
        >
          Enquire
        </a>
      </nav>
    </motion.header>
  )
}
