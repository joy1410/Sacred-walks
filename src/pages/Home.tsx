import Hero from '../components/hero/Hero'
import QuoteSection from '../components/QuoteSection'
import YatraSection from '../components/yatras/YatraSection'
import JourneySection from '../components/journey/JourneySection'
import StoriesSection from '../components/StoriesSection'
import WhyPilgrimageTeaser from '../components/WhyPilgrimageTeaser'
import PhotoStrip from '../components/PhotoStrip'
import FinalCta from '../components/FinalCta'

export default function Home() {
  return (
    <main>
      <Hero />
      <QuoteSection />
      <YatraSection />
      <JourneySection />
      <StoriesSection />
      <WhyPilgrimageTeaser />
      <PhotoStrip />
      <FinalCta />
    </main>
  )
}
