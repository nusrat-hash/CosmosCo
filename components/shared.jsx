import { motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'

export function Reveal({ children, delay = 0, className = '', y = 24 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ children }) {
  return (
    <p className="mono-label flex items-center gap-2 text-cyan-300">
      <TriangleAlert className="h-3.5 w-3.5" />
      {children}
    </p>
  )
}

export function PageHeader({ label, title, accent, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-10 sm:px-6 lg:px-8">
      <Reveal>
        <p className="mono-label text-cyan-300">{label}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h1>
        {children && <p className="mt-4 max-w-2xl text-slate-400">{children}</p>}
      </Reveal>
    </div>
  )
}

export function StatusDot({ color = '#34d399', pulse = true }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: color }} />}
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    </span>
  )
}
