export type Shot = {
  src: string
  alt: string
  /** the yatra it was taken on, shown as the tile's badge */
  yatra: string
  /** crop to a tall frame, to break the strip's rhythm */
  tall?: boolean
}

/*
 * From the Gallery at the foot of isha.sadhguru.org/sacred-walks
 * (Kailash, Himalayas, Kashi, Southern), resized to 540px tall.
 * Ordered so no two neighbours share a yatra.
 */
export const gallery: Shot[] = [
  { src: '/images/strip/km-2.webp', alt: 'The north face of Kailash above the valley', yatra: 'Kailash Manasarovar' },
  { src: '/images/strip/hy-1.webp', alt: 'Priests holding flames at the Ganga aarti', yatra: 'Himalayan Yatra', tall: true },
  { src: '/images/strip/kk-3.webp', alt: 'A boat on the Ganga at sunrise, Kashi', yatra: 'Kashi Krama' },
  { src: '/images/strip/ss-6.webp', alt: 'A gopuram reflected in the temple tank', yatra: 'Southern Sojourn' },
  { src: '/images/strip/km-5.webp', alt: 'Yatris walking towards Manasarovar', yatra: 'Kailash Manasarovar' },
  { src: '/images/strip/kk-1.webp', alt: 'A child dressed as Shiva in Kashi', yatra: 'Kashi Krama', tall: true },
  { src: '/images/strip/hy-4.webp', alt: 'Crowds at the evening aarti, Haridwar', yatra: 'Himalayan Yatra' },
  { src: '/images/strip/ss-2.webp', alt: 'Hands cupping a lit clay lamp', yatra: 'Southern Sojourn', tall: true },
  { src: '/images/strip/km-6.webp', alt: 'Mani stones carved with mantras', yatra: 'Kailash Manasarovar' },
  { src: '/images/strip/kk-6.webp', alt: 'A palace on the ghats of Varanasi', yatra: 'Kashi Krama' },
  { src: '/images/strip/hy-6.webp', alt: 'Yatris with hands raised over the Ganga', yatra: 'Himalayan Yatra' },
  { src: '/images/strip/ss-5.webp', alt: 'Yatris entering the Brihadeeswara temple', yatra: 'Southern Sojourn' },
  { src: '/images/strip/km-1.webp', alt: 'Yatris crossing a suspension bridge in Nepal', yatra: 'Kailash Manasarovar', tall: true },
  { src: '/images/strip/kk-2.webp', alt: 'The ghats of Varanasi from the river', yatra: 'Kashi Krama' },
  { src: '/images/strip/hy-2.webp', alt: 'A riverside temple in the Himalayan foothills', yatra: 'Himalayan Yatra' },
  { src: '/images/strip/ss-4.webp', alt: 'A carved gopuram rising over a pillared hall', yatra: 'Southern Sojourn', tall: true },
]
