import { Html, Line, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const AGENTS = [
  { id: 'sales', label: 'SALES INTELLIGENCE', metric: '$42.8K OPPORTUNITY', position: [-4.6, 1.7, -0.4], color: '#67fff5' },
  { id: 'outbound', label: 'OUTBOUND SEQUENCER', metric: '184 TOUCHES / HR', position: [-3.4, -2.35, 0.5], color: '#54d8ff' },
  { id: 'research', label: 'MARKET INTELLIGENCE', metric: '2,804 SIGNALS', position: [-1.35, 3.15, -1.1], color: '#a889ff' },
  { id: 'content', label: 'CONTENT ENGINE', metric: '16 ASSETS ACTIVE', position: [2.0, 3.0, -0.7], color: '#6ee7ff' },
  { id: 'offers', label: 'OFFER OPTIMIZER', metric: '+18.7% CVR', position: [4.55, 1.35, 0.15], color: '#8bffb4' },
  { id: 'finance', label: 'CAPITAL EFFICIENCY', metric: '4.38x RETURN', position: [4.15, -2.0, -0.55], color: '#80ff9f' },
  { id: 'retention', label: 'RETENTION MONITOR', metric: '96.4% HEALTH', position: [1.3, -3.25, 0.35], color: '#68ffd1' },
  { id: 'routing', label: 'FULFILLMENT ROUTING', metric: '38 JOBS LIVE', position: [-1.55, -3.25, -0.65], color: '#ffd77a' },
]

const SECONDARY = [
  [-5.65, 0.2, -1.4], [-4.65, 3.0, -1.7], [-3.05, 3.8, -2.0], [-0.1, 4.05, -1.8],
  [3.6, 3.45, -1.6], [5.7, 2.75, -1.8], [5.95, -0.1, -1.0], [5.4, -3.2, -1.6],
  [2.95, -4.15, -1.7], [-0.2, -4.3, -1.9], [-3.65, -4.0, -1.6], [-5.55, -2.55, -1.7],
]

function makeCurve(from, to, bend = 0.35) {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const midpoint = start.clone().lerp(end, 0.5)
  const lateral = new THREE.Vector3(-(end.y - start.y), end.x - start.x, 0).normalize()
  midpoint.add(lateral.multiplyScalar(start.distanceTo(end) * bend * 0.16))
  midpoint.z += 0.65 + bend * 0.7
  return new THREE.QuadraticBezierCurve3(start, midpoint, end)
}

function CurvePulse({ curve, color, phase = 0, speed = 0.22, size = 0.055 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * speed + phase) % 1
    ref.current.position.copy(curve.getPoint(t))
    const flare = 0.65 + Math.sin(t * Math.PI) * 1.15
    ref.current.scale.setScalar(flare)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function Connection({ from, to, color = '#4cdfff', strength = 1, bend = 0.35 }) {
  const curve = useMemo(() => makeCurve(from, to, bend), [from, to, bend])
  const points = useMemo(() => curve.getPoints(34), [curve])

  return (
    <group>
      <Line points={points} color={color} transparent opacity={0.07 + strength * 0.11} lineWidth={0.5 + strength * 0.45} />
      <CurvePulse curve={curve} color={color} phase={0.08} speed={0.15 + strength * 0.055} />
      {strength > 0.42 && <CurvePulse curve={curve} color="#ffffff" phase={0.48} speed={0.17 + strength * 0.05} size={0.024} />}
      {strength > 0.7 && <CurvePulse curve={curve} color={color} phase={0.74} speed={0.2 + strength * 0.045} size={0.036} />}
    </group>
  )
}

function ExpandingWave({ phase = 0, color = '#65efff', tilt = 0 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * 0.16 + phase) % 1
    const scale = 0.55 + t * 4.6
    ref.current.scale.setScalar(scale)
    ref.current.material.opacity = (1 - t) * 0.18
  })

  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, tilt * 0.35]}>
      <ringGeometry args={[0.97, 1, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function OrbitingSignals() {
  const group = useRef()
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * Math.PI * 2,
    radius: 2.45 + (i % 4) * 0.21,
    y: ((i % 5) - 2) * 0.12,
    speed: 0.18 + (i % 3) * 0.045,
    color: i % 4 === 0 ? '#78ffb0' : '#67eaff',
  })), [])

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.children.forEach((child, i) => {
      const p = particles[i]
      const a = p.angle + clock.elapsedTime * p.speed
      child.position.set(Math.cos(a) * p.radius, p.y + Math.sin(a * 2) * 0.12, Math.sin(a) * p.radius * 0.38)
    })
  })

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[i % 5 === 0 ? 0.045 : 0.026, 8, 8]} />
          <meshBasicMaterial color={p.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function ScannerField() {
  const beam = useRef()
  const shell = useRef()
  const ticks = useRef()

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    if (beam.current) {
      beam.current.rotation.z = t * 0.32
      beam.current.material.opacity = 0.045 + Math.sin(t * 1.2) * 0.012
    }
    if (shell.current) {
      shell.current.rotation.y += delta * 0.025
      shell.current.rotation.x += delta * 0.008
    }
    if (ticks.current) ticks.current.rotation.z -= delta * 0.032
  })

  return (
    <group>
      <mesh ref={beam} rotation={[0, 0, 0]} position={[0, 0, -0.2]}>
        <planeGeometry args={[0.12, 10]} />
        <meshBasicMaterial color="#5defff" transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <sphereGeometry args={[6.55, 24, 16]} />
        <meshBasicMaterial color="#58cfff" wireframe transparent opacity={0.018} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={ticks} rotation={[0, 0, 0.2]}>
        {[2.7, 3.55, 4.45, 5.35].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, i === 0 ? 0.006 : 0.0035, 4, 180]} />
            <meshBasicMaterial color={i % 2 ? '#6bffb3' : '#58dfff'} transparent opacity={0.08 - i * 0.01} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function CentralCore() {
  const group = useRef()
  const ringA = useRef()
  const ringB = useRef()
  const ringC = useRef()

  useFrame(({ clock }, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08
    if (ringA.current) ringA.current.rotation.z += delta * 0.22
    if (ringB.current) ringB.current.rotation.x -= delta * 0.16
    if (ringC.current) ringC.current.rotation.y += delta * 0.12

    const pulse = 1 + Math.sin(clock.elapsedTime * 1.65) * 0.035
    if (group.current) group.current.scale.setScalar(pulse)
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.16, 5]} />
        <MeshDistortMaterial
          color="#07151d"
          emissive="#35e7ff"
          emissiveIntensity={2.5}
          roughness={0.12}
          metalness={0.88}
          distort={0.19}
          speed={1.9}
        />
      </mesh>

      <mesh scale={1.16}>
        <icosahedronGeometry args={[1.18, 2]} />
        <meshBasicMaterial color="#6df3ff" wireframe transparent opacity={0.16} toneMapped={false} />
      </mesh>

      <group ref={ringA} rotation={[1.1, 0.4, 0.25]}>
        <mesh>
          <torusGeometry args={[1.65, 0.012, 8, 180]} />
          <meshBasicMaterial color="#68ecff" transparent opacity={0.72} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI * 0.36]}>
          <torusGeometry args={[1.65, 0.036, 8, 15, 0.48]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringB} rotation={[0.35, 1.25, -0.4]}>
        <mesh>
          <torusGeometry args={[1.9, 0.009, 8, 180]} />
          <meshBasicMaterial color="#65ffcf" transparent opacity={0.4} toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringC} rotation={[-0.7, 0.3, 1.05]}>
        <mesh>
          <torusGeometry args={[2.18, 0.006, 8, 180]} />
          <meshBasicMaterial color="#8fa7ff" transparent opacity={0.24} toneMapped={false} />
        </mesh>
      </group>

      <ExpandingWave phase={0} color="#62ebff" tilt={0.06} />
      <ExpandingWave phase={0.34} color="#74ffb4" tilt={-0.08} />
      <ExpandingWave phase={0.67} color="#7ea0ff" tilt={0.13} />
      <OrbitingSignals />

      <pointLight color="#46eaff" intensity={20} distance={6.8} decay={2} />

      <Html position={[0, -1.72, 0]} center distanceFactor={9} className="core-label-wrap">
        <div className="core-label">
          <span className="core-kicker">ORBITAL CORE // REASONING FABRIC</span>
          <strong>REVENUE ORCHESTRATOR</strong>
          <small><i /> 12 autonomous systems · 38 live workflows</small>
        </div>
      </Html>
    </group>
  )
}

