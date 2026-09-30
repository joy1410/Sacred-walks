import { useState } from 'react'
import { BlurText } from './BlurIn'

/**
 * "divine": focuses in letter by letter with the rest of the line, then
 * swaps to a single span so the saffron light can move through the whole word
 * (background-clip text can't span separately animated letters).
 * The swap waits for the real animation end, not a timer, so it stays in step
 * even when frames are paused (background tab).
 */
export default function DivineWord({ delay = 0.8 }: { delay?: number }) {
  const [settled, setSettled] = useState(false)

  return settled ? (
    <span className="text-saffron-grad inline-block">divine</span>
  ) : (
    <BlurText text="divine" delay={delay} className="inline-block text-saffron" onDone={() => setSettled(true)} />
  )
}
