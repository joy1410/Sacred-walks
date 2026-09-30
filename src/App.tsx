import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
import Nav from './components/Nav'
import Home from './pages/Home'

function ScrollReset() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenis])
  return null
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9 }} />
      <ScrollReset />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </MotionConfig>
  )
}
