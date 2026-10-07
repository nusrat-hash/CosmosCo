import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Atom, ChevronRight, Flame, Globe2, GraduationCap, Orbit as OrbitIcon, Rocket, RotateCcw, Telescope, Trophy } from 'lucide-react'
import MediaSection from '../components/MediaSection'
import Orrery, { VIEWS } from '../components/Orrery'
import { Reveal } from '../components/shared'
import { CHALLENGE, FLASHCARDS, FLASHCARD_TOPICS, LEARNING_PATHS, MEDIA_ITEMS, MEDIA_TABS } from '../data/content'
import { PLANETS } from '../data/planets'
import { useInterval } from '../hooks'
import { searchNasaMedia, useNasaQuery } from '../lib/nasa'

const TIME_STEPS = [1, 10, 100]

const HUB_QUERIES = {
  'All Imagery': 'james webb space telescope nebula',
  'Galaxies & Clusters': 'hubble galaxy cluster',
  'Star-Forming Nebulae': 'carina nebula jwst',
  'Solar System': 'cassini saturn jupiter',
}

const PATH_ICONS = { Orbit: OrbitIcon, Globe: Globe2, Telescope, Rocket }

function PlanetSelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {PLANETS.map((p) => (
        <button
          key={p.name}
          onClick={() => onSelect(p.name)}
          title={p.name}
          className={`grid h-11 w-11 place-items-center rounded-full ring-offset-2 ring-offset-panel transition ${
            selected === p.name ? 'ring-2 ring-cyan-300' : 'ring-1 ring-white/10 hover:ring-white/25'
          }`}
          style={{ background: `radial-gradient(circle at 32% 30%, #ffffffcc, ${p.color} 45%, #04060e 130%)` }}
          aria-label={p.name}
        />
      ))}
    </div>
  )
}

