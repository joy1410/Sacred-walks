import { u } from './yatras'

/*
 * Kashi Krama yatra page.
 * Copy is taken from the official pages under
 * isha.sadhguru.org/sacred-walks/kashi-krama-yatra (About, Itinerary, Dates &
 * Registration, Program Guide, Prerequisites, Conveniences Offered, FAQ's).
 * Photos in /images/kashi are Isha's own, from that yatra's gallery; the
 * aarti and dusk shots come from Unsplash (same ones the homepage card uses).
 *
 * Editorial, not on the official site (confirm before shipping):
 *  - day titles and the "why" headings (body copy beneath them is official)
 *  - the "day in the yatra" rhythm, which is generic by design
 *  - the time-of-day labels on each day's route (read from the order and
 *    cues in the official day copy) and the Vindhyachal drive time
 *  - what Group S covers, and the "not included" list under Cost
 *  - the contribution amount, which isn't published: we route it to enquiry
 */

const k = (name: string) => `/images/kashi/${name}.webp`

export const REGISTER_URL = 'https://isha.sadhguru.org/sacred-walks/register-now'
export const ENQUIRE_URL = 'https://isha.sadhguru.org/sacred-walks/enquire-now'

export const kashi = {
  title: 'Kashi Krama',
  tagline: 'Bonding with light',
  region: 'Varanasi, Uttar Pradesh',
  days: 5,
  dates: '3 – 7 Dec 2026',
  language: 'English',
  hero: { src: k('hero'), caption: 'A sannyasi on the ghats at first light' },
  quote: {
    text: 'The creation of Kashi is the most phenomenal effort in building structures of consciousness ever made on the planet. It is immensely elaborate and scientifically perfect.',
    by: 'Sadhguru',
  },
}

export const overview = {
  // split so the page can light one word
  lead: {
    before: 'An intense tower of ',
    accent: 'light',
    after: '. The spiritual capital of a nation. Millennia of history, culture, mysticism and enlightenment steeped in its every corner.',
  },
  body: [
    'Kashi, the birthplace of Kabir, Tulsidas’ favoured abode, and newly adorned with its temple corridor, is a city beyond words and a place beyond time. Kashi Krama is a unique opportunity to journey to this holiest of cities.',
    'The journey is an intense spiritual experience, complete with meditations, satsangs, chants and spiritual processes. It is not just another pilgrimage; it is an opportunity to transform yourself and soak in the essence of the spiritual capital of India.',
  ],
}

export type Reason = {
  title: string
  /** drawn from Sadhguru's talks on isha.sadhguru.org (sources beside each) */
  body: string
  image: { src: string; caption: string }
}

export const reasons: Reason[] = [
  {
    title: 'A tower of light',
    // isha.sadhguru.org/en/wisdom/article/kashi
    body: 'The word “Kashi” means to be luminous: a tower of light.',
    image: { src: k('temple-spires'), caption: 'Temple shikharas above the ghats' },
  },
  {
    title: 'A city built as an instrument',
    // isha.sadhguru.org/en/wisdom/article/kashi
    body: 'Kashi once held 72,000 shrines, as many as the nadis in the human body, built as a “mega human body” to touch the cosmic one.',
    image: { src: k('ghats-boats'), caption: 'The ghats, seen from the river' },
  },
  {
    title: 'Shiva’s own city',
    // isha.sadhguru.org/en/wisdom/article/kashi
    body: 'Legend holds that Shiva himself lived here. Kashi was his winter home.',
    image: { src: k('young-shiva'), caption: 'A child dressed as Shiva' },
  },
  {
    title: 'In the footsteps of the sages',
    // isha.sadhguru.org/en/wisdom/video/what-makes-kedarnath-and-kashi-so-powerful
    body: 'Hundreds of enlightened beings once lived here at a time, from the Buddha at Sarnath to Kabir and Tulsidas.',
    image: { src: k('sadhu'), caption: 'A sadhu in meditation by the river' },
  },
]

/**
 * One stop on a day's route, in the order the day runs. `when` marks only
 * where the official copy gives a cue ("starts early", "in the evening");
 * stops without one follow on under the last cue. `travel` is the journey
 * before it. Either one starts a new line of the route.
 */
export type Stop = { place: string; when?: string; travel?: string }

