import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

/**
 * A link that stays inside the app for our own pages (no reload, Lenis and
 * the ambient light carry on) and is a plain anchor for everything else:
 * homepage sections (/#yatras), which the browser jumps to itself, and
 * external or placeholder links.
 */
export default function SiteLink({ href, ...rest }: ComponentProps<'a'> & { href: string }) {
  if (href.startsWith('/') && !href.startsWith('/#')) return <Link to={href} {...rest} />
  return <a href={href} {...rest} />
}

export const MotionSiteLink = motion.create(SiteLink)
