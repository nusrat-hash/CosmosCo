import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Send } from 'lucide-react'
import { StatusDot } from './shared'

const COLUMNS = [
  {
    title: 'Live Telemetry',
    links: [
      'NASA Deep Space Network',
      'ESA Estrack Stations',
      'ISRO STRAC Feed',
      'ISS Orbital Horizon',
      'James Webb Status Hub',
    ],
  },
  {
    title: 'Resources & APIs',
    links: [
      'Mission Archives',
      'Ephemeris REST API',
      'Near-Earth Asteroid Data',
      'Space Weather Center',
      'Developer Docs',
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="border-t border-white/[0.06] bg-void/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/25 to-violet-500/25 ring-1 ring-white/15">
                <Rocket className="h-5 w-5 text-cyan-300" />
              </span>
              <span className="font-display text-lg font-bold text-white">AstroPortal</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Next-generation astronomical telemetry arrays, real-time orbital trajectory telemetry, and high-resolution
              exploration archives spanning deep space networks.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <StatusDot /> DSN Online
              </span>
              <span className="flex items-center gap-2">
                <StatusDot color="#22d3ee" /> Sync 99.98%
              </span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mono-label text-slate-200">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/live-feed" className="text-sm text-slate-400 transition hover:text-cyan-300">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mono-label text-slate-200">Cosmic Alerts</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Receive celestial event pings and aurora forecasts direct to your console.
            </p>
            {subscribed ? (
              <p className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300">
                Signal locked — you are on the list.
              </p>
            ) : (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email.trim()) setSubscribed(true)
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@astronaut.space"
                  className="w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 AstroPortal Systems. High-grade astronomical data feed.</p>
          <div className="flex gap-6">
            <a className="transition hover:text-slate-300" href="#">Security Protocol</a>
            <a className="transition hover:text-slate-300" href="#">Telemetry Terms</a>
            <a className="transition hover:text-slate-300" href="#">Orbital Matrix</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
