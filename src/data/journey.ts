/**
 * One panel of "More than a journey": what sets an Isha yatra apart,
 * each told over a photograph of it happening.
 */
export type Beat = {
  /** short label for the progress rail */
  short: string
  title: string
  body: string
  image: { src: string; caption: string }
}

/* Photos are Isha's own, from the yatra galleries on isha.sadhguru.org/sacred-walks. */
export const beats: Beat[] = [
  {
    short: 'Turn inwards',
    title: 'Opportunity to turn inwards',
    body: 'More than seeing a sacred place, the journey is designed to help you experience it.',
    image: { src: '/images/journey/inward.webp', caption: 'On the shores of Manasarovar' },
  },
  {
    short: 'Meditation',
    title: 'Meditation & satsangs',
    body: 'Guided practices and satsangs accompany the journey, bringing a dimension of inner exploration to every destination.',
    image: { src: '/images/kashi/satsang.webp', caption: 'Lost in a satsang' },
  },
  {
    short: 'Beyond usual',
    title: 'Go beyond the usual',
    body: 'Access revered temples and lesser-known sacred spaces beyond the conventional pilgrimage route.',
    image: { src: '/images/journey/beyond.webp', caption: 'Carved sanctum doorway, Southern Sojourn' },
  },
  {
    short: 'Meals',
    title: 'Wholesome meals',
    body: 'Vegetarian meals and hydration are taken care of throughout the journey, so you can stay focused on the experience.',
    image: { src: '/images/journey/meals.webp', caption: 'A meal on the Kailash yatra' },
  },
  {
    short: 'Care',
    title: 'Care along the way',
    body: "A dedicated Isha team and medical support to take care of the journey's practical needs.",
    image: { src: '/images/journey/care.webp', caption: 'On the trail to Kailash' },
  },
]

export type Story = {
  name: string
  text: string
  image?: { src: string; caption: string }
}

/*
 * Testimonials and photos are verbatim from the "Experience & Sharing" section
 * of isha.sadhguru.org/sacred-walks, in the site's order.
 */
export const stories: Story[] = [
  {
    name: 'Shivali',
    text: 'I enjoyed the Kailash sojourn thoroughly. Seeing all the participants go through the 14 days with utmost bliss and devotion really touched me. The volunteers were all wonderful! I hope everyone gets an opportunity to experience this and be touched by his grace.',
    image: { src: '/images/stories/shivali.webp', caption: 'Yatris wrapped up against the snow on the Kailash route' },
  },
  {
    name: 'Azniv',
    text: 'Kailash – a journey of a lifetime! This experience cannot be put into words; it has to be experienced.',
    image: { src: '/images/stories/azniv.webp', caption: 'Sitting in stillness on a suspension bridge in Nepal' },
  },
  {
    name: 'Sandesh',
    text: 'Each and every place that we visited has its own reverberations. And yes, there were things I witnessed that are still unfathomable to me, but I am grateful that I got a chance to experience them in person.',
    image: { src: '/images/stories/sandesh.webp', caption: 'Yatris chanting together, hands folded in devotion' },
  },
]
