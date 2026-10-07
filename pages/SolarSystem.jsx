import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Pause, Play, Tags, X } from 'lucide-react'
import { PLANETS } from '../data/planets'

function Planet({ p, selected, onSelect, speedRef, runningRef, showLabels }) {
  const orbitRef = useRef()
  const spinRef = useRef()

  useFrame((_, dt) => {
    if (runningRef.current) {
      orbitRef.current.rotation.y += (dt * speedRef.current * Math.PI * 2) / p.period
      spinRef.current.rotation.y += dt * speedRef.current * 0.6
    }
  })

  return (
    <>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[p.dist - 0.03, p.dist + 0.03, 128]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={selected ? 0.35 : 0.14} side={THREE.DoubleSide} />
      </mesh>
      <group ref={orbitRef}>
        <group position={[p.dist, 0, 0]}>
          <mesh
            ref={spinRef}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(p.name)
            }}
          >
            <sphereGeometry args={[p.size, 40, 40]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.75}
              metalness={0.08}
              emissive={selected ? p.color : '#000000'}
              emissiveIntensity={selected ? 0.4 : 0}
            />
          </mesh>
          {p.name === 'Saturn' && (
            <mesh rotation-x={Math.PI / 2.35}>
              <ringGeometry args={[p.size * 1.45, p.size * 2.25, 72]} />
              <meshBasicMaterial color="#e7d8b1" transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
          )}
          {showLabels && (
            <Html center distanceFactor={30} className="pointer-events-none select-none">
              <div className="mt-1 whitespace-nowrap font-mono text-[10px] tracking-[0.25em] text-slate-300/80">
                {p.name.toUpperCase()}
              </div>
            </Html>
          )}
        </group>
      </group>
    </>
  )
}

function Sun({ onSelect, runningRef }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (runningRef.current) ref.current.rotation.y += dt * 0.05
  })
  return (
    <group>
      <pointLight intensity={2600} distance={0} decay={2} color="#fff4e0" />
      <mesh ref={ref} onClick={(e) => { e.stopPropagation(); onSelect(null) }}>
        <sphereGeometry args={[3.1, 48, 48]} />
        <meshBasicMaterial color="#ffd98a" />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.6, 48, 48]} />
        <meshBasicMaterial color="#ffb347" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(null)
  const [running, setRunning] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [showLabels, setShowLabels] = useState(true)

  const speedRef = useRef(speed)
  speedRef.current = speed
  const runningRef = useRef(running)
  runningRef.current = running

  const selectedPlanet = PLANETS.find((p) => p.name === selected)

  return (
    <div className="relative h-screen w-full overflow-hidden pt-16">
      <Canvas
        camera={{ position: [0, 30, 46], fov: 45 }}
        onPointerMissed={() => setSelected(null)}
        dpr={[1, 1.75]}
      >
        <color attach="background" args={['#04060e']} />
        <ambientLight intensity={0.25} />
        <Stars radius={160} depth={60} count={5200} factor={5} saturation={0.2} fade speed={0.6} />
        <Suspense fallback={null}>
          <Sun onSelect={setSelected} runningRef={runningRef} />
          {PLANETS.map((p) => (
            <Planet
              key={p.name}
              p={p}
              selected={selected === p.name}
              onSelect={setSelected}
              speedRef={speedRef}
              runningRef={runningRef}
              showLabels={showLabels}
            />
          ))}
        </Suspense>
        <OrbitControls enablePan={false} minDistance={12} maxDistance={110} enableDamping dampingFactor={0.06} />
      </Canvas>

      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 text-center">
        <p className="mono-label text-cyan-300">Interactive Simulation</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
          3D <span className="text-gradient">Solar System</span>
        </h1>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-abyss/70 px-4 py-3 backdrop-blur-xl">
        <button
          onClick={() => setRunning(!running)}
          className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400 text-slate-950 transition hover:bg-cyan-300"
          aria-label={running ? 'Pause' : 'Play'}
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Speed</span>
          <input
            type="range"
            min={0.1}
            max={4}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-28 accent-cyan-400"
          />
          <span className="w-8 font-mono text-xs text-cyan-300">{speed.toFixed(1)}×</span>
        </div>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
            showLabels ? 'border-cyan-300/40 text-cyan-300' : 'border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tags className="h-3.5 w-3.5" /> Labels
        </button>
      </div>

      {selectedPlanet && (
        <div className="absolute right-4 top-24 w-72 rounded-2xl border border-white/10 bg-abyss/80 p-5 backdrop-blur-xl sm:right-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="mono-label text-slate-500">Planet Dossier</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">{selectedPlanet.name}</h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-500 transition hover:text-white" aria-label="Close">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
          <dl className="mt-4 space-y-2.5">
            {Object.entries(selectedPlanet.facts).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-mono text-slate-200">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${((PLANETS.indexOf(selectedPlanet) + 1) / PLANETS.length) * 100}%` }} />
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            {PLANETS.indexOf(selectedPlanet) + 1} of {PLANETS.length} from the Sun
          </p>
        </div>
      )}

      {!selectedPlanet && (
        <p className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
          Drag to orbit • Scroll to zoom • Click a planet
        </p>
      )}
    </div>
  )
}
