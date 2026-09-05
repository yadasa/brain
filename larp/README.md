# LARP // Autonomous Command Center

A deliberately theatrical, visuals-first 3D "AI agent command center" for the guru-exposé video series.

Everything in this build is **simulated presentation**. Revenue, pipeline, agent activity, task throughput, decision counts, confidence, latency, trace IDs, close events, trading candles, entries, stops, targets, fills, and P&L are mock visual effects. There is no business automation, broker connection, exchange connection, real trading account, or live market feed behind this scene.

## Run locally

```bash
cd larp
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Modes

### Revenue OS

- React Three Fiber / Three.js scene
- Central emissive/distorted AI core
- 8 primary business-agent nodes
- 12 secondary routing/signal nodes
- 44-node ambient signal swarm
- Curved inter-agent routes
- Multiple moving packets per high-priority route
- Periodic agent execution bursts
- Expanding core "decision" waves
- Orbiting core and agent satellites
- Rotating scanner field and faint wireframe data shell
- Autonomous cinematic camera drift/orbit
- Simulated revenue and pipeline counters
- Live agent activity feed
- Periodic autonomous-close / recovered-revenue / pipeline-created events
- Four-stage fake execution trace with animated packets
- Capital-efficiency radial gauge and allocation bars

### Trading OS

- Persistent `SIMULATED / PAPER · NO BROKER CONNECTION` disclosure
- Synthetic NQ candlestick chart with staged future path
- `1M`, `5M`, and `15M` visual timeframe modes
- Animated market scanner sweep
- Animated NY session/time-range box
- Liquidity line + sweep annotation
- Entry, stop, TP1, TP2 and risk/reward projection
- Paper execution marker + fill toast
- Live-looking simulated position P&L
- Paper equity/progress strip
- Fake market micro-signal count
- Fake model consensus / confidence engine
- Fake liquidity, orderflow and regime model votes
- Risk-engine radial visualization
- Animated market → risk → route → position packet chain
- Time-compression / accelerate mode
- Staged take-profit close at `+$842.61` / `+2.73R`
- Replay-sweep interaction
- Full `WHAT'S REAL?` exposé reveal that strips the illusion and labels each fake element

The exact on-camera interaction sequence is documented in [`TRADING_DEMO.md`](./TRADING_DEMO.md).

## Why it feels "alive"

The scene is designed around **apparent causality**, not just ambient animation. A signal appears, the graph reacts, a model votes, an execution path lights up, a paper order appears, the candles move, and a result follows. That sequencing encourages viewers to infer that the visuals are evidence of an autonomous system even though the demo is staged.

Credibility cues are layered deliberately: changing-but-specific values, trace-like timings, healthy/nominal language, selective legibility, rotating geometry, intermittent rather than uniform motion, animated chart ranges, model-vote panels, and outcome-coded green.

The trading mode goes one step further by letting the exposé demonstrate exactly how a pre-written winning path can be made to look predictive. The persistent paper/simulation labeling ensures the artifact itself does not claim real trading performance.

## Still worth adding later

1. Dedicated 9:16 cinematic composition for Instagram/Reels.
2. One-click 20-second automated demo choreography using the interactions in `TRADING_DEMO.md`.
3. More dramatic scripted camera shots: overview → chart → execution route → TP → reveal.
4. Optional audio layer: scanner sweeps, paper-fill click, TP pulse and core bass hits.
5. Floating 3D order-book / heatmap hologram embedded in the WebGL scene.
6. Stylized fake paper-trade journal for B-roll.
