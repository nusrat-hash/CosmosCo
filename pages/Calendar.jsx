import { useMemo, useState } from 'react'
import { CalendarDays, CalendarPlus, Sparkles } from 'lucide-react'
import { PageHeader, Reveal } from '../components/shared'
import { CALENDAR_UPCOMING, EVENTS, EVENT_TYPES } from '../data/content'
import { fetchNeoApproaches, useNasaQuery } from '../lib/nasa'

const MONTH = 'October 2026'
const DAYS_IN_MONTH = 31
const FIRST_WEEKDAY = 4 // Thursday (0 = Sunday)
const TODAY = 7

const HEADLINE_IMAGES = [
  '/images/calendar-comet.png',
  '/images/gallery-saturn.png',
  '/images/calendar-eclipse.png',
  '/images/article-deepsky.png',
]

export default function Calendar() {
  const [selected, setSelected] = useState(TODAY)
  const { data: neos, error: neoError } = useNasaQuery(() => fetchNeoApproaches(7), [])

  const liveHeadlines =
    !neoError && Array.isArray(neos) && neos.length
      ? neos.slice(0, 4).map((n, i) => {
          const days = Math.max(
            0,
            Math.round((new Date(`${n.date}T00:00:00`) - new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00`)) / 86400000),
          )
          return {
            days,
            date: n.date.slice(5).replace('-', ' / '),
            title: n.name,
            blurb: `Close approach at ${(n.velocityKph / 1000).toFixed(1)}k km/h relative velocity${
              n.hazardous ? ' — flagged potentially hazardous.' : '.'
            } Tracked by the NASA near-Earth object observation program.`,
            statLabel: 'Miss Distance',
            statValue: `${n.missLunar.toFixed(1)} LD`,
            image: HEADLINE_IMAGES[i % HEADLINE_IMAGES.length],
            hazardous: n.hazardous,
          }
        })
      : null
  const headlines = liveHeadlines || CALENDAR_UPCOMING

  const cells = useMemo(() => {
    const arr = Array(FIRST_WEEKDAY).fill(null)
    for (let d = 1; d <= DAYS_IN_MONTH; d++) arr.push(d)
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [])

  const upcoming = useMemo(
    () =>
      Object.entries(EVENTS)
        .filter(([day]) => Number(day) >= TODAY)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .slice(0, 5),
    [],
  )

  const selectedEvents = EVENTS[selected] || []

  return (
    <>
      <PageHeader label="Astronomical Ephemeris" title="Celestial Calendar &" accent="Upcoming Events">
        A month of observable sky events for October 2026 — meteor showers, lunar phases, conjunctions, and station
        passes, plus the season's headline events with live countdowns. Times shown in local apparent time.
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="mono-label text-cyan-300">
            Headline Events — Countdown Active
            <span className="ml-2.5 text-slate-500">
              {liveHeadlines ? '• synced with NASA NeoWs' : '• cached ephemeris'}
            </span>
          </p>
          <button className="btn-ghost hidden items-center gap-1.5 !px-4 !py-2 text-xs sm:flex">
            <CalendarPlus className="h-3.5 w-3.5" /> Sync with Google Calendar / iCal
          </button>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {headlines.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.07}>
              <article className="group glass-card overflow-hidden rounded-2xl transition hover:ring-cyan-300/25">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-transparent to-transparent" />
                  <span
                    className={`chip absolute left-3 top-3 bg-abyss/70 font-mono backdrop-blur ${
                      e.hazardous ? 'text-rose-300 ring-1 ring-rose-300/30' : 'text-amber-300 ring-1 ring-amber-300/30'
                    }`}
                  >
                    {e.days === 0 ? 'TODAY' : `T-${e.days} DAYS`}
                  </span>
                </div>
                <div className="p-5">
                  <p className="mono-label text-slate-500">{e.date}</p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-white">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{e.blurb}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                    <span className="mono-label text-slate-500">{e.statLabel}</span>
                    <span className="font-mono text-sm font-semibold text-cyan-300">{e.statValue}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1.7fr_1fr] lg:px-8">
        <Reveal>
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-white">
                <CalendarDays className="h-5 w-5 text-cyan-300" />
                {MONTH}
              </h2>
              <span className="chip bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/25">
                <Sparkles className="h-3.5 w-3.5" /> 12 events
              </span>
            </div>

            <div className="grid grid-cols-7 border-b border-white/[0.06]">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                <div key={d} className="px-2 py-3 text-center font-mono text-[10px] tracking-[0.2em] text-slate-500">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                const evts = day ? EVENTS[day] || [] : []
                const isToday = day === TODAY
                const isSelected = day === selected
                return (
                  <button
                    key={i}
                    disabled={!day}
                    onClick={() => day && setSelected(day)}
                    className={`relative min-h-[88px] border-b border-r border-white/[0.04] p-2 text-left transition ${
                      !day ? 'cursor-default' : isSelected ? 'bg-cyan-400/[0.08]' : 'hover:bg-white/[0.03]'
                    } ${i % 7 === 6 ? 'border-r-0' : ''}`}
                  >
                    {day && (
                      <>
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full text-sm font-medium ${
                            isToday
                              ? 'bg-cyan-400 font-bold text-slate-950 shadow-[0_0_16px_-2px_rgba(34,211,238,0.8)]'
                              : isSelected
                                ? 'bg-white/10 text-white'
                                : 'text-slate-300'
                          }`}
                        >
                          {day}
                        </span>
                        <div className="mt-1.5 space-y-1">
                          {evts.slice(0, 2).map((e, j) => (
                            <p key={j} className="truncate rounded px-1 py-0.5 text-[10px] leading-tight" style={{ color: EVENT_TYPES[e.type].color, backgroundColor: EVENT_TYPES[e.type].color + '14' }}>
                              {e.title.split('—')[0].split('(')[0].trim()}
                            </p>
                          ))}
                          {evts.length > 2 && <p className="px-1 text-[10px] text-slate-500">+{evts.length - 2} more</p>}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-4 border-t border-white/[0.06] px-6 py-3.5">
              {Object.entries(EVENT_TYPES).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v.color }} />
                  {v.label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1}>
            <div className="glass-card rounded-2xl p-6">
              <p className="mono-label text-slate-500">Day Detail — Oct {selected}, 2026</p>
              {selectedEvents.length ? (
                <ul className="mt-4 space-y-3">
                  {selectedEvents.map((e, i) => (
                    <li key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <span className="chip" style={{ color: EVENT_TYPES[e.type].color, backgroundColor: EVENT_TYPES[e.type].color + '14' }}>
                          {EVENT_TYPES[e.type].label}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{e.time}</span>
                      </div>
                      <p className="mt-2.5 text-sm font-medium text-slate-200">{e.title}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No scheduled events — clear skies for deep-sky observation windows.</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="glass-card rounded-2xl p-6">
              <p className="mono-label text-cyan-300">Upcoming Events</p>
              <ul className="mt-4 space-y-3">
                {upcoming.map(([day, evts]) =>
                  evts.map((e, i) => (
                    <li key={`${day}-${i}`} className="flex items-center gap-3.5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-center">
                        <span>
                          <span className="block font-display text-sm font-bold leading-none text-white">{day}</span>
                          <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-500">Oct</span>
                        </span>
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-200">{e.title}</p>
                        <p className="text-xs" style={{ color: EVENT_TYPES[e.type].color }}>
                          {EVENT_TYPES[e.type].label} • {e.time}
                        </p>
                      </div>
                    </li>
                  )),
                )}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}