export type Day = {
  day: number
  title: string
  route: Stop[]
  body: string[]
  image: { src: string; caption: string }
}

export const itinerary: Day[] = [
  {
    day: 1,
    title: 'Where the Buddha first spoke',
    route: [{ place: 'Sarnath' }],
    body: [
      'We begin with a visit to Sarnath, where Gautama the Buddha gave his first sermon after his enlightenment. This momentous event is depicted in beautifully crafted sculptures and monuments across the site.',
    ],
    image: { src: k('sarnath'), caption: 'Mulagandha Kuti Vihara, Sarnath' },
  },
  {
    day: 2,
    title: 'Mangala Arati and the river',
    route: [
      { place: 'Kashi Vishwanath', when: 'Before dawn' },
      { place: 'Vishalakshi' },
      { place: 'Annapoorni' },
      { place: 'Manikarnika Ghat' },
      { place: 'Boat & Ganga arati', when: 'Evening' },
    ],
    body: [
      'The day starts early with Mangala Arati at the Kashi Vishwanath Temple, one of the twelve Jyotirlingas, said to have been consecrated by Shiva himself. We then walk to the Vishalakshi Temple, one of the Shakti Sthalas, and the Annapoorni Temple.',
      'A journey through Kashi is not complete without Manikarnika Ghat, its most sacred cremation ground. We take a boat along the Ganga and join the spectacular evening arati.',
    ],
    image: { src: u('1627894483216-2138af692e32'), caption: 'Evening arati on the Ganga' },
  },
  {
    day: 3,
    title: 'The guardians of Kashi',
    route: [
      { place: 'Kalabhairava' },
      { place: 'Mahamrityunjaya' },
      { place: 'Markandeya Mahadev' },
      { place: 'Kashi’s silk weaves', when: 'Before dinner' },
    ],
    body: [
      'We spend the day at the Kalabhairava Temple, the powerful guardian deity of Kashi; the Mahamrityunjaya Temple, where it is believed one can conquer death; and the Markandeya Mahadev Temple, where the lore of the devotee Markandeya and Shiva unfolded.',
      'Before dinner, a special presentation of local weaves: a chance to take home one of Kashi’s handwoven silk masterpieces.',
    ],
    image: { src: k('ghat-palace'), caption: 'Old palaces along the ghats' },
  },
  {
    day: 4,
    title: 'To the Goddess at Vindhyachal',
    route: [
      // Vindhyachal is about 70 km from Varanasi by road
      { place: 'Vindhyavasini', travel: '~2 hrs by road' },
      { place: 'Saptarishi Arati', when: 'Evening', travel: 'Back to Kashi' },
    ],
    body: [
      'We travel to the Vindhyavasini Temple at Vindhyachal, the Shakti Peeth where, according to legend, Goddess Durga battled Mahishasura. Temples to Lakshmi, Kali and Saraswati are placed here to form a spiritually potent “Trikona.”',
      'In the evening we return to Kashi Vishwanath for the Saptarishi Arati, a process transmitted to the seven sages by Adiyogi himself and kept vibrantly alive to this day.',
    ],
    image: { src: u('1599831069477-b2acdc0bcb91'), caption: 'Fire offerings at dusk' },
  },
  {
    day: 5,
    title: 'Two Jyotirlingas and Guru Pooja',
    route: [{ place: 'Vaidyanath' }, { place: 'Mallikarjun Mahadeva' }, { place: 'Guru Pooja' }],
    body: [
      'Kashi holds representations of all twelve of India’s Jyotirlingas. We visit and meditate at two of them, Vaidyanath and Mallikarjun Mahadeva, recreated from the original forms in Deoghar and Srisailam.',
      'The programme culminates in Guru Pooja, an offering of gratitude to the great beings who have made the possibility of inner transformation available.',
    ],
    image: { src: k('dawn-boat'), caption: 'Dawn on the Ganga' },
  },
]

/**
 * The rhythm most days share, by time of day rather than by clock: the days
 * differ (Day 4 leaves the city, not every day starts before dawn), so
 * nothing here promises an hour.
 */
export type Moment = { when: string; title: string; body: string }

