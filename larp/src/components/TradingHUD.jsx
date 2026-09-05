import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Bot,
  BrainCircuit,
  ChevronRight,
  CircleDollarSign,
  Crosshair,
  Eye,
  FastForward,
  Gauge,
  Layers3,
  Play,
  Radar,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const TF_CONFIG = {
  '1M': { count: 50, seed: 17, drift: 0.42, volatility: 1.45 },
  '5M': { count: 42, seed: 29, drift: 0.62, volatility: 1.85 },
  '15M': { count: 34, seed: 43, drift: 0.88, volatility: 2.25 },
}

function mulberry32(seed) {
  return () => {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCandles(timeframe) {
  const cfg = TF_CONFIG[timeframe]
  const rand = mulberry32(cfg.seed)
  const candles = []
  let close = 6248.6

  for (let i = 0; i < cfg.count; i++) {
    const stagedFuture = i > cfg.count - 12
    let move

    if (stagedFuture) {
      const path = [-1.2, -0.7, 1.8, 3.4, 2.1, 4.6, 3.2, 5.5, 4.1, 5.9, 3.6, 6.4]
      move = path[i - (cfg.count - 12)] * (timeframe === '15M' ? 1.35 : timeframe === '5M' ? 1.12 : 0.92)
    } else {
      move = (rand() - 0.47) * cfg.volatility + Math.sin(i * 0.62) * 0.72 + cfg.drift * 0.08
    }

    const open = close
    close = open + move
    const high = Math.max(open, close) + 0.45 + rand() * 1.25
    const low = Math.min(open, close) - 0.45 - rand() * 1.15

    candles.push({
      open,
      high,
      low,
      close,
      volume: 50 + rand() * 80,
      label: `${String(9 + Math.floor(i / 12)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`,
    })
  }

  const sweepIndex = cfg.count - 13
  const rangeHigh = Math.max(...candles.slice(sweepIndex - 7, sweepIndex + 1).map(c => c.high))
  candles[sweepIndex].high = rangeHigh + 3.6
  candles[sweepIndex].close = candles[sweepIndex].open - 1.3
  return candles
}

function money(value) {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

function Chart({ candles, visibleCount, phase, accelerated, timeframe }) {
  const visible = candles.slice(0, visibleCount)
  const W = 1000
  const H = 470
  const pad = { top: 28, right: 78, bottom: 42, left: 24 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom
  const min = Math.min(...visible.map(c => c.low)) - 3
  const max = Math.max(...visible.map(c => c.high)) + 4
  const xStep = plotW / Math.max(candles.length, 1)
  const bodyW = Math.max(4, xStep * 0.56)
  const y = value => pad.top + (max - value) / (max - min) * plotH
  const x = i => pad.left + i * xStep + xStep * 0.5

  const setupStart = candles.length - 22
  const setupEnd = candles.length - 13
  const entryIndex = candles.length - 11
  const entry = candles[entryIndex].open + 0.35
  const stop = entry - 4.2
  const tp1 = entry + 6.0
  const tp2 = entry + 12.5
  const current = visible[visible.length - 1]
  const currentPrice = current?.close ?? entry
  const rrTop = y(tp2)
  const rrEntry = y(entry)
  const rrStop = y(stop)
  const setupX = x(setupStart) - bodyW
  const setupWidth = x(setupEnd) - x(setupStart) + bodyW * 2

  return (
    <div className={`trade-chart-shell phase-${phase} ${accelerated ? 'is-accelerated' : ''}`}>
      <svg className="trade-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="profitZone" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#75ffab" stopOpacity=".16" />
            <stop offset="100%" stopColor="#75ffab" stopOpacity=".025" />
          </linearGradient>
          <linearGradient id="riskZone" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff7b7b" stopOpacity=".025" />
            <stop offset="100%" stopColor="#ff7b7b" stopOpacity=".11" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h-${i}`} x1={pad.left} x2={W - pad.right} y1={pad.top + i * plotH / 6} y2={pad.top + i * plotH / 6} className="chart-grid-line" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v-${i}`} y1={pad.top} y2={H - pad.bottom} x1={pad.left + i * plotW / 9} x2={pad.left + i * plotW / 9} className="chart-grid-line vertical" />
        ))}

        {phase !== 'idle' && (
          <g className="session-range">
            <rect x={setupX} y={y(Math.max(...candles.slice(setupStart, setupEnd + 1).map(c => c.high)))} width={setupWidth} height={y(Math.min(...candles.slice(setupStart, setupEnd + 1).map(c => c.low))) - y(Math.max(...candles.slice(setupStart, setupEnd + 1).map(c => c.high)))} rx="3" />
            <text x={setupX + 8} y={y(Math.max(...candles.slice(setupStart, setupEnd + 1).map(c => c.high))) + 15}>NY AM RANGE // MODEL WINDOW 09:30–10:15</text>
          </g>
        )}

        {(phase === 'setup' || phase === 'executing' || phase === 'closed') && (
          <g className="trade-plan-layer">
            <rect x={x(entryIndex)} y={rrTop} width={W - pad.right - x(entryIndex)} height={rrEntry - rrTop} fill="url(#profitZone)" />
            <rect x={x(entryIndex)} y={rrEntry} width={W - pad.right - x(entryIndex)} height={rrStop - rrEntry} fill="url(#riskZone)" />
            <line x1={x(entryIndex) - 16} x2={W - pad.right} y1={rrEntry} y2={rrEntry} className="entry-line" />
            <line x1={x(entryIndex) - 16} x2={W - pad.right} y1={rrStop} y2={rrStop} className="stop-line" />
            <line x1={x(entryIndex) - 16} x2={W - pad.right} y1={y(tp1)} y2={y(tp1)} className="tp-line tp1" />
            <line x1={x(entryIndex) - 16} x2={W - pad.right} y1={y(tp2)} y2={y(tp2)} className="tp-line tp2" />
            <text x={W - pad.right + 8} y={rrEntry + 3} className="entry-label">ENTRY</text>
            <text x={W - pad.right + 8} y={rrStop + 3} className="stop-label">SL</text>
            <text x={W - pad.right + 8} y={y(tp1) + 3} className="tp-label">TP1</text>
            <text x={W - pad.right + 8} y={y(tp2) + 3} className="tp-label">TP2</text>
            <g className="entry-marker" transform={`translate(${x(entryIndex)}, ${rrEntry})`}>
              <circle r="7" />
              <path d="M -3 1 L 0 -3 L 3 1" />
            </g>
          </g>
        )}

        {phase !== 'idle' && (
          <g className="liquidity-layer">
            <line x1={x(setupStart - 3)} x2={x(setupEnd + 1)} y1={y(candles[setupEnd].high + 2.1)} y2={y(candles[setupEnd].high + 2.1)} />
            <text x={x(setupStart - 3)} y={y(candles[setupEnd].high + 2.1) - 7}>BUY-SIDE LIQUIDITY</text>
            <circle cx={x(setupEnd)} cy={y(candles[setupEnd].high)} r="12" className="sweep-ring" />
            <path d={`M ${x(setupEnd) - 20} ${y(candles[setupEnd].high) - 28} L ${x(setupEnd)} ${y(candles[setupEnd].high) - 7}`} className="sweep-arrow" />
            <text x={x(setupEnd) - 92} y={y(candles[setupEnd].high) - 34} className="sweep-text">LIQUIDITY SWEEP</text>
          </g>
        )}

        {visible.map((c, i) => {
          const up = c.close >= c.open
          const cx = x(i)
          const top = y(Math.max(c.open, c.close))
          const bottom = y(Math.min(c.open, c.close))
          const h = Math.max(1.5, bottom - top)
          return (
            <g key={`${timeframe}-${i}`} className={`candle ${up ? 'up' : 'down'} ${i === visible.length - 1 ? 'current' : ''}`}>
              <line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)} />
              <rect x={cx - bodyW / 2} y={top} width={bodyW} height={h} rx="1" />
            </g>
          )
        })}

        {current && (
          <g className="current-price">
            <line x1={x(visible.length - 1) + bodyW} x2={W - pad.right} y1={y(currentPrice)} y2={y(currentPrice)} />
            <rect x={W - pad.right + 3} y={y(currentPrice) - 10} width="65" height="20" rx="3" />
            <text x={W - pad.right + 35.5} y={y(currentPrice) + 3} textAnchor="middle">{currentPrice.toFixed(2)}</text>
          </g>
        )}

        {phase === 'scanning' && <rect className="svg-scan-beam" x="0" y={pad.top} width="42" height={plotH} />}

        {visible.filter((_, i) => i % Math.max(1, Math.floor(visible.length / 6)) === 0).map((c, i) => {
          const sourceIndex = visible.indexOf(c)
          return <text key={`time-${sourceIndex}`} x={x(sourceIndex)} y={H - 16} className="time-label" textAnchor="middle">{c.label}</text>
        })}
      </svg>

      <div className="chart-symbol">
        <div><strong>NQ</strong><span>NASDAQ 100 FUTURES</span></div>
        <small>{timeframe} · SIMULATED FEED</small>
      </div>

      <div className="chart-watermark">PAPER MARKET DATA // STAGED DEMO</div>
    </div>
  )
}

