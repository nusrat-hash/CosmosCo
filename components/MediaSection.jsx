import { useState } from 'react'
import { Database } from 'lucide-react'
import { MEDIA_TABS } from '../data/content'
import { Reveal } from './shared'

function SkeletonCard({ tall }) {
  return (
    <div className="break-inside-avoid overflow-hidden rounded-2xl bg-panel ring-1 ring-white/[0.06]">
      <div className={`animate-pulse bg-white/[0.04] ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
      <div className="space-y-2.5 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
      </div>
    </div>
  )
}

export default function MediaSection({ items, onOpen, tab: tabProp, onTabChange, loading = false }) {
  const [internalTab, setInternalTab] = useState(MEDIA_TABS[0])
  const tab = tabProp ?? internalTab
  const setTab = onTabChange ?? setInternalTab

  const filtered = tab === MEDIA_TABS[0] ? items : items.filter((m) => m.category === tab)

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-2">
        {MEDIA_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              tab === t
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-white/[0.03] text-slate-300 ring-1 ring-white/10 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-7 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`skel-${i}`} tall={i % 3 === 1} />
          ))}

        {!loading &&
          filtered.map((m, i) => (
            <Reveal key={m.id || m.title} delay={(i % 3) * 0.05} className="break-inside-avoid">
              <button
                onClick={() => onOpen && onOpen(m)}
                className="group block w-full overflow-hidden rounded-2xl bg-panel ring-1 ring-white/[0.06] transition hover:ring-cyan-300/30"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={m.src}
                    alt={m.title}
                    loading="lazy"
                    className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                      m.wide ? 'aspect-[16/10]' : m.tall ? 'aspect-[4/5]' : 'aspect-[4/3]'
                    }`}
                  />
                  <span className="chip absolute left-3 top-3 bg-abyss/70 font-mono uppercase text-cyan-300 ring-1 ring-cyan-300/25 backdrop-blur">
                    {m.instrument}
                  </span>
                </div>
                <div className="p-5 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip bg-white/[0.04] text-slate-300 ring-1 ring-white/10">{m.category}</span>
                    {m.distance && (
                      <span className="chip bg-white/[0.04] font-mono text-slate-400 ring-1 ring-white/10">
                        {m.distance}
                      </span>
                    )}
                    {m.date && (
                      <span className="chip bg-white/[0.04] font-mono text-slate-500 ring-1 ring-white/10">{m.date}</span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white transition group-hover:text-cyan-300">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{m.caption}</p>
                </div>
              </button>
            </Reveal>
          ))}
      </div>

      <Reveal className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2.5 text-sm text-slate-400">
          <Database className="h-4 w-4 shrink-0 text-cyan-300" />
          Imagery served from the NASA Image and Video Library (images-api.nasa.gov) — free, no API key required.
        </p>
        <div className="flex shrink-0 gap-2.5">
          <a
            href="https://images.nasa.gov/"
            target="_blank"
            rel="noreferrer"
            className="btn-primary !px-4 !py-2 text-xs"
          >
            Browse Archive
          </a>
          <a
            href="https://images.nasa.gov/docs/"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !px-4 !py-2 text-xs"
          >
            API Docs
          </a>
        </div>
      </Reveal>
    </div>
  )
}