export const dayMoments: Moment[] = [
  { when: 'Before dawn', title: 'An early start', body: 'Some days begin in the dark, with arati at a temple while the city is still asleep.' },
  { when: 'Morning', title: 'Into the sacred spaces', body: 'By coach to the day’s first places, then on foot through temple lanes and down to the ghats.' },
  { when: 'Midday', title: 'A meal together', body: 'Simple vegetarian food, and a little time to rest before the afternoon.' },
  { when: 'Afternoon', title: 'Practice and more places', body: 'Meditations, chants or a satsang, alongside the rest of the day’s temples and ghats.' },
  { when: 'Evening', title: 'Lamps and arati', body: 'Most days close with an evening arati, on the river or in a temple, as the lamps are lit.' },
  { when: 'Night', title: 'An early night', body: 'Back to the hotel to rest. The next day may begin before dawn.' },
]

/*
 * Preparation. Requirements, rules and every packing item are Isha's own
 * (Program Guide and Prerequisites pages). What the days involve is read from
 * the official itinerary; the details around it come from public sources,
 * noted beside each:
 *  - Mangala Arati at Kashi Vishwanath runs about 3 – 4 am, with queues
 *    before the gates open (temple timing guides)
 *  - footwear comes off at the gate, arms and legs covered, no phones or
 *    smartwatches inside Kashi Vishwanath, lockers outside (temple visitor rules)
 *  - Varanasi in early December: ~8 – 10°C at dawn, low 20s by afternoon,
 *    dense fog on the river some mornings (weather-atlas.com, kashitaxi.in)
 */
export type Demand = { kicker: string; title: string; body: string }
export type PackItem = { item: string; why?: string }
export type PackGroup = { title: string; items: PackItem[] }

export const preparation = {
  lede: 'Kashi Krama is not a trek, but it isn’t a seated tour either.',
  demands: [
    {
      kicker: '3 am',
      title: 'Some days begin in the dark',
      body: 'Mangala Arati at Kashi Vishwanath is held around 3 am, and the group gathers before the gates open. Evenings close with arati too.',
    },
    {
      kicker: 'Barefoot',
      title: 'Shoes off at every temple',
      body: 'Nine temples in five days, each entered barefoot over stone floors, often after a queue.',
    },
    {
      kicker: 'On foot',
      title: 'Lanes, ghats and steps',
      body: 'The coach covers the longer distances. Between temples in the old city we walk narrow, crowded lanes and climb the ghat steps from the river.',
    },
    {
      kicker: 'Cross-legged',
      title: 'Long sittings on the floor',
      body: 'Meditations, satsangs and the closing Guru Pooja are all done seated on the ground.',
    },
  ] satisfies Demand[],
  prerequisites: [
    { title: 'Inner Engineering, completed', body: 'Including Shambhavi Mahamudra Kriya.' },
    { title: 'Fit in body and mind', body: 'Able to sit cross-legged on the ground and walk without difficulty.' },
  ],
  rules: [
    { title: 'Carry your ID', body: 'Passport, or a valid government ID for Indian nationals. Needed in travel and at hotel check-in.' },
    { title: 'Nothing that intoxicates', body: 'No cigarettes, e-cigarettes, alcohol or recreational drugs, for the whole sojourn.' },
    { title: 'No phones in Kashi Vishwanath', body: 'Phones and smartwatches stay in the lockers at the gate.' },
  ],
  packing: [
    {
      title: 'To wear',
      items: [
        { item: 'Footwear that slips on and off', why: 'It comes off at every gate' },
        { item: 'Clothes that cover arms and legs', why: 'A kurta, saree or salwar kameez is ideal' },
        { item: 'Warm shawl or jacket', why: 'Dawns are near 10°C, colder on the river' },
        { item: 'Sunglasses or a sun hat', why: 'Afternoons warm into the low 20s' },
        { item: 'Umbrella or raincoat' },
      ],
    },
    {
      title: 'To carry',
      items: [
        { item: 'Your ID' },
        { item: 'Yoga mat', why: 'For meditations and satsangs' },
        { item: 'Flashlight', why: 'For the pre-dawn starts' },
        { item: 'Water bottle and snacks', why: 'Queues and coach rides run long' },
        { item: 'Mosquito repellent', why: 'On the ghats at dusk' },
        { item: 'Hand sanitizer and toiletries' },
      ],
    },
  ] satisfies PackGroup[],
  medical: {
    ailments: ['Fever', 'Cold', 'Headache', 'Nausea and vomiting', 'Diarrhoea', 'Indigestion'],
    note: 'Plus anything for other common ailments. A doctor travels with the group.',
  },
}

