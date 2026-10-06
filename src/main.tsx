import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// marks every image once it has loaded (or failed), so index.css can stop its shimmer.
// load and error don't bubble, so listen in the capture phase, once, for the whole page
const markLoaded = (e: Event) => {
  if (e.target instanceof HTMLImageElement) e.target.dataset.loaded = ''
}
document.addEventListener('load', markLoaded, true)
document.addEventListener('error', markLoaded, true)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
