/**
 * Phones and touch tablets. Their browsers rasterise filter: blur on the GPU
 * per element, per frame; stacked with the rest of the page it exhausts tile
 * memory and whole sections render blank or as grey smears until raster
 * catches up. On these devices reveals skip the blur and fade/rise only.
 */
export const lite =
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (max-width: 767px)').matches

/** A blur keyframe on desktop, nothing on lite devices. */
export const blur = (px: number) => (lite ? {} : { filter: `blur(${px}px)` })
