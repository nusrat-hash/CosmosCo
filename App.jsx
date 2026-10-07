import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Starfield from './components/Starfield'
import Home from './pages/Home'
import News from './pages/News'
import ArticleDetail from './pages/ArticleDetail'
import Tracker from './pages/Tracker'
import SolarSystem from './pages/SolarSystem'
import StudentHub from './pages/StudentHub'
import Gallery from './pages/Gallery'
import Calendar from './pages/Calendar'
import LiveFeed from './pages/LiveFeed'
import SignalLost from './pages/SignalLost'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-48 left-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-48 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -bottom-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600/[0.07] blur-[120px]" />
      </div>

      <Navbar />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<ArticleDetail />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/student-hub" element={<StudentHub />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/live-feed" element={<LiveFeed />} />
          <Route path="*" element={<SignalLost />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
