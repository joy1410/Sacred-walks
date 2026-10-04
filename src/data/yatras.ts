export const u = (id: string, w = 1800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export type Difficulty = 1 | 2 | 3

export type YatraImage = {
  src: string
  caption: string
}

/**
 * Where registration stands right now. Every state has a way forward:
 * a closed yatra points at next season's waitlist, never a dead end.
 */
export type YatraStatus =
  | { state: 'open'; departure: string; seatsLeft?: number }
  | { state: 'soon'; opens: string; season: string }
  | { state: 'closed'; completed: string; next: string; opens?: string }

export type HighlightIcon = 'parikrama' | 'lake' | 'sadhana' | 'temple' | 'gopuram' | 'diya' | 'boat' | 'trishul'

export type Yatra = {
  slug: string
  tab: string
  /** shorter tab label for phones, where four segments share ~340px */
  tabShort?: string
  region: string
  title: string
  /** what you'll be doing there, in a few words: read side by side, the four should tell the yatras apart. One line on a phone (~300px) */
  tagline: string
  summary: string
  days: number
  difficulty: Difficulty
  difficultyLabel: string
  season: string
  /** short form for the facts row */
  seasonShort: string
  status: YatraStatus
  /** Sadhguru's words only, each checked against isha.sadhguru.org (source noted beside it) */
  quote: { text: string; by: string }
  /** each line carries the icon that pictures it */
  highlights: { text: string; icon: HighlightIcon }[]
  images: YatraImage[]
}

/*
 * Open/closed status is confirmed; departure dates are placeholders until registration data is wired in.
 */
/**
 * The yatra's own page, or null while it has none. A yatra without a page is
 * shown but never linked: nothing should send people somewhere it isn't.
 */
export const yatraPage = (slug: string): string | null => (slug === 'kashi-krama' ? `/yatras/${slug}` : null)

// open yatras first: the first card anyone meets is one they can register for now;
// closed ones follow, Kailash before the Himalayas as the stronger pull
export const yatras: Yatra[] = [
  {
    slug: 'kashi-krama',
    tab: 'Kashi Krama',
    region: 'Varanasi',
    title: 'Kashi Krama',
    tagline: 'Walk the temples and ghats of Kashi',
    summary:
      'Immerse in the oldest living city on earth: its ghats, its temples, and the fire-lit aarti on the Ganga where life and death meet.',
    days: 5,
    difficulty: 1,
    difficultyLabel: 'Gentle',
    season: 'October – March',
    seasonShort: 'Oct – Mar',
    status: { state: 'open', departure: '3 – 7 Dec 2026' },
    // isha.sadhguru.org/mahashivratri/shiva/kashi-shiva-tower-of-light-vishwanath-manikarnika-ghat
    quote: {
      text: 'Kashi was built as an instrument in the form of a city, which brings a union between the “micro” and the “macro.”',
      by: 'Sadhguru',
    },
    highlights: [
      { text: 'Dawn boat ride along the 84 ghats', icon: 'boat' },
      { text: 'Ganga aarti at Dashashwamedh', icon: 'diya' },
      { text: 'Darshan at Kashi Vishwanath', icon: 'temple' },
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
    tab: 'Southern Sojourn',
    tabShort: 'South',
    region: 'Tamil Nadu',
    title: 'Southern Sojourn',
    tagline: 'Behold the great temples of the south',
    summary:
      'A journey through the great temple towns of the south, ending in the Velliangiri foothills in the presence of Adiyogi.',
    days: 6,
    difficulty: 1,
    difficultyLabel: 'Gentle',
    season: 'November – February',
    seasonShort: 'Nov – Feb',
    status: { state: 'open', departure: '6 – 13 Dec 2026' },
    // isha.sadhguru.org/en/wisdom/quotes/date/january-08-2023
    quote: {
      text: 'When you go to an Indian temple, it is to behold an energy form – Darshan. You want to take an imprint of the Divine within yourself.',
      by: 'Sadhguru',
    },
    // each kept to one line on a phone, as Kashi's are; Brihadeeswarar is named in its photo's caption
    highlights: [
      { text: 'Darshan at Meenakshi temple, Madurai', icon: 'gopuram' },
      { text: 'Thanjavur’s thousand-year-old temple', icon: 'temple' },
      { text: 'Ending with Adiyogi at Velliangiri', icon: 'trishul' },
    ],
    images: [
      { src: u('1732883247945-896e63ee644a'), caption: 'Gopuram against the southern sky' },
      { src: u('1642516861335-97971622499e'), caption: 'Brihadeeswarar, Thanjavur' },
      { src: u('1609609830354-8f615d61b9c8'), caption: 'Adiyogi, Coimbatore' },
      { src: u('1689683306810-5634fdb54d4a'), caption: 'Clouds over the Western Ghats' },
    ],
  },
  {
    slug: 'kailash-manasarovar',
    tab: 'Kailash Manasarovar',
    region: 'Tibet',
    title: 'Kailash Manasarovar',
    tagline: 'Circle Shiva’s abode on foot',
    summary:
      'Walk the ancient parikrama around the abode of Shiva and sit by the still waters of Manasarovar, a yatra that asks for everything and offers the beyond.',
    days: 14,
    difficulty: 3,
    difficultyLabel: 'Challenging',
    season: 'June – September',
    seasonShort: 'Jun – Sep',
    status: { state: 'closed', completed: '2026', next: '2027' },
    // isha.sadhguru.org/en/wisdom/article/kailash-the-greatest-mystical-library
    quote: {
      text: 'Kailash is the greatest mystical library on the planet. Anything that one wishes to know about creation has been stored there.',
      by: 'Sadhguru',
    },
    highlights: [
      { text: 'Three-day parikrama around Mount Kailash', icon: 'parikrama' },
      { text: 'Sunrise meditation on the shores of Manasarovar', icon: 'lake' },
      { text: 'Guided sadhana to prepare body and mind', icon: 'sadhana' },
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
    tab: 'Himalayan Yatra',
    region: 'Uttarakhand',
    title: 'Himalayan Yatra',
    tagline: 'Meditate in the land of the yogis',
    summary:
      'From the banks of the Ganga at Rishikesh to the high shrine of Kedarnath, a journey through the land where yogis have sat for millennia.',
    days: 11,
    difficulty: 2,
    difficultyLabel: 'Moderate',
    season: 'May – June, Sept – Oct',
    seasonShort: 'May · Sep',
    status: { state: 'closed', completed: '2026', next: '2027' },
    // from Sadhguru's poem "Himalaya": isha.sadhguru.org/en/sadhguru/mystic/himalayas
    quote: {
      text: 'Even the rocks reach out to the heavens. No wonder beings seeking divine made you their abode.',
      by: 'Sadhguru',
    },
    highlights: [
      { text: 'Darshan at Kedarnath temple', icon: 'temple' },
      { text: 'Ganga aarti at Rishikesh', icon: 'diya' },
      { text: 'Meditations at ancient Himalayan sites', icon: 'sadhana' },
    ],
    images: [
      { src: u('1612438214708-f428a707dd4e'), caption: 'Kedarnath, 3,583 m' },
      { src: u('1606722581293-628fa217a6f7'), caption: 'Garhwal peaks above the valley' },
      { src: u('1607406374368-809f8ec7f118'), caption: 'Shiva on the Ganga, Rishikesh' },
      { src: u('1712510817140-917938f92e5b'), caption: 'Rishikesh in autumn light' },
    ],
  },
]
