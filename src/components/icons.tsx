import type { SVGProps } from 'react'

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

type P = SVGProps<SVGSVGElement>

export const IconArrowRight = (p: P) => (
  <svg {...base} {...p}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
)
export const IconArrowLeft = (p: P) => (
  <svg {...base} {...p}><path d="M20 12H5M11 6l-6 6 6 6" /></svg>
)
export const IconClock = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
)
export const IconCalendar = (p: P) => (
  <svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
)
export const IconPeak = (p: P) => (
  <svg {...base} {...p}><path d="M2.5 19.5 9 8l3.5 5.5L15 10l6.5 9.5z" /><path d="M7.4 10.8 9 12l1.6-1.3" /></svg>
)
export const IconUsers = (p: P) => (
  <svg {...base} {...p}><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" /><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.3c1.8.6 3 2.3 3.4 4.7" /></svg>
)
export const IconPin = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
)
export const IconPlus = (p: P) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconCheck = (p: P) => (
  <svg {...base} {...p}><path d="m5 12.5 4.2 4L19 7" /></svg>
)
