import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { PLANETS } from '../data/planets'

export const VIEWS = {
  Heliocentric: { pos: [0, 30, 44], min: 12, max: 110 },
  'Earth-Moon': { pos: [13, 7, 12], min: 4, max: 42 },
  'Inner Planets': { pos: [0, 18, 26], min: 6, max: 60 },
  'Gas Giants': { pos: [31, 22, 40], min: 10, max: 120 },
}

function SimPlanet({ p, selected, onSelect, speedRef, trails }) {
  const orbitRef = useRef()
  const spinRef = useRef()

  useFrame((_, dt) => {
    orbitRef.current.rotation.y += (dt * speedRef.current * Math.PI * 2) / p.period
    spinRef.current.rotation.y += dt * speedRef.current * 0.6
  })

  return (
    <>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[p.dist - 0.03, p.dist + 0.03, 96]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={trails ? (selected ? 0.4 : 0.22) : 0}
          side={THREE.DoubleSide}
        />
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
            <sphereGeometry args={[p.size, 32, 32]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.75}
              metalness={0.08}
              emissive={selected ? p.color : '#000000'}
              emissiveIntensity={selected ? 0.45 : 0}
            />
          </mesh>
          {p.name === 'Saturn' && (
            <mesh rotation-x={Math.PI / 2.35}>
              <ringGeometry args={[p.size * 1.45, p.size * 2.25, 64]} />
              <meshBasicMaterial color="#e7d8b1" transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
          )}
          <Html center distanceFactor={30} className="pointer-events-none select-none">
            <div
              className={`whitespace-nowrap font-mono text-[9px] tracking-[0.25em] ${
                selected ? 'text-cyan-300' : 'text-slate-400/80'
              }`}
            >
              {p.name.toUpperCase()}
            </div>
          </Html>
        </group>
      </group>
    </>
  )
}

function SimSun({ onSelect }) {
  return (
    <group>
      <pointLight intensity={2200} distance={0} decay={2} color="#fff4e0" />
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(null) }}>
        <sphereGeometry args={[2.6, 40, 40]} />
        <meshBasicMaterial color="#ffd98a" />
      </mesh>
      <mesh>
        <sphereGeometry args={[3, 40, 40]} />
        <meshBasicMaterial color="#ffb347" transparent opacity={0.16} />
      </mesh>
    </group>
  )
}

function CameraRig({ view }) {
  useFrame((state, dt) => {
    const target = new THREE.Vector3(...VIEWS[view].pos)
    state.camera.position.lerp(target, 1 - Math.pow(0.001, dt))
  })
  return null
}

function AuGrid() {
  const spokes = []
  for (let i = 0; i < 8; i++) spokes.push((i * Math.PI) / 4)
  return (
    <>
      {spokes.map((a) => (
        <mesh key={a} rotation-y={a} position={[Math.cos(a) * 26, 0, -Math.sin(a) * 26]} rotation-z={Math.PI / 2}>
          <planeGeometry args={[52, 0.012]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.07} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[13, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 48]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[13, 1.4, 0]} center distanceFactor={34} className="pointer-events-none select-none">
        <div className="font-mono text-[9px] tracking-[0.2em] text-amber-300/90">1 AU — EARTH ORBIT</div>
      </Html>
    </>
  )
}

export default function Orrery({ selected, onSelect, speed, view, trails, grid }) {
  const speedRef = useRef(speed)
  speedRef.current = speed

  return (
    <Canvas camera={{ position: VIEWS.Heliocentric.pos, fov: 45 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#05070f']} />
      <ambientLight intensity={0.3} />
      <Stars radius={160} depth={60} count={4000} factor={5} saturation={0.2} fade speed={0.5} />
      <CameraRig view={view} />
      <Suspense fallback={null}>
        <SimSun onSelect={onSelect} />
        {PLANETS.map((p) => (
          <SimPlanet key={p.name} p={p} selected={selected === p.name} onSelect={onSelect} speedRef={speedRef} trails={trails} />
        ))}
        {grid && <AuGrid />}
      </Suspense>
      <OrbitControls
        key={view}
        enablePan={false}
        minDistance={VIEWS[view].min}
        maxDistance={VIEWS[view].max}
        enableDamping
        dampingFactor={0.06}
      />
    </Canvas>
  )
}
