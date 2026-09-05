import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { useState } from 'react'
import AgentNetwork from './components/AgentNetwork.jsx'
import HUD from './components/HUD.jsx'
import TradingHUD from './components/TradingHUD.jsx'
import InfluencerHUD from './components/InfluencerHUD.jsx'

export default function App() {
  const [mode, setMode] = useState('revenue')
  const isTrading = mode === 'trading'
  const isInfluencer = mode === 'influencer'

  return (
    <main className={`app-shell mode-${mode}`}>
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 0.6, 11.2], fov: 45, near: 0.1, far: 100 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <AgentNetwork />
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.45} intensity={isTrading ? 1.18 : isInfluencer ? 1.28 : 1.35} mipmapBlur />
            <Noise opacity={0.016} />
            <Vignette eskil={false} offset={0.19} darkness={isTrading ? 0.86 : isInfluencer ? 0.83 : 0.8} />
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

      <div className="mode-switch" role="tablist" aria-label="Demo mode">
        <button className={mode === 'revenue' ? 'active' : ''} onClick={() => setMode('revenue')}>REVENUE OS</button>
        <button className={mode === 'trading' ? 'active' : ''} onClick={() => setMode('trading')}>TRADING OS</button>
        <button className={`influencer-mode ${mode === 'influencer' ? 'active' : ''}`} onClick={() => setMode('influencer')}>INFLUENCER OS</button>
      </div>

      {mode === 'revenue' && <HUD />}
      {mode === 'trading' && <TradingHUD />}
      {mode === 'influencer' && <InfluencerHUD />}
    </main>
  )
}
