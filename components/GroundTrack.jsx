import { useEffect, useRef } from 'react'

const HISTORY_POINTS = 240
const PERIODS = { iss: 9.3, tiangong: 11.2, hubble: 13.4 }

export default function GroundTrack({ objectId = 'iss', label = 'ISS • 51.6°N 0.5°W', color = '#22d3ee' }) {
  const canvasRef = useRef(null)
  const idRef = useRef(objectId)
  idRef.current = objectId

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    let w = 0
    let h = 0
    const history = []

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      w = rect.width
      h = Math.max(rect.height, 150)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const latAt = (t, period, phase = 0) => Math.sin((t * Math.PI * 2) / (period * 2.6) + phase)

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const tt = t / 1000
      const period = PERIODS[idRef.current] || 9.3

      ctx.fillStyle = 'rgba(148,163,184,0.03)'
      ctx.fillRect(0, 0, w, h)

      // graticule
      const latLine = (lat) => h / 2 - (lat / 90) * (h / 2) * 0.86
      ctx.strokeStyle = 'rgba(148,163,184,0.16)'
      ctx.setLineDash([2, 4])
      ctx.font = '9px "JetBrains Mono", monospace'
      ctx.textAlign = 'left'
      for (const lat of [60, 30, 0, -30, -60]) {
        ctx.beginPath()
        ctx.moveTo(0, latLine(lat))
        ctx.lineTo(w, latLine(lat))
        ctx.stroke()
        ctx.fillStyle = 'rgba(148,163,184,0.4)'
        ctx.fillText(lat === 0 ? 'EQ' : `${lat}°`, 4, latLine(lat) - 3)
      }
      ctx.setLineDash([])

      // sample into history
      const sample = latAt(tt, period)
      history.push(sample)
      if (history.length > HISTORY_POINTS) history.shift()

      // track
      ctx.beginPath()
      history.forEach((v, i) => {
        const x = (i / (HISTORY_POINTS - 1)) * w
        const y = h / 2 - v * (h / 2) * 0.86
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, color + '10')
      grad.addColorStop(1, color + 'cc')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.8
      ctx.stroke()

      // current position
      const last = history[history.length - 1] ?? sample
      const px = w
      const py = h / 2 - last * (h / 2) * 0.86
      const g = ctx.createRadialGradient(px, py, 0, px, py, 14)
      g.addColorStop(0, color + '99')
      g.addColorStop(1, color + '00')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(px, py, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(px, py, 3.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(226,232,240,0.78)'
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'right'
      ctx.fillText(label, w - 8, 14)

      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [label, color])

  return <canvas ref={canvasRef} className="h-full w-full" />
}
