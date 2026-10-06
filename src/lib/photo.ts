import widths from '../data/photo-widths.json'

/**
 * srcset + sizes, so each screen downloads the smallest copy that is still
 * sharp on it. The site's own photos have -800 and -1200 copies beside them
 * (npm run photos makes them); Unsplash resizes on request.
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

/** spread onto an <img>: <img {...photo(src, SIZES.stories)} /> */
export const photo = (src: string, sizes: string) => ({ src, srcSet: srcSet(src), sizes })

/*
 * How wide each frame draws its photo. A landscape photo cropped into a tall
 * frame (object-cover) is drawn wider than the frame, at its height × 1.5 for
 * the 3:2 photos used here, so these say max(frame width, frame height × 1.5).
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
}