function AgentNode({ agent, index }) {
  const ref = useRef()
  const halo = useRef()
  const burst = useRef()
  const satellites = useRef()

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.y += delta * (0.08 + index * 0.003)
    ref.current.position.y = agent.position[1] + Math.sin(t * 0.7 + index * 0.8) * 0.09
    if (halo.current) halo.current.rotation.z += delta * (index % 2 ? -0.22 : 0.22)
    if (satellites.current) satellites.current.rotation.z += delta * (0.24 + index * 0.012)
    if (burst.current) {
      const cycle = (t * 0.22 + index * 0.137) % 1
      const trigger = cycle > 0.78 ? (cycle - 0.78) / 0.22 : 0
      burst.current.scale.setScalar(1 + trigger * 3.8)
      burst.current.material.opacity = trigger ? (1 - trigger) * 0.28 : 0
    }
  })

  return (
    <group ref={ref} position={agent.position}>
      <mesh>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#061219"
          emissive={agent.color}
          emissiveIntensity={2.9}
          metalness={0.86}
          roughness={0.16}
        />
      </mesh>
      <mesh ref={halo} rotation={[1.1, 0.5, 0]}>
        <torusGeometry args={[0.48, 0.011, 6, 64]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.66} toneMapped={false} />
      </mesh>
      <mesh ref={burst} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.43, 52]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={satellites}>
        <mesh position={[0.64, 0, 0]}>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[-0.64, 0, 0]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshBasicMaterial color={agent.color} toneMapped={false} />
        </mesh>
      </group>
      <mesh scale={1.95}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.038} toneMapped={false} depthWrite={false} />
      </mesh>
      <Html position={[0.62, 0.05, 0]} distanceFactor={10} className="agent-label-wrap">
        <div className="agent-label">
          <span>{String(index + 1).padStart(2, '0')} // ACTIVE // DECISION LOOP</span>
          <strong>{agent.label}</strong>
          <small>{agent.metric}</small>
        </div>
      </Html>
    </group>
  )
}

