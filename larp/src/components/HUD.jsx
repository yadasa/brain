import { motion } from 'framer-motion'
import { Activity, ArrowUpRight, Bot, CircleDollarSign, Radar, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const activity = [
  ['OUTBOUND', 'Booked 2 qualified calls', '+$8.4K pipeline'],
  ['OFFER OPTIMIZER', 'Variant C promoted', '+12.8% CVR'],
  ['SALES INTELLIGENCE', 'High-intent account detected', '$14.2K potential'],
  ['RETENTION', 'At-risk client recovered', '$3.8K retained'],
  ['MARKET INTEL', 'Pricing shift detected', 'action routed'],
  ['CAPITAL', 'Spend reallocated', '+0.31x ROAS'],
]

function useTicker(start, step, ms) {
  const [value, setValue] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setValue(v => v + step + Math.random() * step * 0.7), ms)
    return () => clearInterval(id)
  }, [step, ms])
  return value
}

function MiniChart({ points = [14, 20, 18, 27, 26, 35, 31, 46, 49, 58, 63, 74] }) {
  const max = Math.max(...points)
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * 100},${42 - (p / max) * 38}`).join(' ')
  return (
    <svg className="mini-chart" viewBox="0 0 100 44" preserveAspectRatio="none">
      <polyline points={coords} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function Stat({ label, value, sub, icon: Icon, accent = 'cyan' }) {
  return (
    <motion.div className={`glass stat-card ${accent}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="stat-head"><Icon size={14} /><span>{label}</span></div>
      <strong>{value}</strong>
      <small><ArrowUpRight size={11} /> {sub}</small>
      <MiniChart />
    </motion.div>
  )
}

export default function HUD() {
  const revenue = useTicker(12842, 7.1, 1900)
  const pipeline = useTicker(186240, 21, 2700)
  const [cursor, setCursor] = useState(0)
  const visible = useMemo(() => Array.from({ length: 4 }, (_, i) => activity[(cursor + i) % activity.length]), [cursor])

  useEffect(() => {
    const id = setInterval(() => setCursor(v => (v + 1) % activity.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hud">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><span /><span /><span /></div>
          <div><small>AUTONOMOUS REVENUE OS</small><strong>ORBITAL // COMMAND</strong></div>
        </div>
        <div className="top-status"><i /> LIVE EXECUTION FABRIC <span>v7.4.21</span></div>
      </header>

      <aside className="left-stack">
        <div className="eyebrow"><Radar size={12} /> EXECUTIVE TELEMETRY</div>
        <Stat label="REVENUE TODAY" value={`$${Math.floor(revenue).toLocaleString()}`} sub="18.4% vs baseline" icon={CircleDollarSign} accent="green" />
        <Stat label="ACTIVE PIPELINE" value={`$${Math.floor(pipeline).toLocaleString()}`} sub="$42.8K agent sourced" icon={Activity} />
        <div className="glass system-grid">
          <div><span>Agents</span><strong>12</strong><small>12 healthy</small></div>
          <div><span>Tasks/min</span><strong>184</strong><small>+23.1%</small></div>
          <div><span>Decisions</span><strong>2.8K</strong><small>today</small></div>
          <div><span>Failures</span><strong>0</strong><small>nominal</small></div>
        </div>
      </aside>

      <aside className="right-stack">
        <div className="eyebrow"><Bot size={12} /> LIVE AGENT ACTIVITY</div>
        <div className="glass activity-feed">
          {visible.map((item, i) => (
            <motion.div className="feed-row" key={`${item[0]}-${cursor}-${i}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <i />
              <div><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small></div>
            </motion.div>
          ))}
        </div>
        <div className="glass return-panel">
          <div><span>CAPITAL EFFICIENCY</span><b>4.38x</b></div>
          <div className="radial"><span>87%</span></div>
          <p>Allocation engine continuously rebalancing toward highest-performing acquisition paths.</p>
        </div>
      </aside>

      <div className="bottom-rail glass">
        <div><Zap size={13} /> SYSTEM THROUGHPUT</div>
        <span>LEADS 137</span><span>CALLS 18</span><span>WON 6</span><span>RETENTION 96.4%</span><span>ROAS 4.38x</span>
        <strong><i /> ALL SYSTEMS NOMINAL</strong>
      </div>
    </div>
  )
}
