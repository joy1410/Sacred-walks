import { photo } from '../lib/photo'

/**
 * Photos for content that isn't on show yet: the other tabs, the other days.
 * They wait here unseen (a hidden image never loads itself), where
 * PreloadQueue finds them in their place in the page and fetches them, at
 * the same size as the frame that will show them, before they're needed.
 */
export default function Upcoming({ srcs, sizes }: { srcs: string[]; sizes?: string }) {
  return (
    <div hidden>
      {srcs.map((src) => (
        <img key={src} {...photo(src, { sizes })} alt="" />
      ))}
    </div>
  )
}
