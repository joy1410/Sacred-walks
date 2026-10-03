import type { ReactNode } from 'react'
import { preparation } from '../../data/kashi'
import { Rise, SectionHeading } from './shared'

/**
 * Whether you can do this, then what to bring. First what the days actually
 * involve, in four plain facts; then Isha's prerequisites and rules; then the
 * packing list, grouped by what each thing is for, and the medical kit. People read this while deciding,
 * and pack weeks later, so the list is for reading and printing, not ticking.
 */
export default function Preparation() {
  return (
    <section id="preparation" aria-labelledby="preparation-title" className="px-4 py-20 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label="Fitness & preparation" id="preparation-title" title="What the days ask of you" lede={preparation.lede} />

        <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {preparation.demands.map((d, i) => (
            <li key={d.title}>
              <Rise delay={i * 0.08} className="h-full">
                <p className="font-display text-[40px] leading-none font-semibold text-saffron md:text-[44px]">{d.kicker}</p>
                <h3 className="mt-4 text-[16px] font-semibold text-ink">{d.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-soft">{d.body}</p>
              </Rise>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-3 md:mt-20 md:grid-cols-2 md:gap-5">
          <Rise>
            <Card title="Prerequisites" items={preparation.prerequisites} />
          </Rise>
          <Rise delay={0.08}>
            <Card title="Rules to follow" items={preparation.rules} />
          </Rise>
        </div>

        <Rise className="mt-3 md:mt-5">
          <Packing />
        </Rise>
      </div>
    </section>
  )
}

function Card({ title, items }: { title: string; items: { title: string; body: string }[] }) {
  return (
    <div className="h-full rounded-[28px] border border-line-soft bg-white p-6 md:p-8">
      <h3 className="font-display text-[28px] leading-none font-semibold text-ink md:text-[32px]">{title}</h3>
      <ul className="mt-6 divide-y divide-black/[0.06]">
        {items.map((a) => (
          <li key={a.title} className="py-4 first:pt-0 last:pb-0">
            <p className="text-[15px] font-semibold text-ink">{a.title}</p>
            <p className="mt-1 text-[14.5px] leading-[1.55] text-ink-soft">{a.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** print just this card: the page hides everything else while the class is on */
function printList() {
  const root = document.documentElement
  root.classList.add('print-packing')
  const done = () => {
    root.classList.remove('print-packing')
    window.removeEventListener('afterprint', done)
  }
  window.addEventListener('afterprint', done)
  window.print()
}

/** one group of the packing list, as a tile inside it */
function Tile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="h-full rounded-[20px] bg-white p-5 md:p-6">
      <h4 className="font-display text-[22px] leading-none font-semibold text-ink">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Packing() {
  const { packing, medical } = preparation
  return (
    <div id="packing-list" className="rounded-[28px] bg-mist p-4 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-2 pt-2 md:px-0 md:pt-0">
        <h3 className="font-display text-[28px] leading-none font-semibold text-ink md:text-[32px]">What to pack</h3>
        <button
          type="button"
          onClick={printList}
          className="text-[14px] font-medium text-saffron-ink underline decoration-saffron/30 underline-offset-4 transition-colors hover:decoration-saffron print:hidden"
        >
          Print or save as PDF
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3">
        {packing.map((g) => (
          <Tile key={g.title} title={g.title}>
            <ul className="space-y-2.5">
              {g.items.map((it) => (
                <li key={it.item} className="flex gap-2.5 text-[15px] leading-[1.45]">
                  <span aria-hidden className="mt-[0.55em] h-[5px] w-[5px] shrink-0 rounded-full bg-saffron" />
                  <span>
                    <span className="font-medium text-ink">{it.item}</span>
                    {it.why && <span className="block text-[14px] text-ink-soft">{it.why}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Tile>
        ))}
        <Tile title="Medical kit">
          <p className="text-[14px] text-ink-soft">Medicines for</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {medical.ailments.map((a) => (
              <li key={a} className="rounded-full bg-mist px-3 py-1 text-[14px] font-medium text-ink-2">
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[14px] leading-[1.5] text-ink-soft">{medical.note}</p>
        </Tile>
      </div>
    </div>
  )
}
