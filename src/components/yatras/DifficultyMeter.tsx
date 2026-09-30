import type { Difficulty } from '../../data/yatras'

/** Three rising bars, like signal strength, but for the climb. */
export default function DifficultyMeter({ level }: { level: Difficulty }) {
  return (
    <span className="inline-flex items-end gap-[2px]" aria-hidden>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`w-[3px] rounded-full ${n <= level ? 'bg-saffron' : 'bg-line'}`}
          style={{ height: 4 + n * 3 }}
        />
      ))}
    </span>
  )
}