function HelioSim() {
  const [selected, setSelected] = useState('Earth')
  const [time, setTime] = useState(1)
  const [view, setView] = useState('Heliocentric')
  const [trails, setTrails] = useState(true)
  const [grid, setGrid] = useState(false)

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center gap-3">
          <OrbitIcon className="h-5 w-5 text-cyan-300" />
          <div>
            <h2 className="font-display text-xl font-bold text-white">HelioSim — Interactive Orrery</h2>
            <p className="mono-label text-slate-500">8 PLANETS • LIVE EPHEMERIS • v4.8 ENGINE</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1 ring-1 ring-white/10">
          {TIME_STEPS.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs transition ${
                time === t ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}×
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[440px]">
        <Orrery selected={selected} onSelect={setSelected} speed={time} view={view} trails={trails} grid={grid} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
        <PlanetSelector selected={selected} onSelect={setSelected} />
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(VIEWS).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                view === v ? 'bg-violet-400/15 text-violet-300 ring-1 ring-violet-300/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          {[
            ['Trails', trails, setTrails],
            ['AU Grid', grid, setGrid],
          ].map(([label, on, set]) => (
            <button
              key={label}
              onClick={() => set(!on)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                on ? 'bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-cyan-300' : 'bg-slate-600'}`} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProgressRing({ value, max }) {
  const r = 17
  const c = 2 * Math.PI * r
  const frac = max ? value / max : 0
  return (
    <div className="relative h-12 w-12">
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="3.5" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-[10px] font-semibold text-cyan-300">
        {Math.round(frac * 100)}%
      </span>
    </div>
  )
}

function FlashcardDeck() {
  const [topic, setTopic] = useState(FLASHCARD_TOPICS[0])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mastered, setMastered] = useState(new Set())

  const deck = topic === FLASHCARD_TOPICS[0] ? FLASHCARDS : FLASHCARDS.filter((f) => f.topic === topic)
  const card = deck[Math.min(index, deck.length - 1)]

  const pick = (i) => {
    setIndex((i + deck.length) % deck.length)
    setFlipped(false)
  }

  const toggleMastered = () => {
    setMastered((prev) => {
      const next = new Set(prev)
      next.has(card.title) ? next.delete(card.title) : next.add(card.title)
      return next
    })
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-violet-300" />
          <div>
            <h2 className="font-display text-xl font-bold text-white">Astrophysics Learning Deck</h2>
            <p className="mono-label text-slate-500">FLIPCARD FLASH SYSTEM • {FLASHCARDS.length} CONCEPTS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing value={mastered.size} max={FLASHCARDS.length} />
          <div className="font-mono text-xs text-slate-400">
            <span className="block text-sm font-semibold text-cyan-300 tabular-nums">{mastered.size}/{FLASHCARDS.length}</span>
            mastered
          </div>
        </div>
      </div>

      <div className="px-6 pt-5">
        <div className="flex flex-wrap gap-2">
          {FLASHCARD_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => { setTopic(t); setIndex(0); setFlipped(false) }}
              className={`rounded-full px-3.5 py-1.5 text-xs transition ${
                topic === t ? 'bg-violet-400 text-slate-950' : 'bg-white/[0.03] text-slate-300 ring-1 ring-white/10 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="[perspective:1400px]" onClick={() => setFlipped(!flipped)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={card.title + String(flipped)}
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="min-h-[240px] cursor-pointer rounded-2xl border border-white/[0.08] bg-gradient-to-br from-panel to-void p-6 ring-1 ring-white/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="chip bg-violet-400/10 text-violet-300 ring-1 ring-violet-300/25">{card.chip}</span>
                  <span className="chip bg-white/[0.04] text-slate-400 ring-1 ring-white/10">{card.level} • {card.mins} min</span>
                </div>
                <span className="font-mono text-xs text-slate-500">Concept {String(index + 1).padStart(2, '0')} of 16</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-white">{card.title}</h3>
              <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] px-4 py-3">
                <p className="mono-label text-slate-500">{card.formulaLabel}</p>
                <p className="mt-1 font-mono text-lg text-cyan-300">{card.formula}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{flipped ? card.back : card.body}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate-600">
                {flipped ? 'Answer side — click to flip back' : 'Click card to flip'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2.5">
            <button onClick={() => setFlipped(!flipped)} className="btn-ghost !px-4 !py-2 text-xs">Flip Card</button>
            <button
              onClick={toggleMastered}
              className={`btn-ghost flex items-center gap-1.5 !px-4 !py-2 text-xs ${
                mastered.has(card.title) ? 'border-emerald-300/40 text-emerald-300' : ''
              }`}
            >
              <Trophy className="h-3.5 w-3.5" /> {mastered.has(card.title) ? 'Mastered' : 'Mark as Mastered'}
            </button>
          </div>
          <button onClick={() => pick(index + 1)} className="btn-primary flex items-center gap-1.5 !px-4 !py-2 text-xs">
            Next Card <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function DailyChallenge() {
  const [qi, setQi] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(99)
  const [finished, setFinished] = useState(false)

  useInterval(
    submitted || finished ? null : () => setTimeLeft((t) => Math.max(0, t - 1)),
    1000,
  )

  const q = CHALLENGE[qi]

  const submit = () => {
    if (chosen === null || submitted) return
    setSubmitted(true)
    if (chosen === q.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (qi + 1 >= CHALLENGE.length) {
      setFinished(true)
      return
    }
    setQi(qi + 1)
    setChosen(null)
    setSubmitted(false)
  }

  const retake = () => {
    setQi(0)
    setChosen(null)
    setSubmitted(false)
    setScore(0)
    setTimeLeft(99)
    setFinished(false)
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Daily Challenge</h2>
          <p className="mono-label text-slate-500">5 QUESTIONS • 99 SECONDS • ASTRODYNAMICS XP</p>
        </div>
        <span className="chip flex items-center gap-1.5 bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/25">
          <Flame className="h-3.5 w-3.5" /> 5-Day Streak
        </span>
      </div>

      {finished ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <Trophy className="h-10 w-10 text-amber-300" />
          <h3 className="mt-4 font-display text-2xl font-bold text-white">
            {score}/{CHALLENGE.length} correct
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Reward: +{score * 250} Astrodynamics XP {score === CHALLENGE.length ? '— perfect run.' : '— retake to perfect it.'}
          </p>
          <button onClick={retake} className="btn-primary mt-6 flex items-center gap-1.5 !px-5 !py-2.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Retake Challenge
          </button>
        </div>
      ) : (
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="chip bg-fuchsia-400/10 text-fuchsia-300 ring-1 ring-fuchsia-300/25">{q.category}</span>
            <span className="font-mono text-sm text-slate-400 tabular-nums">
              Q{qi + 1}/{CHALLENGE.length} • <span className={timeLeft < 15 ? 'text-rose-400' : 'text-cyan-300'}>{timeLeft}s</span>
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 transition-all" style={{ width: `${((qi + (submitted ? 1 : 0)) / CHALLENGE.length) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={qi} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
              <h3 className="mt-5 text-lg font-semibold text-white">{q.q}</h3>
              <div className="mt-4 grid gap-2.5">
                {q.options.map((opt, i) => {
                  const letter = 'ABCD'[i]
                  const isCorrect = submitted && i === q.answer
                  const isWrongPick = submitted && chosen === i && i !== q.answer
                  return (
                    <button
                      key={letter}
                      disabled={submitted}
                      onClick={() => setChosen(i)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                        isCorrect
                          ? 'border-emerald-300/50 bg-emerald-300/10 text-emerald-200'
                          : isWrongPick
                            ? 'border-rose-400/50 bg-rose-400/10 text-rose-200'
                            : chosen === i
                              ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100'
                              : 'border-white/[0.07] bg-white/[0.02] text-slate-300 hover:border-white/20'
                      } ${submitted ? 'cursor-default' : ''}`}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs text-slate-400">
                        {letter}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {submitted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                  <p className="mono-label text-cyan-300">{chosen === q.answer ? 'Correct — telemetry confirmed' : 'Incorrect — review telemetry'}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{q.explain}</p>
                  <p className="mt-2 font-mono text-xs text-amber-300">Reward: +250 Astrodynamics XP</p>
                </motion.div>
              )}

              <div className="mt-5 flex justify-end gap-2.5">
                {!submitted ? (
                  <button onClick={submit} disabled={chosen === null} className="btn-primary !px-5 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40">
                    Submit Answer
                  </button>
                ) : (
                  <button onClick={next} className="btn-primary !px-5 !py-2 text-xs">
                    {qi + 1 >= CHALLENGE.length ? 'Finish' : 'Next Question'}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default function StudentHub() {
  const [activePath, setActivePath] = useState(LEARNING_PATHS[0].id)
  const [mediaTab, setMediaTab] = useState(MEDIA_TABS[0])
  const {
    data: mediaData,
    loading: mediaLoading,
    error: mediaError,
  } = useNasaQuery(() => searchNasaMedia(HUB_QUERIES[mediaTab] || HUB_QUERIES['All Imagery'], 9), [mediaTab])

  const liveMedia = !mediaError && Array.isArray(mediaData) && mediaData.length > 0
  const mediaItems = liveMedia
    ? mediaData.map((d, i) => ({ ...d, category: mediaTab, wide: i % 4 === 1, tall: i % 4 === 3 }))
    : MEDIA_ITEMS

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <Reveal>
          <p className="mono-label text-cyan-300">AstroPortal Academy & Commercial Expeditions • Cadet Hub v4.8</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Interactive Student Hub <span className="text-gradient">& Space Tourism</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Master orbital mechanics with live simulators, flipcard decks, and daily challenges — then plan your own
            voyage with commercial expedition manifests.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="chip bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/25">
              <Atom className="h-3.5 w-3.5" /> EPHEMERIS SYNC J2000.0 TELEMETRY
            </span>
            <span className="chip bg-violet-400/10 text-violet-300 ring-1 ring-violet-300/25">ACTIVE SLOTS: 3 MISSIONS OPEN</span>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <Reveal><HelioSim /></Reveal>
        <Reveal><FlashcardDeck /></Reveal>
        <Reveal><DailyChallenge /></Reveal>

        <Reveal>
          <div className="glass-card rounded-2xl p-6">
            <p className="mono-label text-violet-300">Learning Paths</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {LEARNING_PATHS.map((p) => {
                const Icon = PATH_ICONS[p.icon] || OrbitIcon
                const active = activePath === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePath(p.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      active ? 'border-cyan-300/40 bg-cyan-300/[0.06]' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-cyan-300' : 'text-slate-400'}`} />
                    <h3 className="mt-3 text-sm font-semibold text-white">{p.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{p.blurb}</p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      {p.lessons} lessons • {p.level}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mono-label text-cyan-300">JWST Media Archive • NASA Image Library</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">Scientific Imagery & FITS Access</h2>
              </div>
              <p className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest ${liveMedia ? 'text-emerald-300' : 'text-amber-300'}`}>
                {liveMedia ? '● Live NASA feed' : '● NASA feed offline — cached frames'}
              </p>
            </div>
            <MediaSection
              items={mediaItems}
              tab={mediaTab}
              onTabChange={setMediaTab}
              loading={mediaLoading}
            />
          </div>
        </Reveal>
      </div>
    </>
  )
}
