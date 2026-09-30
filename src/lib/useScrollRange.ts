import { type MotionValue, type TransformOptions, useTransform } from 'motion/react'

/**
 * useTransform for scroll progress, padded to cover the full 0→1 range.
 *
 * Motion hardware-accelerates scroll-linked opacity/transform with native
 * ScrollTimeline animations. With a partial range like [0.02, 0.14] the
 * browser builds keyframes only at those offsets, and past the last one it
 * interpolates back to the element's base value at offset 1 — so a fade-out
 * quietly fades back in. Pinning explicit 0 and 1 keyframes holds the ends.
 */
export function useScrollRange<T>(
  progress: MotionValue<number>,
  input: number[],
  output: T[],
  options?: TransformOptions<T>,
): MotionValue<T> {
  const i = [...input]
  const o = [...output]
  if (i[0] > 0) {
    i.unshift(0)
    o.unshift(o[0])
  }
  if (i[i.length - 1] < 1) {
    i.push(1)
    o.push(o[o.length - 1])
  }
  return useTransform(progress, i, o, options)
}