function SecondaryNode({ position, index }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    const s = 0.72 + Math.sin(t * 1.4 + index) * 0.22
    ref.current.scale.setScalar(s)
    ref.current.position.x = position[0] + Math.sin(t * 0.21 + index) * 0.055
    ref.current.position.y = position[1] + Math.cos(t * 0.27 + index * 0.8) * 0.055
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.055, 10, 10]} />
      <meshBasicMaterial color={index % 3 === 0 ? '#77ffb0' : '#53ddff'} toneMapped={false} />
    </mesh>
  )
}

function SignalSwarm() {
  const group = useRef()
  const points = useMemo(() => {
    let seed = 17
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    return Array.from({ length: 44 }, (_, i) => {
      const angle = rand() * Math.PI * 2
      const radius = 3 + rand() * 4.2
      return {
        base: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.67, -2.1 - rand() * 2.8],
        speed: 0.05 + rand() * 0.12,
        phase: rand() * Math.PI * 2,
        size: 0.012 + rand() * 0.026,
        color: i % 6 === 0 ? '#77ffad' : '#62dfff',
      }
    })
  }, [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const p = points[i]
      child.position.x = p.base[0] + Math.sin(t * p.speed + p.phase) * 0.22
      child.position.y = p.base[1] + Math.cos(t * p.speed * 1.4 + p.phase) * 0.16
      const blink = 0.45 + Math.sin(t * 1.8 + p.phase) * 0.4
      child.material.opacity = Math.max(0.08, blink)
    })
  })

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <mesh key={i} position={p.base}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.35} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function CameraDirector() {
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera, pointer, clock }) => {
    const t = clock.elapsedTime
    const cinematicX = Math.sin(t * 0.075) * 0.7
    const cinematicY = Math.sin(t * 0.11) * 0.22
    const cinematicZ = 10.9 + Math.sin(t * 0.055) * 0.65

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cinematicX + pointer.x * 0.36, 0.018)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.55 + cinematicY + pointer.y * 0.2, 0.018)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cinematicZ, 0.014)
    target.set(Math.sin(t * 0.05) * 0.16, Math.cos(t * 0.06) * 0.08, 0)
    camera.lookAt(target)
  })

  return null
}

