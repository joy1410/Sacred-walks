import widths from '../data/photo-widths.json'

/**
 * Every photograph on the site goes through photo(), so they all behave alike:
 *  - srcset + sizes: each screen downloads the smallest copy that's still sharp
 *    (our own photos have -800 and -1200 copies, made by npm run photos;
 *    Unsplash resizes on request)
 *  - lazy by default, so the browser leaves them to PreloadQueue, which
 *    fetches them nearest-first behind the first screen
 *  - priority: the first screen's photo, fetched at once and ahead of everything
 *    (PreloadQueue waits for it; index.html starts it before the app has run)
 *  - data-photo: shimmers until it has loaded (index.css; main.tsx marks it loaded)
 *
 *   <img {...photo(src, { sizes: SIZES.stories })} alt="…" className="…" />
 */
const STEPS = [800, 1200] // keep in step with scripts/photo-sizes.mjs
const known: Record<string, number> = widths

function srcSet(src: string) {
  if (src.startsWith('https://images.unsplash.com/')) {
    const full = Number(/[?&]w=(\d+)/.exec(src)?.[1])
    if (!full) return undefined
    return [...STEPS.filter((w) => w < full), full].map((w) => `${src.replace(/w=\d+/, `w=${w}`)} ${w}w`).join(', ')
  }
  const full = known[src]
  if (!full) return undefined
  return [
    ...STEPS.filter((w) => w < full).map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`),
    `${src} ${full}w`,
  ].join(', ')
}

export function photo(src: string, { sizes, priority }: { sizes?: string; priority?: boolean } = {}) {
  return {
    src,
    // without sizes the browser assumes the photo fills the screen; better to send the full file
    srcSet: sizes ? srcSet(src) : undefined,
    sizes,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : undefined,
    decoding: 'async' as const,
    'data-photo': '',
  }
}

/*
 * How wide each frame draws its photo. A landscape photo cropped into a tall
 * frame (object-cover) is drawn wider than the frame, at its height × 1.5 for
 * the 3:2 photos used here, so these say max(frame width, frame height × 1.5).
 * Full-bleed photos (heroes, section backgrounds) pass no sizes: on a phone
 * their tall crop needs the full file anyway.
 */
export const SIZES = {
  // phones: 80vw × 4/5 frame → drawn 150vw. Desktop: min(64vw, 1040) × up to 640 tall
  journey: '(min-width: 768px) max(min(64vw, 1040px), min(100vh - 200px, 640px) * 1.5), 150vw',
  // phones: a 192px-tall strip, card-wide. lg: the card's left 1.55fr, up to 640 tall
  carousel: '(min-width: 1024px) max(min(60vw, 720px), min(100vh - 260px, 640px) * 1.5), calc(100vw - 48px)',
  // 4:3 frame (drawn 1.125× its width) beside the card's text gutter; lg: left 1.35fr, up to 640 tall
  stories: '(min-width: 1024px) calc(min(100vh - 200px, 640px) * 1.5), calc((100vw - 76px) * 1.125)',
  // md+: 7 or 5 of 12 columns, 480 tall. sm: 4:3. Phones: 4:5 → drawn 1.875× its width
  kashiTile: '(min-width: 768px) max(min(58vw, 690px), 720px), (min-width: 640px) calc((100vw - 32px) * 1.125), calc((100vw - 32px) * 1.875)',
  // below lg: a 4:3 photo in each day, past the rail
  itineraryDay: 'calc((100vw - 64px) * 1.125)',
  // lg: the sticky frame, half the grid, up to 640 tall
  itineraryFrame: 'max(min(45vw, 560px), min(100vh - 160px, 640px) * 1.5)',
  // 4:3 covers: 82vw cards on phones, three or four across from md
  yatraCover: '(min-width: 768px) 430px, calc(82vw * 1.125)',
}