function AgentVote({ phase }) {
  const active = phase === 'setup' || phase === 'executing' || phase === 'closed'
  return (
    <div className="paper-panel model-vote-panel">
      <div className="trade-panel-title"><BrainCircuit size={12} /> MODEL CONSENSUS <span>{active ? '94.2%' : '71.8%'}</span></div>
      <div className="vote-stack">
        <div><span>LIQUIDITY MODEL</span><b className={active ? 'long' : ''}>{active ? 'LONG' : 'WAIT'}</b></div>
        <div><span>ORDERFLOW MODEL</span><b className={active ? 'long' : ''}>{active ? 'LONG' : 'NEUTRAL'}</b></div>
        <div><span>REGIME MODEL</span><b className={active ? 'long' : ''}>{active ? 'EXPANSION' : 'SCAN'}</b></div>
      </div>
      <div className="confidence-track"><i style={{ '--confidence': active ? '94%' : '72%' }} /></div>
    </div>
  )
}

function ReasoningFeed({ phase, accelerated }) {
  const rows = {
    idle: ['Awaiting operator scan', 'Market state cached', 'Risk engine nominal'],
    scanning: ['12,482 micro-signals evaluated', 'Liquidity cluster detected', 'Volatility regime: expansion'],
    setup: ['Buy-side liquidity swept', 'Displacement confirmed', 'Entry at reclaim'],
    executing: ['Paper fill acknowledged', 'Stop geometry validated', accelerated ? 'Time compression 8×' : 'Position state streaming'],
    closed: ['TP2 condition satisfied', 'Paper position reconciled', 'Trade archived to simulation journal'],
  }[phase]

  return (
    <div className="paper-panel reasoning-panel">
      <div className="trade-panel-title"><Bot size={12} /> AGENT REASONING <i /></div>
      {rows.map((row, i) => (
        <motion.div className="reasoning-row" key={`${phase}-${row}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <span>{String(i + 1).padStart(2, '0')}</span><strong>{row}</strong><small>{[2.4, 18.7, 8.1][i]}ms</small>
        </motion.div>
      ))}
    </div>
  )
}

export default function TradingHUD() {
  const [timeframe, setTimeframe] = useState('1M')
  const candles = useMemo(() => makeCandles(timeframe), [timeframe])
  const initialCount = candles.length - 12
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const [phase, setPhase] = useState('idle')
  const [accelerated, setAccelerated] = useState(false)
  const [signals, setSignals] = useState(0)
  const [reveal, setReveal] = useState(false)
  const [toast, setToast] = useState(null)

  const entryIndex = candles.length - 11
  const entry = candles[entryIndex].open + 0.35
  const last = candles[Math.max(0, visibleCount - 1)]
  const paperPnl = phase === 'executing' || phase === 'closed' ? (last.close - entry) * 38.4 : 0
  const rMultiple = paperPnl / 308.6

  useEffect(() => {
    setVisibleCount(candles.length - 12)
    setPhase('idle')
    setAccelerated(false)
    setSignals(0)
    setToast(null)
  }, [candles])

  useEffect(() => {
    if (phase !== 'scanning') return
    setSignals(0)
    const id = setInterval(() => setSignals(v => Math.min(12482, v + 517 + Math.floor(Math.random() * 340))), 75)
    const end = setTimeout(() => setSignals(12482), 1450)
    return () => { clearInterval(id); clearTimeout(end) }
  }, [phase])

  useEffect(() => {
    if (phase !== 'executing') return
    if (visibleCount >= candles.length) return
    const id = setInterval(() => {
      setVisibleCount(v => Math.min(candles.length, v + 1))
    }, accelerated ? 210 : 820)
    return () => clearInterval(id)
  }, [phase, accelerated, visibleCount, candles.length])

  useEffect(() => {
    if (phase === 'executing' && visibleCount === candles.length) {
      setToast({ title: 'TP2 CONDITION TOUCHED', value: money(paperPnl), note: 'PAPER POSITION READY TO CLOSE' })
    }
  }, [phase, visibleCount, candles.length, paperPnl])

  const scan = () => {
    setPhase('scanning')
    setToast({ title: 'MARKET SCAN STARTED', value: '12.4K', note: 'SIMULATED SIGNALS' })
  }

  const markSetup = () => {
    setPhase('setup')
    setToast({ title: 'EXECUTION WINDOW OPEN', value: '94.2%', note: 'MODEL CONSENSUS' })
  }

  const execute = () => {
    setPhase('executing')
    setVisibleCount(initialCount + 1)
    setToast({ title: 'PAPER ORDER FILLED', value: 'LONG', note: `SIMULATED @ ${entry.toFixed(2)}` })
  }

  const accelerate = () => {
    if (phase !== 'executing') execute()
    setAccelerated(v => !v)
    setToast({ title: 'TIME COMPRESSION', value: accelerated ? '1×' : '8×', note: 'SIMULATION REPLAY SPEED' })
  }

  const closeTrade = () => {
    setVisibleCount(candles.length)
    setPhase('closed')
    setAccelerated(false)
    setToast({ title: 'PAPER POSITION CLOSED', value: '+$842.61', note: '+2.73R SIMULATED RESULT' })
  }

  const replay = () => {
    setVisibleCount(initialCount)
    setPhase('scanning')
    setAccelerated(false)
    setToast({ title: 'REPLAYING LIQUIDITY EVENT', value: '0.25×', note: 'STAGED HISTORICAL SEQUENCE' })
  }

  return (
    <div className={`trading-hud ${reveal ? 'truth-revealed' : ''}`}>
      <div className="trade-top-left">
        <div className="trade-brand"><Crosshair size={17} /><div><small>AUTONOMOUS EXECUTION LAYER</small><strong>ORBITAL // TRADING OS</strong></div></div>
        <div className="paper-disclosure"><i /> SIMULATED / PAPER · NO BROKER CONNECTION</div>
      </div>

      <div className="trade-top-right">
        <span><Radar size={10} /> FEED <b>STAGED</b></span>
        <span><Gauge size={10} /> LATENCY <b>3.8ms</b></span>
        <span><ShieldCheck size={10} /> RISK <b>NOMINAL</b></span>
      </div>

      <section className="trade-center-stage">
        <div className="trade-chart-head">
          <div className="timeframes">
            {Object.keys(TF_CONFIG).map(tf => <button key={tf} className={timeframe === tf ? 'active' : ''} onClick={() => setTimeframe(tf)}>{tf}</button>)}
          </div>
          <div className="market-badges">
            <span>HTF BIAS <b>{phase === 'setup' || phase === 'executing' || phase === 'closed' ? 'BULLISH' : 'NEUTRAL'}</b></span>
            <span>REGIME <b>{phase === 'idle' ? 'BALANCED' : 'EXPANSION'}</b></span>
            <span>CONFIDENCE <b>{phase === 'setup' || phase === 'executing' || phase === 'closed' ? '94.2%' : '71.8%'}</b></span>
          </div>
        </div>

        <Chart candles={candles} visibleCount={visibleCount} phase={phase} accelerated={accelerated} timeframe={timeframe} />

        <div className="chart-side-metrics left">
          <div><span>MICRO SIGNALS</span><strong>{signals ? signals.toLocaleString() : '—'}</strong></div>
          <div><span>LIQUIDITY POOLS</span><strong>{phase === 'idle' ? '—' : '07'}</strong></div>
          <div><span>MODEL VOTES</span><strong>{phase === 'setup' || phase === 'executing' || phase === 'closed' ? '3/3' : '1/3'}</strong></div>
        </div>

        <div className="paper-panel position-card">
          <div className="trade-panel-title"><Activity size={12} /> PAPER POSITION <span>{phase === 'executing' ? 'OPEN' : phase === 'closed' ? 'CLOSED' : 'STANDBY'}</span></div>
          <div className="paper-pnl">
            <span>UNREALIZED P&L</span>
            <strong>{phase === 'closed' ? '+$842.61' : money(paperPnl)}</strong>
            <small>{phase === 'closed' ? '+2.73R' : `${rMultiple >= 0 ? '+' : ''}${rMultiple.toFixed(2)}R`} · SIMULATED</small>
          </div>
          <div className="position-grid">
            <div><span>ENTRY</span><b>{entry.toFixed(2)}</b></div>
            <div><span>STOP</span><b>{(entry - 4.2).toFixed(2)}</b></div>
            <div><span>TP1</span><b>{(entry + 6).toFixed(2)}</b></div>
            <div><span>TP2</span><b>{(entry + 12.5).toFixed(2)}</b></div>
          </div>
          <div className="paper-equity"><i style={{ '--eq': phase === 'closed' ? '91%' : phase === 'executing' ? `${Math.min(88, 36 + Math.max(0, paperPnl / 12))}%` : '24%' }} /></div>
        </div>
      </section>

      <aside className="trade-left-rail">
        <AgentVote phase={phase} />
        <ReasoningFeed phase={phase} accelerated={accelerated} />
      </aside>

      <aside className="trade-right-rail">
        <div className="paper-panel risk-engine">
          <div className="trade-panel-title"><Target size={12} /> RISK ENGINE <i /></div>
          <div className="risk-orbit"><div><span>0.42%</span><small>RISK</small></div></div>
          <div className="risk-data"><span>MAX DD <b>1.8%</b></span><span>R:R <b>2.97</b></span><span>SIZE <b>2.0</b></span></div>
        </div>
        <div className="paper-panel execution-router">
          <div className="trade-panel-title"><Zap size={12} /> EXECUTION ROUTER</div>
          {['MARKET SIGNAL', 'RISK CHECK', 'ORDER ROUTE', 'POSITION STATE'].map((x, i) => (
            <div className={`route-step ${phase === 'executing' || phase === 'closed' ? 'active' : ''}`} key={x}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span><i /></div>
          ))}
        </div>
      </aside>

      <div className="trade-controls paper-panel">
        <button onClick={scan}><ScanLine size={13} /> SCAN MARKET</button>
        <button onClick={markSetup}><Crosshair size={13} /> MARK SETUP</button>
        <button onClick={execute} className="primary"><Play size={13} /> PAPER EXECUTE</button>
        <button onClick={accelerate}><FastForward size={13} /> {accelerated ? '1× SPEED' : 'ACCELERATE'}</button>
        <button onClick={closeTrade} className="profit"><CircleDollarSign size={13} /> TAKE PROFIT</button>
        <button onClick={replay}><RotateCcw size={13} /> REPLAY SWEEP</button>
        <button onClick={() => setReveal(v => !v)} className="truth"><Eye size={13} /> {reveal ? 'HIDE REVEAL' : "WHAT'S REAL?"}</button>
      </div>

      <AnimatePresence mode="wait">
        {toast && (
          <motion.div className="trade-toast paper-panel" key={`${toast.title}-${toast.value}`} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}>
            <div><TrendingUp size={14} /></div>
            <span><small>{toast.title}</small><strong>{toast.note}</strong></span>
            <b>{toast.value}</b>
            <i />
          </motion.div>
        )}
      </AnimatePresence>

      {reveal && (
        <motion.div className="truth-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="truth-card">
            <Sparkles size={19} />
            <small>EXPOSÉ MODE</small>
            <strong>THIS ENTIRE TRADE WAS UI THEATER.</strong>
            <p>No broker. No live market feed. No autonomous trading system. The “future” candles were generated in advance, the outcome path was staged, and the P&L is presentation logic.</p>
            <div className="truth-tags">
              <span>PRE-WRITTEN WIN PATH</span><span>MOCK CANDLES</span><span>DECORATIVE AGENTS</span><span>SIMULATED P&L</span><span>NO BROKER</span><span>NO MARKET DATA</span>
            </div>
          </div>
          <div className="truth-callout c1"><ChevronRight /> RANDOMIZED / STAGED CANDLES</div>
          <div className="truth-callout c2"><ChevronRight /> PRE-WRITTEN PROFIT PATH</div>
          <div className="truth-callout c3"><ChevronRight /> DECORATIVE “MODEL” TELEMETRY</div>
          <div className="truth-callout c4"><ChevronRight /> NO EXECUTION OCCURRED</div>
        </motion.div>
      )}

      <div className="trade-bottom-status">
        <span><Layers3 size={10} /> PAPER FEED / NQ / {timeframe}</span>
        <span><BrainCircuit size={10} /> 3 MODEL VOTERS</span>
        <span><Activity size={10} /> {phase.toUpperCase()}</span>
        <strong><i /> SIMULATION ENVIRONMENT</strong>
      </div>
    </div>
  )
}
