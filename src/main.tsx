import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './index.css'
import BlogPage from './pages/BlogPage'
import Home from './pages/Home'
import NihongoPage from './pages/NihongoPage'

// Each HTML page (index.html, blog/index.html, nihongo/index.html) says which page it is.
const pages = { home: Home, blog: BlogPage, nihongo: NihongoPage }
const Page = pages[document.body.dataset.page as keyof typeof pages] ?? Home

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
