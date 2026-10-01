import { type MotionValue, type TransformOptions, transform, useTransform } from 'motion/react'

/**
 * useTransform for scroll progress, always driven from JS.
 *
 * Motion hands scroll-linked opacity to a native ScrollTimeline/ViewTimeline
 * when it can, which runs on the compositor thread. Everything else here
 * (film geometry in CSS variables, y, scale) runs on the main thread. With
 * Lenis smoothing the wheel on desktop the two stay in step, but with native
 * touch scrolling on phones the compositor runs ahead of JS, so faded words
 * and the growing film drift apart frame to frame and the hero judders.
 * A function transformer opts out of acceleration, keeping every
 * scroll-linked value on the same clock.
 */
export function useScrollRange<T>(
  progress: MotionValue<number>,
  input: number[],
  output: T[],
  options?: TransformOptions<T>,
): MotionValue<T> {
  const map = transform(input, output, options)
  return useTransform(progress, (v: number) => map(v))
}
