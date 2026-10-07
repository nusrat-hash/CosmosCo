import { useMemo, useState } from 'react'
import { Bell, Crosshair, Expand, Maximize2, Radar, Signal, Timer, Users } from 'lucide-react'
import OrbitalCanvas from '../components/OrbitalCanvas'
import GroundTrack from '../components/GroundTrack'
import { PageHeader, StatusDot } from '../components/shared'
import { OVERHEAD_PASSES, TRACKED_OBJECTS } from '../data/content'
import { useInterval, useNow } from '../hooks'

function Sparkline({ data, color = '#22d3ee' }) {
  const ref = (el) => {
    if (!el || data.length < 2) return
    const ctx = el.getContext('2d')
    const { width, height } = el
    ctx.clearRect(0, 0, width, height)
    const min = Math.min(...data)
    const max = Math.max(...data)
    const span = max - min || 1
    ctx.beginPath()
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - 4 - ((v - min) / span) * (height - 8)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fillStyle = color + '22'
    ctx.fill()
  }
  return <canvas ref={ref} width={260} height={56} className="w-full" />
}

function Countdown({ seconds }) {
  const s = Math.max(0, seconds)
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return (
    <span className="font-mono text-xl font-semibold text-cyan-300 tabular-nums">
      {hh}:{mm}:{ss}
    </span>
  )
}

function StatBlock({ label, value, sub, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <p className="mono-label text-slate-500">{label}</p>
      <p className={`mt-1.5 font-mono text-lg font-semibold tabular-nums ${accent || 'text-cyan-300'}`}>{value}</p>
      {sub && <p className="mt-0.5 font-mono text-[10px] text-slate-500">{sub}</p>}
    </div>
  )
}

