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
 *  - the "day in the yatra" timings, which are indicative
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

export type Day = {
  day: number
  title: string
  places: string[]
  body: string[]
  image: { src: string; caption: string }
}

export const itinerary: Day[] = [
  {
    day: 1,
    title: 'Where the Buddha first spoke',
    places: ['Sarnath'],
    body: [
      'We begin with a visit to Sarnath, where Gautama the Buddha gave his first sermon after his enlightenment. This momentous event is depicted in beautifully crafted sculptures and monuments across the site.',
    ],
    image: { src: k('sarnath'), caption: 'Mulagandha Kuti Vihara, Sarnath' },
  },
  {
    day: 2,
    title: 'Mangala Arati and the river',
    places: ['Kashi Vishwanath', 'Vishalakshi', 'Annapoorni', 'Manikarnika Ghat'],
    body: [
      'The day starts early with Mangala Arati at the Kashi Vishwanath Temple, one of the twelve Jyotirlingas, said to have been consecrated by Shiva himself. We then walk to the Vishalakshi Temple, one of the Shakti Sthalas, and the Annapoorni Temple.',
      'A journey through Kashi is not complete without Manikarnika Ghat, its most sacred cremation ground. We take a boat along the Ganga and join the spectacular evening arati.',
    ],
    image: { src: u('1627894483216-2138af692e32'), caption: 'Evening arati on the Ganga' },
  },
  {
    day: 3,
    title: 'The guardians of Kashi',
    places: ['Kalabhairava', 'Mahamrityunjaya', 'Markandeya Mahadev'],
    body: [
      'We spend the day at the Kalabhairava Temple, the powerful guardian deity of Kashi; the Mahamrityunjaya Temple, where it is believed one can conquer death; and the Markandeya Mahadev Temple, where the lore of the devotee Markandeya and Shiva unfolded.',
      'Before dinner, a special presentation of local weaves: a chance to take home one of Kashi’s handwoven silk masterpieces.',
    ],
    image: { src: k('ghat-palace'), caption: 'Old palaces along the ghats' },
  },
  {
    day: 4,
    title: 'To the Goddess at Vindhyachal',
    places: ['Vindhyavasini', 'Saptarishi Arati'],
    body: [
      'We travel to the Vindhyavasini Temple at Vindhyachal, the Shakti Peeth where, according to legend, Goddess Durga battled Mahishasura. Temples to Lakshmi, Kali and Saraswati are placed here to form a spiritually potent “Trikona.”',
      'In the evening we return to Kashi Vishwanath for the Saptarishi Arati, a process transmitted to the seven sages by Adiyogi himself and kept vibrantly alive to this day.',
    ],
    image: { src: u('1599831069477-b2acdc0bcb91'), caption: 'Fire offerings at dusk' },
  },
  {
    day: 5,
    title: 'Two Jyotirlingas and Guru Pooja',
    places: ['Vaidyanath', 'Mallikarjun Mahadeva', 'Guru Pooja'],
    body: [
      'Kashi holds representations of all twelve of India’s Jyotirlingas. We visit and meditate at two of them, Vaidyanath and Mallikarjun Mahadeva, recreated from the original forms in Deoghar and Srisailam.',
      'The programme culminates in Guru Pooja, an offering of gratitude to the great beings who have made the possibility of inner transformation available.',
    ],
    image: { src: k('dawn-boat'), caption: 'Dawn on the Ganga' },
  },
]

export type Moment = { time: string; title: string; body: string }

