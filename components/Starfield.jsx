import { useEffect, useRef } from 'react'

export default function Starfield({ density = 220 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    let w = 0
    let h = 0
    let stars = []

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.25 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: 0.5 + Math.random() * 1.6,
        d: 0.15 + Math.random() * 0.6,
        hue: Math.random() < 0.12 ? '#a5f3fc' : Math.random() < 0.2 ? '#c4b5fd' : '#e2e8f0',
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const st of stars) {
        st.x -= st.d * 0.06
        if (st.x < -2) st.x = w + 2
        const tw = 0.45 + 0.55 * Math.sin((t / 1000) * st.s + st.p)
        ctx.globalAlpha = tw
        ctx.fillStyle = st.hue
        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return <canvas ref={ref} aria-hidden className="fixed inset-0 -z-20 h-full w-full" />
}