function TelemetryDashboard() {
  const now = useNow(1000)
  const [geo, setGeo] = useState({ lat: 51.6428, lng: 0.1276, slot: 180 })
  useInterval(() => {
    setGeo((g) => ({
      lat: Math.min(51.65, Math.max(51.63, g.lat + (Math.random() - 0.5) * 0.01)),
      lng: Math.min(0.16, Math.max(0.09, g.lng + (Math.random() - 0.5) * 0.008)),
      slot: (g.slot + 4) % 360,
    }))
  }, 1200)

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <StatusDot />
            <div>
              <p className="font-display text-lg font-bold text-white">ISS (ZARYA)</p>
              <p className="mono-label text-slate-500">NORAD 25544 • TLE Epoch {now.toUTCString().slice(5, 16)}</p>
            </div>
          </div>
          <span className="chip bg-cyan-400/10 font-mono text-cyan-300 ring-1 ring-cyan-300/25">ORBIT #148,920</span>
        </div>

        <div className="px-6 pt-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <Radar className="h-4 w-4 shrink-0 text-cyan-300" />
            <p className="font-mono text-xs text-slate-300">
              Z+ NADIR <span className="text-slate-600">+</span> RADAR <span className="text-slate-600">:</span>{' '}
              POLAR SLOT <span className="text-cyan-300">{String(geo.slot).padStart(3, '0')}°</span>
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatBlock label="SUB-SOLAR LATITUDE" value={`${geo.lat.toFixed(4)}°N`} />
            <StatBlock label="LONGITUDE" value={`00.${String(Math.round(geo.lng * 10000)).padStart(4, '0')}°W`} />
            <StatBlock label="ORBITAL ALTITUDE" value="418.4 km" sub="MEAN 420.0 km" />
            <StatBlock label="PERIOD" value="92.68 min" sub="15.5 ORBITS / DAY" />
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <p className="mono-label text-slate-500">ORBITAL VELOCITY RATIO</p>
              <p className="font-mono text-sm font-semibold text-cyan-300">27,580 km/h</p>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
              <span>0</span>
              <span className="text-slate-400">7.66 km/s instantaneous</span>
              <span>36,000</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="h-4 w-4 text-cyan-300" /> 7 Astronauts Onboard • Expedition 73
          </p>
          <div className="flex gap-2.5">
            <button className="btn-primary flex items-center gap-1.5 !px-3.5 !py-2 text-xs">
              <Expand className="h-3.5 w-3.5" /> HD Earth Live Feed
            </button>
            <button className="btn-ghost flex items-center gap-1.5 !px-3.5 !py-2 text-xs">
              <Maximize2 className="h-3.5 w-3.5" /> Expand
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card flex flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <p className="mono-label flex items-center gap-2 text-slate-400">
            <Crosshair className="h-3.5 w-3.5 text-cyan-300" /> Ground Track • Live Sinusoid
          </p>
          <span className="chip bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/25">
            <StatusDot /> TRACKING
          </span>
        </div>
        <div className="min-h-[168px] flex-1">
          <GroundTrack />
        </div>

        <div className="border-t border-white/[0.06] px-6 py-4">
          <p className="mono-label flex items-center gap-2 text-slate-400">
            <Bell className="h-3.5 w-3.5 text-amber-300" /> Next Overhead Passes
          </p>
          <ul className="mt-3 space-y-2.5">
            {OVERHEAD_PASSES.map((p) => (
              <li
                key={p.object}
                className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.mag < 0 ? '#22d3ee' : '#a78bfa' }}
                  />
                  <span className="text-sm font-medium text-slate-200">{p.object}</span>
                  <span className="font-mono text-[11px] text-slate-500">mag {p.mag}</span>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-cyan-300">{p.time} UTC</span>
                  <span className="ml-3 text-slate-500">{p.duration}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3.5 flex items-center justify-between rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-2.5">
            <span className="mono-label text-amber-300">SAT PASS ALERTS</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-300">
              <StatusDot /> SUNLIGHT: ILLUMINATED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Tracker() {
  const [selectedId, setSelectedId] = useState('iss')
  const obj = TRACKED_OBJECTS.find((o) => o.id === selectedId)

  const [passEta, setPassEta] = useState(() => 17 * 60 + 42)
  useInterval(() => setPassEta((v) => (v <= 0 ? Math.floor(20 + Math.random() * 2400) : v - 1)), 1000)

  const [samples, setSamples] = useState(() =>
    Array.from({ length: 48 }, (_, i) => 72 + Math.sin(i / 6) * 8 + Math.random() * 5),
  )
  useInterval(() => {
    setSamples((prev) => {
      const last = prev[prev.length - 1]
      const next = Math.min(96, Math.max(48, last + (Math.random() - 0.5) * 9))
      return [...prev.slice(1), next]
    })
  }, 900)

  const now = useNow(1000)
  const [jitter, setJitter] = useState({ vel: 0, alt: 0, lat: 0.7, lng: 0 })
  useInterval(() => {
    setJitter({
      vel: (Math.random() - 0.5) * 240,
      alt: (Math.random() - 0.5) * 6,
      lat: Math.random() * 90,
      lng: Math.random() * 180,
    })
  }, 1000)

  const telemetry = useMemo(() => {
    if (obj.kind === 'l2') {
      return [
        { label: 'Distance from Earth', value: obj.distance },
        { label: 'Halo orbit velocity', value: `${Math.round(obj.baseVel + jitter.vel / 4)} m/s` },
        { label: 'Round-trip light time', value: `${(10.08 + Math.random() * 0.02).toFixed(2)} s` },
        { label: 'Inclination', value: obj.inclination },
        { label: 'Launch', value: obj.launched },
      ]
    }
    return [
      { label: 'Orbital velocity', value: `${Math.round(obj.baseVel + jitter.vel).toLocaleString()} km/h` },
      { label: 'Altitude', value: `${(obj.baseAlt + jitter.alt).toFixed(1)} km` },
      { label: 'Sub-satellite point', value: `${jitter.lat.toFixed(2)}°, ${jitter.lng.toFixed(2)}°` },
      { label: 'Inclination', value: obj.inclination },
      { label: 'Launch', value: obj.launched },
    ]
  }, [obj, jitter])

  return (
    <>
      <PageHeader label="Sector Telemetry Array" title="Real-Time Orbital" accent="Tracking">
        Continuous two-line element tracking across the active constellation — live state vectors, ground-track
        projections, and pass predictions from the sector array. Simulated telemetry feed.
      </PageHeader>

      <TelemetryDashboard />

      <div className="mx-auto mt-4 grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="glass-card relative overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <p className="mono-label flex items-center gap-2 text-slate-400">
              <StatusDot /> {now.toUTCString().slice(17, 25)} UTC • GROUND TRACK ACTIVE
            </p>
            <Crosshair className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="h-[440px]">
            <OrbitalCanvas selected={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-5 py-3.5">
            {TRACKED_OBJECTS.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedId(o.id)}
                className={`chip transition ${
                  selectedId === o.id ? 'text-slate-950' : 'bg-white/5 text-slate-300 ring-1 ring-white/10 hover:ring-white/25'
                }`}
                style={selectedId === o.id ? { backgroundColor: o.color } : {}}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                {o.short}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mono-label text-slate-500">Selected Spacecraft</p>
                <h2 className="mt-1.5 font-display text-xl font-bold text-white">{obj.name}</h2>
              </div>
              <span className="chip bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/25">Nominal</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{obj.note}</p>

            <dl className="mt-5 space-y-3">
              {telemetry.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-white/[0.05] pb-3 text-sm">
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="font-mono font-medium text-slate-200 tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <p className="mono-label flex items-center gap-2 text-slate-500">
                <Signal className="h-3.5 w-3.5 text-cyan-300" /> Downlink Signal • DSN {obj.kind === 'l2' ? 'DSS-43' : 'DSS-14'}
              </p>
              <span className="font-mono text-sm font-semibold text-cyan-300">{Math.round(samples[samples.length - 1])} dB·Hz</span>
            </div>
            <div className="mt-3">
              <Sparkline data={samples} color={obj.color} />
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
              <p className="mono-label flex items-center gap-2 text-slate-500">
                <Timer className="h-3.5 w-3.5" /> Next visible pass
              </p>
              <Countdown seconds={passEta} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
