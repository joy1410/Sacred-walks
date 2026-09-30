import type { Difficulty } from '../../data/yatras'

/** Three rising bars, like steps up a mountain. */
export default function DifficultyMeter({ level }: { level: Difficulty }) {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`w-[4px] rounded-[1px] ${n <= level ? 'bg-sindoor' : 'bg-line'}`}
          style={{ height: 5 + n * 3 }}
        />
      ))}
    </span>
  )
}
