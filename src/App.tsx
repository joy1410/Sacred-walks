import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
import AmbientLight from './components/AmbientLight'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import KashiKrama from './pages/KashiKrama'
import WhyPilgrimage from './pages/WhyPilgrimage'

function ScrollReset() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    // arriving from another page at a section (/#yatras): go there once it has rendered
    if (!hash) return
    const id = window.setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (!el) return
      // yatra pages carry a section bar under the nav (48 + 52), less the section's own 16px gutter
      const offset = pathname.startsWith('/yatras/') ? -84 : 0
      if (lenis) lenis.scrollTo(el, { immediate: true, offset })
      else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + offset)
    }, 60)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on page change
  }, [pathname, lenis])
  return null
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9 }} />
      <ScrollReset />
      <AmbientLight />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/yatras/kashi-krama" element={<KashiKrama />} />
        <Route path="/why-pilgrimage" element={<WhyPilgrimage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </MotionConfig>
  )
}
