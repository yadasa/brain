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
            <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.45} intensity={1.35} mipmapBlur />
            <Noise opacity={0.016} />
            <Vignette eskil={false} offset={0.19} darkness={0.8} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="hud-grid" aria-hidden="true" />
      <div className="ambient-scan" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="edge-glow" aria-hidden="true" />
      <div className="corner-reticle reticle-tl" aria-hidden="true" />
      <div className="corner-reticle reticle-tr" aria-hidden="true" />
      <div className="corner-reticle reticle-bl" aria-hidden="true" />
      <div className="corner-reticle reticle-br" aria-hidden="true" />
      <div className="frame-code frame-code-left">NODE FABRIC // 284 LINKED ENTITIES // SELF-OPTIMIZING</div>
      <div className="frame-code frame-code-right">SYNTHETIC OPERATIONS LAYER // LATENCY 21.4MS</div>

      <HUD />
    </main>
  )
}
