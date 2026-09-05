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

function Pulse({ from, to, color, phase = 0, speed = 0.22, size = 0.055 }) {
  const ref = useRef()
  const start = useMemo(() => new THREE.Vector3(...from), [from])
  const end = useMemo(() => new THREE.Vector3(...to), [to])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * speed + phase) % 1
    ref.current.position.lerpVectors(start, end, t)
    const flare = 0.8 + Math.sin(t * Math.PI) * 0.9
    ref.current.scale.setScalar(flare)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function Connection({ from, to, color = '#4cdfff', strength = 1 }) {
  return (
    <group>
      <Line points={[from, to]} color={color} transparent opacity={0.09 + strength * 0.09} lineWidth={0.55 + strength * 0.35} />
      <Pulse from={from} to={to} color={color} phase={0.08} speed={0.16 + strength * 0.045} />
      {strength > 0.7 && <Pulse from={from} to={to} color="#ffffff" phase={0.55} speed={0.18 + strength * 0.05} size={0.025} />}
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
          emissiveIntensity={2.2}
          roughness={0.15}
          metalness={0.8}
          distort={0.18}
          speed={1.8}
        />
      </mesh>

      <mesh scale={1.16}>
        <icosahedronGeometry args={[1.18, 2]} />
        <meshBasicMaterial color="#6df3ff" wireframe transparent opacity={0.14} toneMapped={false} />
      </mesh>

      <group ref={ringA} rotation={[1.1, 0.4, 0.25]}>
        <mesh>
          <torusGeometry args={[1.65, 0.012, 8, 180]} />
          <meshBasicMaterial color="#68ecff" transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI * 0.36]}>
          <torusGeometry args={[1.65, 0.036, 8, 15, 0.48]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringB} rotation={[0.35, 1.25, -0.4]}>
        <mesh>
          <torusGeometry args={[1.9, 0.009, 8, 180]} />
          <meshBasicMaterial color="#65ffcf" transparent opacity={0.38} toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringC} rotation={[-0.7, 0.3, 1.05]}>
        <mesh>
          <torusGeometry args={[2.18, 0.006, 8, 180]} />
          <meshBasicMaterial color="#8fa7ff" transparent opacity={0.22} toneMapped={false} />
        </mesh>
      </group>

      <pointLight color="#46eaff" intensity={18} distance={6.5} decay={2} />

      <Html position={[0, -1.72, 0]} center distanceFactor={9} className="core-label-wrap">
        <div className="core-label">
          <span className="core-kicker">ORBITAL CORE</span>
          <strong>REVENUE ORCHESTRATOR</strong>
          <small><i /> 12 autonomous systems online</small>
        </div>
      </Html>
    </group>
  )
}

function AgentNode({ agent, index }) {
  const ref = useRef()
  const halo = useRef()

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * (0.08 + index * 0.003)
    ref.current.position.y = agent.position[1] + Math.sin(clock.elapsedTime * 0.7 + index * 0.8) * 0.09
    if (halo.current) halo.current.rotation.z += delta * (index % 2 ? -0.18 : 0.18)
  })

  return (
    <group ref={ref} position={agent.position}>
      <mesh>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#061219"
          emissive={agent.color}
          emissiveIntensity={2.7}
          metalness={0.86}
          roughness={0.18}
        />
      </mesh>
      <mesh ref={halo} rotation={[1.1, 0.5, 0]}>
        <torusGeometry args={[0.48, 0.011, 6, 64]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.62} toneMapped={false} />
      </mesh>
      <mesh scale={1.9}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.035} toneMapped={false} depthWrite={false} />
      </mesh>
      <Html position={[0.62, 0.05, 0]} distanceFactor={10} className="agent-label-wrap">
        <div className="agent-label">
          <span>{String(index + 1).padStart(2, '0')} // ACTIVE</span>
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
    const s = 0.75 + Math.sin(clock.elapsedTime * 1.4 + index) * 0.2
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.055, 10, 10]} />
      <meshBasicMaterial color={index % 3 === 0 ? '#77ffb0' : '#53ddff'} toneMapped={false} />
    </mesh>
  )
}

function CameraDrift() {
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.52, 0.025)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.6 + pointer.y * 0.28, 0.025)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 11.2, 0.02)
    camera.lookAt(target)
  })

  return null
}

export default function AgentNetwork() {
  const majorConnections = AGENTS.map((agent, index) => (
    <Connection key={`core-${agent.id}`} from={[0, 0, 0]} to={agent.position} color={agent.color} strength={0.72 + (index % 3) * 0.12} />
  ))

  return (
    <>
      <color attach="background" args={['#010507']} />
      <fog attach="fog" args={['#010507', 8, 22]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[2, 6, 8]} intensity={0.85} color="#dff8ff" />

      <Stars radius={38} depth={26} count={850} factor={1.45} saturation={0} fade speed={0.18} />
      <Sparkles count={95} scale={[15, 10, 7]} size={1.25} speed={0.12} opacity={0.2} color="#7deaff" />

      <group rotation={[-0.04, 0, -0.015]}>
        <CentralCore />
        {majorConnections}

        <Connection from={AGENTS[0].position} to={AGENTS[1].position} color="#5deaff" strength={0.42} />
        <Connection from={AGENTS[0].position} to={AGENTS[2].position} color="#8da6ff" strength={0.36} />
        <Connection from={AGENTS[2].position} to={AGENTS[3].position} color="#a57cff" strength={0.4} />
        <Connection from={AGENTS[3].position} to={AGENTS[4].position} color="#74f9dc" strength={0.48} />
        <Connection from={AGENTS[4].position} to={AGENTS[5].position} color="#79ff9d" strength={0.58} />
        <Connection from={AGENTS[5].position} to={AGENTS[6].position} color="#79ffc8" strength={0.46} />
        <Connection from={AGENTS[6].position} to={AGENTS[7].position} color="#c5e980" strength={0.34} />
        <Connection from={AGENTS[7].position} to={AGENTS[1].position} color="#7edfff" strength={0.3} />

        {AGENTS.map((agent, index) => <AgentNode key={agent.id} agent={agent} index={index} />)}
        {SECONDARY.map((position, index) => <SecondaryNode key={index} position={position} index={index} />)}

        {SECONDARY.map((position, index) => {
          const target = AGENTS[index % AGENTS.length]
          return <Connection key={`secondary-${index}`} from={position} to={target.position} color={index % 3 === 0 ? '#7dffaf' : '#4ad7ff'} strength={0.18} />
        })}
      </group>

      <CameraDrift />
    </>
  )
}
