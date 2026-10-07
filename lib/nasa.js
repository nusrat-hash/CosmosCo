import { useEffect, useRef, useState } from 'react'

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const NASA_API = 'https://api.nasa.gov'
const IMG_API = 'https://images-api.nasa.gov'
const EONET_API = 'https://eonet.gsfc.nasa.gov/api/v3'

const cache = new Map()

async function cachedJson(url, ttl = 10 * 60 * 1000) {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.at < ttl) return hit.data
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const data = await res.json()
  cache.set(url, { at: Date.now(), data })
  return data
}

export async function fetchApod() {
  const d = await cachedJson(`${NASA_API}/planetary/apod?api_key=${API_KEY}`, 60 * 60 * 1000)
  return {
    title: d.title,
    explanation: d.explanation,
    url: d.url,
    hdurl: d.hdurl || d.url,
    date: d.date,
    copyright: d.copyright || 'NASA',
    mediaType: d.media_type || 'image',
  }
}

export async function searchNasaMedia(query, count = 9) {
  const d = await cachedJson(
    `${IMG_API}/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${count * 3}`,
    30 * 60 * 1000,
  )
  const items = d.collection?.items ?? []
  const seen = new Set()
  const unique = items.filter((item) => {
    const t = item.data?.[0]?.title
    if (!t || seen.has(t)) return false
    seen.add(t)
    return true
  })
  const settled = await Promise.allSettled(
    unique.slice(0, count).map(async (item) => {
      const meta = item.data?.[0]
      if (!meta) throw new Error('no meta')
      const collRes = await fetch(item.href)
      if (!collRes.ok) throw new Error('collection fetch failed')
      const coll = await collRes.json()
      const src =
        coll.find((u) => u.includes('~medium.jpg')) ||
        coll.find((u) => /\.jpg($|\?)/i.test(u)) ||
        coll[0]
      if (!src) throw new Error('no image')
      return {
        id: meta.nasa_id,
        src,
        title: meta.title,
        caption: (meta.description || '').replace(/\s+/g, ' ').slice(0, 180),
        instrument: meta.center || 'NASA',
        date: (meta.date_created || '').slice(0, 10),
      }
    }),
  )
  return settled.filter((r) => r.status === 'fulfilled').map((r) => r.value)
}

function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function fetchNeoApproaches(daysAhead = 7) {
  const start = new Date()
  const end = new Date(Date.now() + daysAhead * 86400000)
  const d = await cachedJson(
    `${NASA_API}/neo/rest/v1/feed?start_date=${toLocalDateStr(start)}&end_date=${toLocalDateStr(end)}&api_key=${API_KEY}`,
    60 * 60 * 1000,
  )
  const neos = []
  for (const [date, arr] of Object.entries(d.near_earth_objects || {})) {
    for (const n of arr) {
      const cad = n.close_approach_data?.[0]
      if (!cad) continue
      neos.push({
        id: n.id,
        name: n.name.replace(/^\((.+)\)$/, '$1'),
        date,
        missKm: Number(cad.miss_distance?.kilometers || 0),
        missLunar: Number(cad.miss_distance?.lunar || 0),
        velocityKph: Number(cad.relative_velocity?.kilometers_per_hour || 0),
        diameterMaxM: n.estimated_diameter?.meters?.estimated_diameter_max || 0,
        hazardous: Boolean(n.is_potentially_hazardous_asteroid),
      })
    }
  }
  return neos.sort((a, b) => a.missKm - b.missKm)
}

export async function fetchEonetEvents(limit = 12) {
  const d = await cachedJson(`${EONET_API}/events?limit=${limit}&status=open`, 10 * 60 * 1000)
  return (d.events || []).map((e) => ({
    id: e.id,
    title: e.title,
    category: e.categories?.[0]?.title || 'Event',
    date: (e.geometry?.[0]?.date || '').slice(0, 10),
    link: e.link || 'https://eonet.gsfc.nasa.gov/',
  }))
}

export function useNasaQuery(fetcher, deps = []) {
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fetcherRef
      .current()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
