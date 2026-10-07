import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Radio, Trash2 } from 'lucide-react'
import { PageHeader, Reveal, StatusDot } from '../components/shared'
import { useInterval } from '../hooks'
import { fetchApod, fetchEonetEvents, fetchNeoApproaches } from '../lib/nasa'

const CRAFT = ['Voyager 1', 'JWST', 'Perseverance', 'Europa Clipper', 'ISS', 'Artemis II', 'Insight Relay']

const TEMPLATES = [
  { tag: 'DSN', color: '#22d3ee', make: () => `DSS-43 lock acquired — ${pick(CRAFT)} carrier @ ${(8.4 + Math.random() * 0.4).toFixed(3)} GHz` },
  { tag: 'DSN', color: '#22d3ee', make: () => `Uplink command burst acknowledged • ${pick(CRAFT)} seq #${Math.floor(4000 + Math.random() * 6000)}` },
  { tag: 'TRACK', color: '#a78bfa', make: () => `TLE refresh completed — ${pick(CRAFT)} epoch ${new Date().toISOString().slice(2, 10).replace(/-/g, '')}` },
  { tag: 'TRACK', color: '#a78bfa', make: () => `Station handover initiated: Goldstone DSS-14 → Canberra DSS-43` },
  { tag: 'TELEM', color: '#34d399', make: () => `Solar array output nominal — ${Math.round(820 + Math.random() * 140)} W` },
  { tag: 'TELEM', color: '#34d399', make: () => `Thermal bus stable • ${(21 + Math.random() * 4).toFixed(1)}°C • all radiators deployed` },
  { tag: 'TELEM', color: '#34d399', make: () => `Attitude hold confirmed • jitter ${(Math.random() * 0.04).toFixed(3)} arcsec RMS` },
  { tag: 'ALERT', color: '#fbbf24', make: () => `Space weather watch — Kp index ${(2 + Math.random() * 3).toFixed(1)} rising` },
  { tag: 'ALERT', color: '#fbbf24', make: () => `Solar wind density spike: ${(Math.random() * 12).toFixed(1)} p/cm³` },
  { tag: 'SYNC', color: '#e879f9', make: () => `Archive sync complete • integrity 99.98% • ${Math.floor(120 + Math.random() * 60)} TB replicated` },
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const STATIONS = [
  { name: 'DSS-14 Goldstone', craft: 'Perseverance', dir: 'Mars Relay' },
  { name: 'DSS-43 Canberra', craft: 'Voyager 1', dir: 'Interstellar' },
  { name: 'DSS-63 Madrid', craft: 'JWST', dir: 'Sun–Earth L2' },
]

export default function LiveFeed() {
  const counter = useRef(492)
  const [lines, setLines] = useState(() => seedLines())
  const [realLines, setRealLines] = useState([])
  const [nasaStatus, setNasaStatus] = useState('connecting')
  const [paused, setPaused] = useState(false)
  const [signals, setSignals] = useState(() => STATIONS.map(() => 55 + Math.random() * 35))
  const scrollRef = useRef(null)

  useEffect(() => {
    let alive = true
    const mkReal = (tag, color, text) => ({
      id: `nasa-${tag}-${Math.random().toString(36).slice(2)}`,
      time: new Date().toUTCString().slice(17, 25),
      tag,
      color,
      text,
      seq: counter.current++,
    })

    Promise.allSettled([fetchEonetEvents(6), fetchNeoApproaches(3), fetchApod()]).then(
      ([eonet, neos, apod]) => {
        if (!alive) return
        const seeded = []
        if (apod.status === 'fulfilled') {
          seeded.push(mkReal('APOD', '#e879f9', `Astronomy Picture of the Day — "${apod.value.title}" • ${apod.value.date}`))
        }
        if (neos.status === 'fulfilled') {
          neos.value.slice(0, 4).forEach((n) =>
            seeded.push(
              mkReal(
                'NEOWS',
                '#fbbf24',
                `${n.name} — closest approach ${n.date} • miss ${n.missLunar.toFixed(1)} lunar distances • ${
                  n.hazardous ? 'POTENTIALLY HAZARDOUS' : 'non-hazardous'
                }`,
              ),
            ),
          )
        }
        if (eonet.status === 'fulfilled') {
          eonet.value.slice(0, 5).forEach((e) =>
            seeded.push(mkReal('EONET', '#34d399', `${e.title} — ${e.category} • active since ${e.date}`)),
          )
        }
        setRealLines(seeded)
        setNasaStatus(seeded.length ? 'live' : 'offline')
      },
    )
    return () => {
      alive = false
    }
  }, [])

  const allLines = [...realLines, ...lines]

  function seedLines() {
    const arr = []
    for (let i = 0; i < 9; i++) arr.push(makeLine())
    return arr
  }

  function makeLine() {
    const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]
    return {
      id: Math.random().toString(36).slice(2),
      time: new Date().toUTCString().slice(17, 25),
      tag: t.tag,
      color: t.color,
      text: t.make(),
      seq: counter.current++,
    }
  }

  useInterval(
    () => {
      setLines((prev) => [...prev.slice(-90), makeLine()])
      setSignals((prev) => prev.map((s) => Math.min(96, Math.max(28, s + (Math.random() - 0.5) * 14))))
    },
    paused ? null : 1400,
  )

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [allLines])

  return (
    <>
      <PageHeader label="Deep Space Network Uplink" title="Mission" accent="Live Feed">
        Hybrid operations stream: real event data from NASA EONET, NeoWs, and APOD feeds seeded at the top of the
        buffer, followed by simulated ground-segment chatter. Refreshes in real time.
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <Reveal>
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <p className="mono-label flex items-center gap-2 text-slate-400">
                <StatusDot color={paused ? '#fbbf24' : '#34d399'} />
                {paused ? 'FEED PAUSED' : 'STREAM ACTIVE'} • SEQ #{counter.current}
                <span
                  className={`ml-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest ring-1 ${
                    nasaStatus === 'live'
                      ? 'text-emerald-300 ring-emerald-300/25'
                      : nasaStatus === 'connecting'
                        ? 'text-amber-300 ring-amber-300/25'
                        : 'text-rose-300 ring-rose-300/25'
                  }`}
                >
                  NASA UPLINK {nasaStatus.toUpperCase()}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaused(!paused)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:text-cyan-300"
                  aria-label={paused ? 'Resume' : 'Pause'}
                >
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setLines([])}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:text-rose-300"
                  aria-label="Clear"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div ref={scrollRef} className="h-[420px] overflow-y-auto scroll-smooth p-5 font-mono text-[12.5px] leading-relaxed">
              {allLines.map((l) => (
                <div key={l.id} className="flex gap-3 py-1">
                  <span className="shrink-0 text-slate-600">{l.time}</span>
                  <span className="shrink-0 font-semibold" style={{ color: l.color }}>
                    [{l.tag}]
                  </span>
                  <span className="text-slate-300">{l.text}</span>
                </div>
              ))}
              {lines.length === 0 && <p className="text-slate-600">// buffer cleared — awaiting next downlink window…</p>}
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1} className="space-y-4">
            {STATIONS.map((s, i) => (
              <div key={s.name} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 ring-1 ring-white/10">
                      <Radio className="h-5 w-5 text-cyan-300" />
                    </span>
                    <div>
                      <p className="font-display font-semibold text-white">{s.name}</p>
                      <p className="text-xs text-slate-500">TX/RX • {s.dir}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                    <StatusDot /> Online
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Communicating with <span className="text-slate-300">{s.craft}</span></span>
                    <span className="font-mono text-cyan-300">{Math.round(signals[i])}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-700"
                      style={{ width: `${signals[i]}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.18}>
            <div className="glass-card rounded-2xl p-6">
              <p className="mono-label text-slate-500">Network Status Summary</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: '3', l: 'Arrays' },
                  { v: '99.98%', l: 'Uptime' },
                  { v: '8.6h', l: 'Light RT' },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3.5">
                    <p className="font-display text-xl font-bold text-white">{s.v}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}
