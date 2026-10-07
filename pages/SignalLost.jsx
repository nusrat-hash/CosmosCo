import { Link } from 'react-router-dom'
import { Radar } from 'lucide-react'

export default function SignalLost() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-16 text-center">
      <p className="mono-label text-rose-300">ERROR 404 • CARRIER LOST</p>
      <h1 className="mt-4 font-display text-6xl font-bold text-white">
        Signal <span className="text-gradient">Lost</span>
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        This trajectory does not exist in the ephemeris. The requested coordinates drifted beyond our tracking
        horizon.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <Radar className="h-4.5 w-4.5" />
        Reacquire Signal
      </Link>
    </div>
  )
}
