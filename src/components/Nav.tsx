import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValueEvent, useScroll } from 'motion/react'

const links = ['Yatras', 'Sacred Spaces', 'Stories', 'Plan your visit', 'About']

/** Apple-style global bar: thin, translucent, hairline once you scroll. */
export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-[1.8] transition-colors duration-300 ${
        scrolled ? 'border-black/[0.08] bg-white/75' : 'border-transparent bg-white/0'
      }`}
    >
      <nav className="mx-auto flex h-12 max-w-[1080px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 text-[15px] tracking-[-0.02em] text-ink" aria-label="Isha Sacred Walks home">
          <span className="h-2 w-2 rounded-full bg-saffron" aria-hidden />
          <span className="font-semibold">Isha</span>
          <span className="font-normal text-ink-2">Sacred Walks</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l}>
              <a href="#yatras" className="text-[12.5px] text-ink-2 transition-colors hover:text-ink">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#yatras"
          className="rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-2"
        >
          Enquire
        </a>
      </nav>
    </header>
  )
}
