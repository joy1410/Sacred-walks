import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { firstScreen } from './src/data/firstScreen'

/** runs in the page's <head>: preload this path's first-screen images (any other path is the homepage) */
function preloadFirstScreen(map: typeof firstScreen) {
  const path = location.pathname.replace(/\/+$/, '') || '/'
  for (const { href, media } of map[path] ?? map['/']) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = href
    if (media) link.media = media
    link.fetchPriority = 'high'
    document.head.append(link)
  }
}

const firstScreenPlugin: Plugin = {
  name: 'first-screen-preload',
  transformIndexHtml: () => [
    { tag: 'script', injectTo: 'head-prepend', children: `(${preloadFirstScreen})(${JSON.stringify(firstScreen)})` },
  ],
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), firstScreenPlugin],
})