export type Highlight = { title: string; body: string; icon: 'hotel' | 'meal' | 'doctor' }

export const cost = {
  // the three people ask about first, from the official Conveniences Offered page
  highlights: [
    { icon: 'hotel', title: '5-star hotel', body: 'Twin-sharing rooms for the whole yatra.' },
    { icon: 'meal', title: 'Vegetarian meals', body: 'Wholesome food at every meal, and mineral water through the day.' },
    { icon: 'doctor', title: 'A doctor with the group', body: 'Qualified and well equipped, travelling with you throughout.' },
  ] satisfies Highlight[],
  included: [
    'Air-conditioned coach travel',
    'Boat ride on the Ganga',
    'Entry fees for every place on the itinerary',
    'A dedicated Isha team, end to end',
    'A collection of photos after the yatra',
  ],
  // not on the official site; confirm before shipping
  excluded: ['Travel to and from Varanasi', 'Personal shopping, including the Banarasi weaves', 'Anything not listed as included'],
}

export type Faq = { q: string; a: string | string[] }

export const faqs: Faq[] = [
  {
    q: 'Who can join Kashi Krama?',
    a: 'Anyone who has completed Inner Engineering, including Shambhavi Mahamudra Kriya, and is physically and mentally fit: able to sit cross-legged on the ground and walk without difficulty.',
  },
  {
    q: 'What documents are required for this sojourn?',
    a: [
      'Government-issued ID. For Indian nationals: Aadhaar, Driver’s License, or Voter ID',
      'Passport and a copy of your Indian visa (for non-Indian nationals)',
      'Passport-size photo',
      'Letter of Indemnity / Waiver',
    ],
  },
  {
    q: 'What are some common mistakes made during registration?',
    a: [
      'Incomplete or incorrect information',
      'Uploading unclear photos or passport copies',
      'Uploading black and white photos or passport copies',
      'Missing signatures where required',
    ],
  },
  {
    q: 'Will the itinerary be exactly as listed?',
    a: 'The itinerary is indicative of the places we will visit. The actual order may vary depending on several factors.',
  },
  {
    q: 'Is this a tour?',
    a: 'No. Isha Sacred Walks is not a tour company. The sojourn is offered as a possibility for profound spiritual transformation, to experience these sacred places in their true depth and dimension.',
  },
  {
    q: 'How can I learn more about this sojourn?',
    a: 'Fill out the enquiry form and the team will send you further details, or call us directly.',
  },
]

/**
 * Every departure open for registration. The official table lists one,
 * 3 – 7 Dec 2026, run as two groups; add entries here as dates are announced.
 * Visitors never see the group codes: they pick the description that fits them.
 * seats / seatsLeft are PLACEHOLDERS: the official site doesn't publish them.
 */
export type Pool = {
  id: 'india' | 'international'
  /** the programme's internal code, kept for when registration takes it */
  group: string
  label: string
  who: string
  seats: number
  seatsLeft: number
}

export type Departure = {
  /** full form, e.g. for the hero */
  dates: string
  /** without the year, for headings and the CTA */
  short: string
  year: number
  days: number
  language: string
  pools: Pool[]
}

export const departures: Departure[] = [
  {
    dates: '3 – 7 Dec 2026',
    short: '3 – 7 Dec',
    year: 2026,
    days: 5,
    language: 'English',
    pools: [
      { id: 'india', group: 'A', label: 'Indian, living in India', who: 'Indian citizens residing in India', seats: 60, seatsLeft: 18 },
      // the official table only footnotes Group A; confirm who Group S is for
      { id: 'international', group: 'S', label: 'Everyone else', who: 'Other nationalities, or Indians living abroad', seats: 40, seatsLeft: 23 },
    ],
  },
]

/** the one hard prerequisite, beside every Register button */
export const innerEngineering = {
  title: 'Inner Engineering is required',
  body: 'Open only to those who have completed it, including Shambhavi Mahamudra Kriya.',
  link: { label: 'About Inner Engineering', href: 'https://www.innerengineering.com' },
}
