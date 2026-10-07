import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Gauge, Radar, Rocket, Satellite, Telescope, Zap } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import { Reveal, SectionLabel, StatusDot } from '../components/shared'
import { ARTICLES, NEWS_TABS } from '../data/content'
import { useCountUp, useNow } from '../hooks'
import { fetchApod, useNasaQuery } from '../lib/nasa'

function StatCard({ icon: Icon, label, children, sub, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="glass-card rounded-2xl p-5 transition-shadow duration-300 hover:shadow-[0_8px_40px_-10px_rgba(34,211,238,0.3)]">
        <div className="flex items-center justify-between">
          <p className="mono-label text-slate-500">{label}</p>
          <Icon className="h-4 w-4 text-cyan-300" />
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">{children}</div>
        {sub && <div className="mt-2">{sub}</div>}
      </div>
    </Reveal>
  )
}

function Hero() {
  const velocity = useCountUp(27580)
  const jwstKm = useCountUp(1512, { duration: 2200 })
  const now = useNow(1000)

  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/hero-nebula.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-abyss/60 via-abyss/30 to-abyss" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-cyan-300/20 bg-cyan-400/[0.07] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            <StatusDot />
            Live orbital telemetry connected • SOL-492
            <span className="hidden text-slate-500 sm:inline">| DSN 34M DSS-43 ACT</span>
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-8 text-center font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Explore the <br className="hidden sm:block" />
          <span className="text-gradient">Infinite Cosmos</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Your gateway to deep space discovery, real-time orbital tracking, interplanetary science telemetry, and
          interactive 3D astrophysics simulations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <Link to="/solar-system" className="btn-primary w-full sm:w-auto">
            <Rocket className="h-4.5 w-4.5" />
            Launch 3D Solar System
          </Link>
          <Link to="/tracker" className="btn-ghost w-full sm:w-auto">
            <Radar className="h-4.5 w-4.5 text-cyan-300" />
            View Live Missions
          </Link>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
          <StatCard icon={Gauge} label="ISS Orbital Velocity" delay={0.1}>
            <p className="font-display text-3xl font-bold text-white tabular-nums">
              {Math.round(velocity).toLocaleString()}
              <span className="ml-1.5 text-sm font-medium text-slate-500">km/h</span>
            </p>
          </StatCard>
          <StatCard
            icon={Satellite}
            label="JWST Position (L2)"
            delay={0.2}
            sub={<p className="font-mono text-[11px] tracking-widest text-emerald-400">SIGNAL LOCKED • {now.toUTCString().slice(17, 25)} UTC</p>}
          >
            <p className="font-display text-3xl font-bold text-white tabular-nums">
              {(jwstKm / 1000).toFixed(3)}
              <span className="ml-1.5 text-sm font-medium text-slate-500">M km</span>
            </p>
          </StatCard>
          <StatCard
            icon={Activity}
            label="Space Weather Alert"
            delay={0.3}
            sub={<span className="chip bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/25">Moderate</span>}
          >
            <div>
              <p className="font-display text-3xl font-bold text-white">M3.4</p>
              <p className="text-sm font-medium text-amber-300">Flare</p>
            </div>
          </StatCard>
        </div>
      </div>
    </section>
  )
}

function Discoveries() {
  const [tab, setTab] = useState('All')
  const filtered = useMemo(
    () => (tab === 'All' ? ARTICLES : ARTICLES.filter((a) => a.vertical === tab)),
    [tab],
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Astrophysics & Exploration Dispatch</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Latest Discoveries & <span className="text-gradient">Space Science</span>
          </h2>
        </div>
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
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a, i) => (
          <ArticleCard key={a.slug} article={a} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-slate-500">No dispatches in this channel yet. Signal scanning…</p>
      )}
    </section>
  )
}

function ApodSection() {
  const { data, loading, error } = useNasaQuery(() => fetchApod(), [])

  if (error || (!loading && (!data || data.mediaType !== 'image'))) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-[380px]">
              {loading || !data ? (
                <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
              ) : (
                <img
                  src={data.url}
                  alt={data.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="mono-label flex items-center gap-2 text-cyan-300">
                <Telescope className="h-3.5 w-3.5" />
                Astronomy Picture of the Day • NASA APOD
              </p>
              {loading || !data ? (
                <div className="mt-4 space-y-3">
                  <div className="h-7 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-3.5 w-full animate-pulse rounded bg-white/[0.04]" />
                  <div className="h-3.5 w-5/6 animate-pulse rounded bg-white/[0.04]" />
                </div>
              ) : (
                <>
                  <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                    {data.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
                    {data.explanation.slice(0, 340)}
                    {data.explanation.length > 340 ? '…' : ''}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <span className="chip bg-white/[0.04] font-mono text-slate-300 ring-1 ring-white/10">{data.date}</span>
                    <span className="chip bg-white/[0.04] font-mono text-slate-500 ring-1 ring-white/10">
                      Image Credit: {data.copyright}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <ApodSection />
      <Discoveries />
    </>
  )
}
