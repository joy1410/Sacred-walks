import type { SVGProps } from 'react'

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

type P = SVGProps<SVGSVGElement>

export const IconChevronLeft = (p: P) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m15 5-7 7 7 7" /></svg>
)
export const IconChevronRight = (p: P) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m9 5 7 7-7 7" /></svg>
)
export const IconArrowRight = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconPlay = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
)
export const IconPause = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><rect x="6.5" y="5" width="3.6" height="14" rx="1.2" /><rect x="13.9" y="5" width="3.6" height="14" rx="1.2" /></svg>
)
/** a winding path with a start and end point */
export const IconRoute = (p: P) => (
  <svg {...base} {...p}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16" /></svg>
)
export const IconSunrise = (p: P) => (
  <svg {...base} {...p}><path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 4v3M4.9 8.9l1.8 1.8M19.1 8.9l-1.8 1.8M8 21h8" /></svg>
)
/** seated meditator */
export const IconSadhana = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="5" r="2" /><path d="M12 8.5v5.5M7 11l5 1.5 5-1.5M4 19c2.5-2.5 5-3 8-3s5.5.5 8 3M4 19h16" /></svg>
)
export const IconPeak = (p: P) => (
  <svg {...base} {...p}><path d="M2.5 19.5 9 8l3.5 5.5L15 10l6.5 9.5z" /></svg>
)
export const IconCalendar = (p: P) => (
  <svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
)
