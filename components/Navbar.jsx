import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Orbit, Search, X } from 'lucide-react'
import { useNow } from '../hooks'
import { StatusDot } from './shared'

const LINKS = [
  { to: '/news', label: 'News' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/solar-system', label: '3D Solar System' },
  { to: '/student-hub', label: 'Student Hub' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/calendar', label: 'Celestial Calendar' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const now = useNow(1000)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  const utc = now.toUTCString().slice(17, 25)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-abyss/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/25 to-violet-500/25 ring-1 ring-white/15">
            <Orbit className="h-5 w-5 text-cyan-300" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">CosmosCo</span>
        </Link>

        <div className="ml-2 hidden min-w-0 flex-1 items-center lg:flex">
          <label className="glass flex w-56 items-center gap-2 rounded-full px-3 py-1.5 text-slate-400 transition focus-within:border-cyan-300/40 xl:w-64">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              placeholder="Search cosmos..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <kbd className="rounded border border-white/10 px-1.5 font-mono text-[10px] text-slate-500">/</kbd>
          </label>
        </div>

        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)]' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-3">
          <span className="hidden items-center gap-2 font-mono text-[11px] tracking-widest text-slate-500 md:flex">
            <StatusDot />
            {utc} UTC
          </span>
          <Link
            to="/live-feed"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(217,70,239,0.8)] transition hover:brightness-110 sm:inline-flex"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live Feed
          </Link>
          <span className="hidden h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-bold text-white ring-1 ring-white/20 sm:grid">
            AC
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-abyss/95 px-4 pb-4 pt-2 backdrop-blur-xl xl:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-cyan-400/15 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/live-feed"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live Feed
          </Link>
        </div>
      )}
    </header>
  )
}
