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
export const IconX = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45z" /></svg>
)
export const IconFacebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.7c0-.85.24-1.43 1.46-1.43h1.56V4.64A21 21 0 0 0 14.25 4.5c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.92v2.94h2.54V21h3.04z" /></svg>
)
export const IconInstagram = (p: P) => (
  <svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></svg>
)
export const IconChevronDown = (p: P) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m5 9 7 7 7-7" /></svg>
)
export const IconCheck = (p: P) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
export const IconPlus = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconArrowUpRight = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
)
export const IconHotel = (p: P) => (
  <svg {...base} {...p}><path d="M3 19V7M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6" /><circle cx="7" cy="11.5" r="1.8" /></svg>
)
/** a bowl with rising steam */
export const IconMeal = (p: P) => (
  <svg {...base} {...p}><path d="M3.5 12h17a8.5 8.5 0 0 1-17 0ZM9 4.5c-.8.9-.8 2 0 3M13 3.5c-.8.9-.8 2 0 3M17 4.5c-.8.9-.8 2 0 3" /></svg>
)
export const IconBus = (p: P) => (
  <svg {...base} {...p}><rect x="4" y="3.5" width="16" height="14" rx="3" /><path d="M4 11h16M8 17.5V20M16 17.5V20" /><circle cx="8" cy="14.3" r=".6" fill="currentColor" /><circle cx="16" cy="14.3" r=".6" fill="currentColor" /></svg>
)
export const IconBoat = (p: P) => (
  <svg {...base} {...p}><path d="M2.5 14h19l-2.5 4.5H5zM12 14V4l6 7.5h-6M2.5 21c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8" /></svg>
)
export const IconDoctor = (p: P) => (
  <svg {...base} {...p}><rect x="3.5" y="6.5" width="17" height="13" rx="3" /><path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5M12 10v6M9 13h6" /></svg>
)
export const IconTeam = (p: P) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.2A5.5 5.5 0 0 1 20.5 19" /></svg>
)
