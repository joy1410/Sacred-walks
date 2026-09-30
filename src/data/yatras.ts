const u = (id: string, w = 1800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export type Difficulty = 1 | 2 | 3

export type YatraImage = {
  src: string
  caption: string
}

export type Yatra = {
  slug: string
  tab: string
  region: string
  title: string
  tagline: string
  summary: string
  days: number
  difficulty: Difficulty
  difficultyLabel: string
  season: string
  maxAltitude?: string
  groupSize: string
  nextDeparture: string
  quote: { text: string; by: string }
  highlights: string[]
  images: YatraImage[]
}

/*
 * NOTE: only the Kailash quote comes from the design draft.
 * The other quotes are editorial placeholders attributed to the programme,
 * so swap in verified Sadhguru quotes before shipping.
 */
export const yatras: Yatra[] = [
  {
    slug: 'kailash-manasarovar',
    tab: 'Kailash',
    region: 'Tibet',
    title: 'Kailash Manasarovar',
    tagline: 'Journey of a lifetime',
    summary:
      'Walk the ancient parikrama around the abode of Shiva and sit by the still waters of Manasarovar, a yatra that asks for everything and offers the beyond.',
    days: 14,
    difficulty: 3,
    difficultyLabel: 'Challenging',
    season: 'June – September',
    maxAltitude: '5,630 m',
    groupSize: '30–40 seekers',
    nextDeparture: 'Jun 2027',
    quote: {
      text: 'Kailash is the greatest mystical library on the planet. Anything that one wishes to know about creation has been stored there.',
      by: 'Sadhguru',
    },
    highlights: [
      'Three-day parikrama around Mount Kailash',
      'Sunrise meditation on the shores of Manasarovar',
      'Guided sadhana to prepare body and mind',
    ],
    images: [
      { src: u('1764753757089-ba31eb338384'), caption: 'South face at first light' },
      { src: u('1767714727834-a7ec5373355a'), caption: 'Prayer cairns on the parikrama' },
      { src: u('1676814220807-6246562842f2'), caption: 'High lakes of the Tibetan plateau' },
      { src: u('1606163804749-11c50b2245b6'), caption: 'Kailash beneath the night sky' },
    ],
  },
  {
    slug: 'himalayan-yatra',
    tab: 'Himalayas',
    region: 'Uttarakhand',
    title: 'Himalayan Yatra',
    tagline: 'Into the lap of the mountains',
    summary:
      'From the banks of the Ganga at Rishikesh to the high shrine of Kedarnath, a journey through the land where yogis have sat for millennia.',
    days: 10,
    difficulty: 2,
    difficultyLabel: 'Moderate',
    season: 'May – June, Sept – Oct',
    maxAltitude: '3,583 m',
    groupSize: '40–60 seekers',
    nextDeparture: 'May 2027',
    quote: {
      text: 'The mountains do not ask you to climb them. They ask you to become still enough to receive them.',
      by: 'Isha Sacred Walks',
    },
    highlights: [
      'Darshan at Kedarnath temple',
      'Ganga aarti at Rishikesh',
      'Meditations at ancient Himalayan sites',
    ],
    images: [
      { src: u('1612438214708-f428a707dd4e'), caption: 'Kedarnath, 3,583 m' },
      { src: u('1606722581293-628fa217a6f7'), caption: 'Garhwal peaks above the valley' },
      { src: u('1607406374368-809f8ec7f118'), caption: 'Shiva on the Ganga, Rishikesh' },
      { src: u('1712510817140-917938f92e5b'), caption: 'Rishikesh in autumn light' },
    ],
  },
  {
    slug: 'kashi-yatra',
    tab: 'Kashi',
    region: 'Varanasi',
    title: 'Kashi Yatra',
    tagline: 'The city of light',
    summary:
      'Immerse in the oldest living city on earth: its ghats, its temples, and the fire-lit aarti on the Ganga where life and death meet.',
    days: 5,
    difficulty: 1,
    difficultyLabel: 'Gentle',
    season: 'October – March',
    groupSize: '60–80 seekers',
    nextDeparture: 'Nov 2026',
    quote: {
      text: 'Kashi is not just a city on the river. It is a doorway that has stood open for thousands of years.',
      by: 'Isha Sacred Walks',
    },
    highlights: [
      'Dawn boat ride along the 84 ghats',
      'Ganga aarti at Dashashwamedh',
      'Darshan at Kashi Vishwanath',
    ],
    images: [
      { src: u('1561359313-0639aad49ca6'), caption: 'The ghats at morning' },
      { src: u('1627894483216-2138af692e32'), caption: 'Ganga aarti' },
      { src: u('1561361058-c24cecae35ca'), caption: 'Boats moored at the steps' },
      { src: u('1599831069477-b2acdc0bcb91'), caption: 'Fire offerings at dusk' },
    ],
  },
  {
    slug: 'southern-sojourn',
    tab: 'Southern sojourn',
    region: 'Tamil Nadu',
    title: 'Southern Sojourn',
    tagline: 'Temples of the Dravidian south',
    summary:
      'A journey through the great temple towns of the south, ending in the Velliangiri foothills in the presence of Adiyogi.',
    days: 8,
    difficulty: 1,
    difficultyLabel: 'Gentle',
    season: 'November – February',
    groupSize: '40–60 seekers',
    nextDeparture: 'Dec 2026',
    quote: {
      text: 'These temples were not built for worship alone. They were built as instruments to lift a human being.',
      by: 'Isha Sacred Walks',
    },
    highlights: [
      'Meenakshi temple, Madurai',
      'Brihadeeswarar temple, Thanjavur',
      'Adiyogi and the Velliangiri foothills',
    ],
    images: [
      { src: u('1732883247945-896e63ee644a'), caption: 'Gopuram against the southern sky' },
      { src: u('1642516861335-97971622499e'), caption: 'Brihadeeswarar, Thanjavur' },
      { src: u('1609609830354-8f615d61b9c8'), caption: 'Adiyogi, Coimbatore' },
      { src: u('1689683306810-5634fdb54d4a'), caption: 'Clouds over the Western Ghats' },
    ],
  },
]
