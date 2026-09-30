/** Brand mark: a bindu held inside a path that circles it, like a parikrama. */
export default function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path
        d="M16 3.5a12.5 12.5 0 1 1-11.2 7"
        stroke="var(--color-gold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M16 9.5 20.5 19h-9L16 9.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="16" cy="22.2" r="1.5" fill="var(--color-sindoor)" />
    </svg>
  )
}
