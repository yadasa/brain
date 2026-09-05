import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import AgentNetwork from './components/AgentNetwork.jsx'
import HUD from './components/HUD.jsx'

export default function App() {
  return (
    <main className="app-shell">
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 0.6, 11.2], fov: 45, near: 0.1, far: 100 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <AgentNetwork />
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.45} intensity={1.25} mipmapBlur />
            <Noise opacity={0.018} />
            <Vignette eskil={false} offset={0.2} darkness={0.78} />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="scanlines" aria-hidden="true" />
      <div className="edge-glow" aria-hidden="true" />
      <HUD />
    </main>
  )
}
