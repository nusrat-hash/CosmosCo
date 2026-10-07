import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Images as ImagesIcon, Satellite, X } from 'lucide-react'
import MediaSection from '../components/MediaSection'
import { PageHeader } from '../components/shared'
import { MEDIA_ITEMS, MEDIA_TABS } from '../data/content'
import { searchNasaMedia, useNasaQuery } from '../lib/nasa'

const NASA_QUERIES = {
  'All Imagery': 'james webb space telescope nebula',
  'Galaxies & Clusters': 'spiral galaxy hubble',
  'Star-Forming Nebulae': 'emission nebula jwst',
  'Solar System': 'planets solar system',
}

export default function Gallery() {
  const [tab, setTab] = useState(MEDIA_TABS[0])
  const [lightbox, setLightbox] = useState(null)

  const { data, loading, error } = useNasaQuery(() => searchNasaMedia(NASA_QUERIES[tab] || NASA_QUERIES['All Imagery'], 9), [tab])

  const live = !error && Array.isArray(data) && data.length > 0
  const items = live
    ? data.map((d, i) => ({
        ...d,
        category: tab,
        wide: i % 4 === 0,
        tall: i % 4 === 2,
      }))
    : MEDIA_ITEMS

  const step = useCallback(
    (dir) => setLightbox((cur) => (cur === null ? cur : (cur + dir + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    setLightbox(null)
  }, [tab])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, step])

  return (
    <>
      <PageHeader label="Captured Light Archive" title="Deep Sky" accent="Gallery">
        High-resolution captures pulled live from the NASA Image and Video Library — each frame tagged with its
        mission center and capture date. Select any capture to open the full-resolution viewer.
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <Satellite className={`h-4 w-4 ${live ? 'text-emerald-300' : 'text-amber-300'}`} />
          {live
            ? 'LIVE FEED • images-api.nasa.gov (no key required)'
            : 'NASA library unreachable — showing cached archive frames'}
        </div>

        <MediaSection
          items={items}
          tab={tab}
          onTabChange={setTab}
          loading={loading}
          onOpen={(item) => setLightbox(items.indexOf(item))}
        />

        <div className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-sm text-slate-500">
          <ImagesIcon className="h-4 w-4 text-cyan-300" />
          {items.length} frames in archive • click any capture to expand
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-abyss/90 p-4 backdrop-blur-md sm:p-10"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:text-white"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:text-white sm:left-8"
              onClick={(e) => { e.stopPropagation(); step(-1) }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[lightbox].src}
                alt={items[lightbox].title}
                className="max-h-[70vh] w-full rounded-2xl object-contain ring-1 ring-white/15"
              />
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold text-white">{items[lightbox].title}</p>
                  <p className="mono-label mt-1 text-slate-500">
                    {items[lightbox].instrument} • {items[lightbox].category} • FRAME {String(lightbox + 1).padStart(2, '0')}
                  </p>
                </div>
                {items[lightbox].distance && (
                  <span className="chip bg-white/[0.04] font-mono text-cyan-300 ring-1 ring-cyan-300/25">
                    {items[lightbox].distance}
                  </span>
                )}
              </figcaption>
            </motion.figure>
            <button
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:text-white sm:right-8"
              onClick={(e) => { e.stopPropagation(); step(1) }}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