/** an indicative day, drawn from the itinerary; real timings vary day to day */
export const dayMoments: Moment[] = [
  { time: '3:30', title: 'Before the city wakes', body: 'Some days begin in the dark, walking through quiet lanes to Mangala Arati at Kashi Vishwanath.' },
  { time: '6:30', title: 'Morning sadhana', body: 'Practices together as the light comes up, to meet the day’s places with a settled body and mind.' },
  { time: '9:00', title: 'Into the sacred spaces', body: 'By air-conditioned coach and on foot through the galis, to the temples and ghats of the day.' },
  { time: '13:00', title: 'A meal and a pause', body: 'Wholesome vegetarian food, then time to rest in the heat of the afternoon.' },
  { time: '16:30', title: 'Meditation & satsang', body: 'Chants, guided meditations and satsang bring an inner dimension to everything seen.' },
  { time: '18:30', title: 'Evening on the Ganga', body: 'Boats, lamps and arati as the river turns gold, then the walk back through the lit city.' },
]

export const preparation = {
  difficultyLabel: 'Gentle',
  summary:
    'Kashi Krama is a gentle yatra on foot through temple lanes and ghat steps, with travel by coach in between. What it asks of you is readiness, inside and out.',
  requirements: [
    {
      title: 'Medical fitness',
      body: 'Physical and mental fitness are essential. You should be able to sit cross-legged on the ground and walk without difficulty.',
    },
    {
      title: 'Travel guidelines',
      body: 'Carry your passport, or a valid government ID for Indian nationals, for travel and hotel check-in. Cigarettes, e-cigarettes, alcohol and recreational drugs are strictly prohibited throughout.',
    },
  ],
  packing: [
    'Personal clothing',
    'Warm shawl or jacket',
    'General footwear',
    'Water bottle',
    'Sunglasses / sun hat',
    'Umbrella / raincoat',
    'Yoga mat',
    'Mosquito repellent',
    'Hand sanitizer',
    'Toiletries',
    'Flashlight',
    'Snacks',
  ],
  medicalKit:
    'with essential medications for fever, cold, headache, nausea, vomiting, diarrhoea, indigestion and other common ailments.',
}

export type Convenience = { title: string; body: string; icon: 'hotel' | 'meal' | 'bus' | 'doctor' | 'team' | 'boat' }

export const stay: Convenience[] = [
  { icon: 'hotel', title: '5-star hotel', body: 'Accommodation on a twin-sharing basis.' },
  { icon: 'meal', title: 'Vegetarian meals', body: 'Wholesome meals and mineral water throughout.' },
  { icon: 'bus', title: 'Air-conditioned coach', body: 'All travel between the sacred sites.' },
  { icon: 'boat', title: 'On the Ganga', body: 'A boat ride on the holy river.' },
  { icon: 'doctor', title: 'A doctor with the group', body: 'Qualified and well equipped, for the whole yatra.' },
  { icon: 'team', title: 'A dedicated Isha team', body: 'The sojourn is conducted and managed end to end.' },
]

export const cost = {
  included: [
    '5-star stay, twin sharing',
    'Vegetarian meals & mineral water',
    'Air-conditioned coach travel',
    'Boat ride on the Ganga',
    'Entry fees for every place on the itinerary',
    'Accompanying doctor & Isha team',
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
 * 3 – 7 Dec 2026, run as two groups; add rows here as dates are announced.
 * seatsLeft / seats are PLACEHOLDERS: the official site doesn't publish them.
 */
export type Departure = {
  dates: string
  month: string
  group: string
  who: string
  language: string
  seats: number
  seatsLeft: number
}

export const departures: Departure[] = [
  { dates: '3 – 7 Dec 2026', month: 'December', group: 'A', who: 'For Indians residing in India', language: 'English', seats: 60, seatsLeft: 18 },
  // the official table only footnotes Group A; confirm who Group S is for
  { dates: '3 – 7 Dec 2026', month: 'December', group: 'S', who: 'For all other participants', language: 'English', seats: 40, seatsLeft: 23 },
]

/** the one hard prerequisite, shown where people decide to register */
export const innerEngineering = {
  title: 'Inner Engineering is mandatory',
  body: 'Completion of Inner Engineering, including Shambhavi Mahamudra Kriya, is a prerequisite for this sojourn.',
  link: { label: 'About Inner Engineering', href: 'https://www.innerengineering.com' },
}
