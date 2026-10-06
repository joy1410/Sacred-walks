import { kashi } from './kashi'
import { hero as whyHero } from './whyPilgrimage'

/** the homepage hero: portrait art on phones, the wide panorama from md, the film's still */
export const homeHero = {
  art: '/images/hero_mobile.webp',
  artWide: '/images/hero.webp',
  poster: '/media/hero-poster.webp',
}

/**
 * Each page's first-screen images, by path. vite.config.ts writes them into
 * index.html, so they start downloading with the app's code instead of once
 * it has run and drawn the page. A new page adds its hero here.
 */
export const firstScreen: Record<string, { href: string; media?: string }[]> = {
  '/': [
    { href: homeHero.art, media: '(max-width: 767px)' },
    { href: homeHero.artWide, media: '(min-width: 768px)' },
    { href: homeHero.poster },
  ],
  '/yatras/kashi-krama': [{ href: kashi.hero.src }],
  '/why-pilgrimage': [{ href: whyHero.image.src }],
}
