import type { ComponentProps } from 'react'
import { useHref, useLinkClickHandler } from 'react-router-dom'
import { motion } from 'motion/react'

type Props = ComponentProps<'a'> & { href: string }

/**
 * A link that stays inside the app for our own pages (no reload, Lenis and
 * the ambient light carry on) and is a plain anchor for everything else:
 * homepage sections (/#yatras), which the browser jumps to itself, and
 * external or placeholder links.
 */
export default function SiteLink({ href, ...rest }: Props) {
  if (href.startsWith('/') && !href.startsWith('/#')) return <InternalLink href={href} {...rest} />
  return <a href={href} {...rest} />
}

/**
 * Router navigation on a plain anchor, rather than <Link>: Link hands its
 * anchor a fresh callback ref on every render, so React detaches and
 * reattaches it each time. Motion reads that as the element leaving and
 * arriving, so a MotionSiteLink replayed its entrance on every re-render and,
 * inside AnimatePresence, came back after its exit and held the phone menu
 * open. Here the ref goes straight to the anchor. useLinkClickHandler keeps
 * Link's behaviour: modified clicks and target="_blank" open as usual.
 */
function InternalLink({ href, onClick, target, ...rest }: Props) {
  const navigate = useLinkClickHandler<HTMLAnchorElement>(href, { target })
  return (
    <a
      href={useHref(href)}
      target={target}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) navigate(e)
      }}
      {...rest}
    />
  )
}

export const MotionSiteLink = motion.create(SiteLink)
