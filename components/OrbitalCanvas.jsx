import { useEffect, useRef } from 'react'
import { TRACKED_OBJECTS } from '../data/content'

const LEO_OBJECTS = TRACKED_OBJECTS.filter((o) => o.kind === 'leo')

export default function OrbitalCanvas({ selected, onSelect }) {
  const canvasRef = useRef(null)
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    let w = 0
    let h = 0
    const hitZones = []

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      w = rect.width
      h = Math.max(rect.height, 420)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const base = Math.min(w, h) * 0.21
      const tt = t / 1000

      // orbit rings
      for (const o of LEO_OBJECTS) {
        ctx.beginPath()
        ctx.arc(cx, cy, base * o.orbitR * 1.35, 0, Math.PI * 2)
        ctx.strokeStyle = o.id === selectedRef.current ? o.color + '55' : 'rgba(148,163,184,0.14)'
        ctx.setLineDash([3, 5])
        ctx.lineWidth = 1
        ctx.stroke()
      }
      ctx.setLineDash([])

      // earth
      const glow = ctx.createRadialGradient(cx, cy, base * 0.5, cx, cy, base * 1.5)
      glow.addColorStop(0, 'rgba(34,211,238,0.12)')
      glow.addColorStop(1, 'rgba(34,211,238,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, base * 1.5, 0, Math.PI * 2)
      ctx.fill()

      const earth = ctx.createRadialGradient(cx - base * 0.25, cy - base * 0.3, base * 0.1, cx, cy, base * 0.75)
      earth.addColorStop(0, '#1e5f8a')
      earth.addColorStop(0.55, '#0d3352')
      earth.addColorStop(1, '#06182b')
      ctx.fillStyle = earth
      ctx.beginPath()
      ctx.arc(cx, cy, base * 0.72, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(103,232,249,0.35)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // earth texture arcs
      ctx.strokeStyle = 'rgba(103,232,249,0.10)'
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, base * (0.3 + i * 0.16), base * (0.5 + i * 0.1), 0.4, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(226,232,240,0.75)'
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('EARTH', cx, cy + 3)

      hitZones.length = 0

      // LEO satellites
      for (const o of LEO_OBJECTS) {
        const R = base * o.orbitR * 1.35
        const a = (tt * (Math.PI * 2)) / o.period + o.orbitR * 2.1
        const x = cx + R * Math.cos(a)
        const y = cy + R * 0.92 * Math.sin(a)

        // trail
        ctx.beginPath()
        ctx.arc(cx, cy, R, a - 0.9, a)
        ctx.strokeStyle = o.color + '30'
        ctx.lineWidth = 2
        ctx.stroke()

        const isSel = o.id === selectedRef.current
        const g = ctx.createRadialGradient(x, y, 0, x, y, isSel ? 18 : 12)
        g.addColorStop(0, o.color + 'aa')
        g.addColorStop(1, o.color + '00')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, isSel ? 18 : 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = o.color
        ctx.beginPath()
        ctx.arc(x, y, isSel ? 5 : 3.5, 0, Math.PI * 2)
        ctx.fill()

        if (isSel) {
          ctx.strokeStyle = o.color + '88'
          ctx.beginPath()
          ctx.arc(x, y, 9 + Math.sin(tt * 4) * 2, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'left'
        ctx.fillStyle = isSel ? o.color : 'rgba(226,232,240,0.65)'
        ctx.fillText(o.short.toUpperCase(), x + 10, y + 3)

        hitZones.push({ id: o.id, x, y })
      }

      // JWST at L2
      const jw = TRACKED_OBJECTS.find((o) => o.kind === 'l2')
      const jx = cx + Math.cos(-0.5) * (base * 2.6)
      const jy = cy + Math.sin(-0.5) * (base * 2.6) * 0.92
      const wob = Math.sin(tt * 0.6) * 4
      const isJw = selectedRef.current === 'jwst'

      ctx.setLineDash([2, 6])
      ctx.strokeStyle = 'rgba(251,191,36,0.25)'
      ctx.beginPath()
      ctx.moveTo(cx + base * 0.8, cy - base * 0.4)
      ctx.lineTo(jx, jy)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.strokeStyle = '#fbbf2455'
      ctx.beginPath()
      ctx.arc(jx + wob * 0.4, jy + wob * 0.2, 13, 0, Math.PI * 2)
      ctx.stroke()

      ctx.save()
      ctx.translate(jx + wob * 0.4, jy + wob * 0.2)
      ctx.rotate(Math.PI / 4)
      ctx.fillStyle = isJw ? '#fbbf24' : '#fbbf24cc'
      ctx.fillRect(-3.5, -3.5, 7, 7)
      ctx.restore()

      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'left'
      ctx.fillStyle = isJw ? '#fbbf24' : 'rgba(226,232,240,0.65)'
      ctx.fillText('JWST @ L2', jx + 12, jy + wob * 0.2 + 3)
      hitZones.push({ id: 'jwst', x: jx, y: jy })

      raf = requestAnimationFrame(draw)
    }

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const hit = hitZones.find((z) => Math.hypot(z.x - x, z.y - y) < 24)
      onSelectRef.current(hit ? hit.id : null)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    canvas.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full cursor-crosshair" />
}
