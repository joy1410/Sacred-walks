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
/** a peak with a path circling its foot: the parikrama */
export const IconParikrama = (p: P) => (
  <svg {...base} {...p}><path d="M7.5 16 12 7.5l2.3 4 1.2-1.8L18 16" /><path d="M19.6 14.3c.9.6 1.4 1.3 1.4 2 0 2-4 3.7-9 3.7s-9-1.7-9-3.7c0-1.1 1.2-2.1 3.2-2.8" /><path d="m5.6 12.1 1.6 1.4-1.9.8" /></svg>
)
export const IconPin = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
)
/** the sun rising over still water */
export const IconLake = (p: P) => (
  <svg {...base} {...p}><path d="M3 13h18M7 13a5 5 0 0 1 10 0M12 3.5v2.5M5.6 6.6 7.3 8.3M18.4 6.6l-1.7 1.7M4.5 16.5c1.25 0 1.25-.7 2.5-.7s1.25.7 2.5.7 1.25-.7 2.5-.7 1.25.7 2.5.7 1.25-.7 2.5-.7 1.25.7 2.5.7M8 20c1 0 1-.6 2-.6s1 .6 2 .6 1-.6 2-.6 1 .6 2 .6" /></svg>
)
/** a shikhara temple with its flag: Kedarnath, Vishwanath, Thanjavur */
export const IconTemple = (p: P) => (
  <svg {...base} {...p}><path d="M4 20.5h16M6.5 20.5V14h11v6.5M8 14c0-4 2.2-7 4-8.5 1.8 1.5 4 4.5 4 8.5M12 5.5v-3l2.5 1-2.5 1M10.5 20.5v-2.5a1.5 1.5 0 0 1 3 0v2.5" /></svg>
)
/** a tiered southern gateway tower */
export const IconGopuram = (p: P) => (
  <svg {...base} {...p}><path d="M4 20.5h16M5.5 20.5l1-4h11l1 4M7.5 16.5l1-4h7l1 4M9.2 12.5l.8-4h4l.8 4M10 8.5V6.5h4v2M12 6.5V3.5M11 20.5v-2h2v2" /></svg>
)
/** an oil lamp with its flame: the aarti */
export const IconDiya = (p: P) => (
  <svg {...base} {...p}><path d="M3.5 14h17c-.9 3.4-4.3 5.5-8.5 5.5S4.4 17.4 3.5 14ZM20.5 14l1-1.5M12 11.2c-1.6-.7-2.4-2.2-1.7-3.8.5-1.2 1.6-2 1.7-3.9 1.4 1 2.8 2.8 2.5 4.9-.2 1.4-1.1 2.4-2.5 2.8Z" /></svg>
)
/** Shiva's trident: Adiyogi */
export const IconTrishul = (p: P) => (
  <svg {...base} {...p}><path d="M12 2.5v19M6 4.5c0 3.4 2.5 5.5 6 5.5s6-2.1 6-5.5M6 4.5 4.8 6M18 4.5 19.2 6M10.5 2.5 12 1M13.5 2.5 12 1M10 13.5h4" /></svg>
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
export const IconPhone = (p: P) => (
  <svg {...base} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
)
export const IconInfo = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></svg>
)
