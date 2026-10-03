import { useEffect } from 'react'
import KashiHero from '../components/kashi/KashiHero'
import SectionNav from '../components/kashi/SectionNav'
import Departures from '../components/kashi/Departures'
import AboutKashi from '../components/kashi/AboutKashi'
import Itinerary from '../components/kashi/Itinerary'
import DayInYatra from '../components/kashi/DayInYatra'
import Preparation from '../components/kashi/Preparation'
import Cost from '../components/kashi/Cost'
import Faqs from '../components/kashi/Faqs'
import Registration from '../components/kashi/Registration'
import OtherYatras from '../components/yatras/OtherYatras'

export default function KashiKrama() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Kashi Krama — Isha Sacred Walks'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <main>
      <KashiHero />
      <SectionNav />
      <Departures />
      <AboutKashi />
      <Itinerary />
      <DayInYatra />
      <Preparation />
      <Cost />
      <Faqs />
      <Registration />
      <OtherYatras current="kashi-krama" />
    </main>
  )
}
