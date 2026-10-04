/**
 * Why Pilgrimage: Sadhguru on the purpose of journeying to a sacred space.
 * Text verbatim from Isha's page (SOURCE_URL), one string per paragraph.
 */
export const SOURCE_URL = 'https://isha.sadhguru.org/sacred-walks/why-pilgrimage'

export const hero = {
  label: 'Sadhguru on pilgrimage',
  title: 'Why do people go on pilgrimages?',
  lede: 'Sadhguru looks at the significance and purpose behind making a journey to a sacred space.',
  image: { src: '/images/journey/care.webp', caption: 'On the trail to Kailash' },
}

/** the article's four movers, set as lines: only the pilgrim's is at full strength */
export const movers = [
  { who: 'The explorer', why: 'goes to prove something.' },
  { who: 'The traveller', why: 'goes to see everything.' },
  { who: 'The tourist', why: 'goes to relax, or to escape.' },
  { who: 'The pilgrim', why: 'goes to', accent: 'surrender.' },
] as const

export type Part = {
  id: string
  label: string
  title: string
  paragraphs: string[]
}

export const parts: Part[] = [
  {
    id: 'pilgrim',
    label: 'Travel, a journey, a pilgrimage',
    title: 'A surrender, not a conquest',
    paragraphs: [
      'What is the difference between travel, a journey and a pilgrimage? People move from one place to another for a variety of reasons. There are explorers who are always looking for virgin land that they want to put their footprint on. They want to prove something. There are travelers who are curious to see everything, so they travel. There are tourists who just go to relax. There are other kinds of tourists who just go to escape from their work or family. But a pilgrim is not going for any of these purposes.',
      'A pilgrimage is not a conquest, it is a surrender. It is a way of getting yourself out of the way. If you do not budge, it is a way of wearing yourself out. A process of destroying all that is limited and compulsive and arriving to a boundless state of consciousness.',
    ],
  },
  {
    id: 'subduing',
    label: 'The idea behind it',
    title: 'Subduing who you are',
    paragraphs: [
      'The very idea behind a pilgrimage is fundamentally to subdue the sense of who you are. It is to become nothing in the process of just walking and climbing and subjecting yourself to various arduous processes of nature. In the ancient past, to get to such places, a person had to go through a certain amount of physical, mental, and every kind of hardship, so that he becomes less than who he thinks he is right now. Today things have been made much more comfortable. We are flying up, driving down and just walking a little bit.',
      'Physically, we are much weaker human beings than what they used to be a thousand years ago because somewhere we do not know how to make use of the comforts and conveniences for our wellbeing. We have used them to make ourselves weaker, at more difficulty with ourselves and with the surroundings in which we exist. So the fundamental idea of pilgrimage becomes all the more relevant to modern societies than it was to the ancient ones.',
      'Hardship is not necessary but most people are unwilling to dissolve, so you have to wear them down. It is unfortunate that most human beings cannot grow in comfort. It would be wonderful to grow in comfort but unfortunately, most human beings become frivolous when there is comfort. Some profoundness comes to them only when there is hardship. But it need not be so. Something else need not beat us down. We must have the sense to understand that if we want to experience something larger than ourselves and touch dimensions which are not yet in our perception, the most important thing is that the sense of who you are should go down.',
    ],
  },
  {
    id: 'life',
    label: 'Beyond the walk',
    title: 'Make your life a pilgrimage',
    paragraphs: [
      'If you have a working head, you would make your life into a pilgrimage. If your life is not a constant process of reaching for something higher than where you are right now, what kind of life is that? If this life is not constantly longing for something higher than what it is, that is not much of a life. If you are aspiring and working towards something higher, then your life is a pilgrimage.',
    ],
  },
]

/** the article's closing words, set large and signed */
export const closing = [
  'A trek or a mountaineering feat is always about achievement, to make yourself bigger than who you are.',
  'But a pilgrimage is about dissolution, to subdue yourself and become nothing, No-thing.',
]

/** a photograph between the second and third parts */
export const interlude = { src: '/images/journey/inward.webp', caption: 'On the shores of Manasarovar' }