export default function AgentNetwork() {
  return (
    <>
      <color attach="background" args={['#010507']} />
      <fog attach="fog" args={['#010507', 7.5, 22]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[2, 6, 8]} intensity={0.9} color="#dff8ff" />

      <Stars radius={38} depth={26} count={1100} factor={1.4} saturation={0} fade speed={0.2} />
      <Sparkles count={130} scale={[15, 10, 8]} size={1.35} speed={0.14} opacity={0.22} color="#7deaff" />
      <SignalSwarm />

      <group rotation={[-0.04, 0, -0.015]}>
        <ScannerField />
        <CentralCore />

        {AGENTS.map((agent, index) => (
          <Connection
            key={`core-${agent.id}`}
            from={[0, 0, 0]}
            to={agent.position}
            color={agent.color}
            strength={0.72 + (index % 3) * 0.12}
            bend={index % 2 ? 0.48 : -0.42}
          />
        ))}

        <Connection from={AGENTS[0].position} to={AGENTS[1].position} color="#5deaff" strength={0.5} bend={0.62} />
        <Connection from={AGENTS[0].position} to={AGENTS[2].position} color="#8da6ff" strength={0.42} bend={-0.55} />
        <Connection from={AGENTS[2].position} to={AGENTS[3].position} color="#a57cff" strength={0.46} bend={0.7} />
        <Connection from={AGENTS[3].position} to={AGENTS[4].position} color="#74f9dc" strength={0.52} bend={-0.58} />
        <Connection from={AGENTS[4].position} to={AGENTS[5].position} color="#79ff9d" strength={0.62} bend={0.52} />
        <Connection from={AGENTS[5].position} to={AGENTS[6].position} color="#79ffc8" strength={0.5} bend={-0.62} />
        <Connection from={AGENTS[6].position} to={AGENTS[7].position} color="#c5e980" strength={0.38} bend={0.5} />
        <Connection from={AGENTS[7].position} to={AGENTS[1].position} color="#7edfff" strength={0.34} bend={-0.66} />
        <Connection from={AGENTS[2].position} to={AGENTS[5].position} color="#8bffa9" strength={0.28} bend={0.78} />
        <Connection from={AGENTS[0].position} to={AGENTS[4].position} color="#6fffc0" strength={0.25} bend={-0.82} />

        {AGENTS.map((agent, index) => <AgentNode key={agent.id} agent={agent} index={index} />)}
        {SECONDARY.map((position, index) => <SecondaryNode key={index} position={position} index={index} />)}

        {SECONDARY.map((position, index) => {
          const target = AGENTS[index % AGENTS.length]
          return (
            <Connection
              key={`secondary-${index}`}
              from={position}
              to={target.position}
              color={index % 3 === 0 ? '#7dffaf' : '#4ad7ff'}
              strength={0.18}
              bend={index % 2 ? 0.7 : -0.7}
            />
          )
        })}
      </group>

      <CameraDirector />
    </>
  )
}
