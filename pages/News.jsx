import { useMemo, useState } from 'react'
import { Asterisk, Flame, Image as ImageIcon, Satellite } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import { PageHeader, Reveal } from '../components/shared'
import { ARTICLES, NEWS_TABS } from '../data/content'
import { fetchApod, fetchEonetEvents, fetchNeoApproaches, useNasaQuery } from '../lib/nasa'

function NasaLiveStrip() {
  const neos = useNasaQuery(() => fetchNeoApproaches(7), [])
  const eonet = useNasaQuery(() => fetchEonetEvents(12), [])
  const apod = useNasaQuery(() => fetchApod(), [])

  if (neos.error && eonet.error && apod.error) return null
  const loading = neos.loading && eonet.loading && apod.loading

  const today = new Date().toISOString().slice(0, 10)
  const todaysCount = neos.data?.filter((n) => n.date === today).length ?? 0
  const closest = neos.data?.[0]

  const cells = [
    {
      icon: Asterisk,
      label: 'Near-Earth Objects (7d)',
      value: neos.data ? String(neos.data.length) : '—',
      sub: neos.data ? `${todaysCount} making close approach today` : 'NeoWs feed unavailable',
    },
    closest && {
      icon: Satellite,
      label: 'Closest Approach',
      value: closest.name,
      sub: `miss ${closest.missLunar.toFixed(1)} LD • ${closest.date}${closest.hazardous ? ' • PHA' : ''}`,
    },
    {
      icon: Flame,
      label: 'EONET Active Events',
      value: eonet.data ? String(eonet.data.length) : '—',
      sub: 'natural events tracked by NASA',
    },
    apod.data && {
      icon: ImageIcon,
      label: `APOD • ${apod.data.date}`,
      value: apod.data.title,
      sub: `image credit: ${apod.data.copyright}`,
    },
  ].filter(Boolean)

  return (
    <Reveal className="mt-8">
      <div className="glass-card grid gap-4 rounded-2xl p-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2.5 rounded-xl border border-white/[0.05] p-4">
                <div className="h-3 w-1/2 rounded bg-white/[0.06]" />
                <div className="h-6 w-3/4 rounded bg-white/[0.06]" />
                <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
              </div>
            ))
          : cells.map((c) => (
              <div key={c.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="mono-label flex items-center gap-1.5 text-slate-500">
                  <c.icon className="h-3.5 w-3.5 text-cyan-300" /> {c.label}
                </p>
                <p className="mt-2 truncate font-display text-lg font-bold text-white">{c.value}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{c.sub}</p>
              </div>
            ))}
      </div>
    </Reveal>
  )
}

export default function News() {
  const [tab, setTab] = useState('All')
  const filtered = useMemo(
    () => (tab === 'All' ? ARTICLES : ARTICLES.filter((a) => a.vertical === tab)),
    [tab],
  )
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <>
      <PageHeader label="Astrophysics & Exploration Dispatch" title="Mission" accent="Dispatches">
        Filtered signal from across the deep space network — peer-reviewed findings, mission updates, and breaking
        celestial events, decoded for ground crews.
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {NEWS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === t
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_18px_-4px_rgba(34,211,238,0.7)]'
                  : 'border border-white/10 text-slate-400 hover:border-cyan-300/40 hover:text-cyan-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <NasaLiveStrip />

        {featured && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <ArticleCard article={featured} index={0} />
            <div className="glass-card flex flex-col justify-center rounded-2xl p-8">
              <p className="mono-label text-cyan-300">Featured Analysis</p>
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-400">{featured.excerpt}</p>
              <p className="mt-6 text-sm text-slate-500">
                By <span className="text-slate-300">{featured.author}</span> • {featured.date}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </div>
    </>
  )
}
