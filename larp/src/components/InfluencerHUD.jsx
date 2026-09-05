import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Bot,
  BrainCircuit,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Mic,
  Play,
  Radar,
  Radio,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const CREATORS = [
  { id: 'nova', name: 'NOVA REIGN', handle: '@novareign.ai', niche: 'Luxury · Fashion · Travel', followers: '1.84M', growth: '+38.2K', score: 96, accent: 'violet', initials: 'NR' },
  { id: 'malik', name: 'MALIK VOSS', handle: '@malikvoss', niche: 'Fitness · Menswear · Lifestyle', followers: '842K', growth: '+21.7K', score: 92, accent: 'cyan', initials: 'MV' },
  { id: 'sora', name: 'SORA KAI', handle: '@sorakai.world', niche: 'Gaming · Tech · Culture', followers: '2.31M', growth: '+51.4K', score: 98, accent: 'blue', initials: 'SK' },
  { id: 'imani', name: 'IMANI ROSE', handle: '@imanirose.daily', niche: 'Beauty · Wellness · Relationships', followers: '1.26M', growth: '+33.8K', score: 95, accent: 'green', initials: 'IR' },
]

const TRENDS = [
  ['Quiet luxury backlash', '94.8', '+182%'],
  ['Airport fit check', '91.2', '+146%'],
  ['AI boyfriend discourse', '88.7', '+231%'],
  ['Sunday reset ritual', '86.4', '+93%'],
  ['Soft-life budgeting', '83.9', '+118%'],
]

const PIPELINE = [
  ['01', 'TREND', 'signal matched'],
  ['02', 'CONCEPT', 'angle selected'],
  ['03', 'SCRIPT', 'voice modeled'],
  ['04', 'VISUAL', 'scene rendered'],
  ['05', 'EDIT', 'hook optimized'],
  ['06', 'PUBLISH', 'distribution queued'],
]

const AUTONOMOUS_EVENTS = [
  ['TREND AGENT', 'Mapped rising fashion conversation', '182% velocity'],
  ['PERSONA ENGINE', 'Adjusted Nova aspiration weighting', '+3.4% fit'],
  ['CONTENT AGENT', 'Generated 4 hook variants', 'winner selected'],
  ['VOICE ENGINE', 'Rendered 17.4s voice track', '98.2% match'],
  ['DISTRIBUTION', 'Queued TikTok + Reels + Shorts', '3 channels'],
  ['ENGAGEMENT', 'Detected comment-cluster breakout', '+14.8% ER'],
  ['BRAND AGENT', 'Matched luxury luggage campaign', '$18.6K offer'],
  ['GROWTH AGENT', 'Reallocated posting window', '+27% reach'],
]

const BRAND_DEALS = [
  ['AURUM TRAVEL', '$18,600', '94% FIT'],
  ['VELA BEAUTY', '$12,400', '88% FIT'],
  ['NORTH/FORM', '$9,850', '86% FIT'],
]

const PHASE_ORDER = ['idle', 'trends', 'persona', 'content', 'publishing', 'viral']

function useCounter(start, step, interval, enabled = true) {
  const [value, setValue] = useState(start)
  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => setValue(v => v + step + Math.random() * step * 0.75), interval)
    return () => clearInterval(id)
  }, [step, interval, enabled])
  return value
}

function CreatorAvatar({ creator, large = false, generating = false }) {
  return (
    <div className={`synthetic-avatar avatar-${creator.accent} ${large ? 'large' : ''} ${generating ? 'generating' : ''}`}>
      <div className="avatar-halo" />
      <div className="avatar-face">
        <div className="avatar-hair" />
        <div className="avatar-head"><i /><i /></div>
        <div className="avatar-neck" />
        <div className="avatar-body" />
      </div>
      <span>{creator.initials}</span>
      {generating && <div className="avatar-gen-scan" />}
    </div>
  )
}

function SparkChart({ viral }) {
  const points = viral
    ? [18, 19, 21, 24, 23, 29, 32, 39, 48, 63, 78, 95]
    : [18, 20, 19, 24, 27, 29, 31, 34, 36, 39, 43, 46]
  const max = Math.max(...points)
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * 100},${48 - (p / max) * 43}`).join(' ')
  return (
    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="creator-spark-chart">
      <polyline points={coords} />
    </svg>
  )
}

function TrendRadar({ scanning }) {
  return (
    <div className="influencer-panel trend-radar-panel">
      <div className="influencer-panel-title"><Radar size={12} /> CULTURE RADAR <span>{scanning ? 'SCANNING' : 'LIVE'}</span></div>
      <div className={`radar-disc ${scanning ? 'scanning' : ''}`}>
        <div className="radar-ring r1" /><div className="radar-ring r2" /><div className="radar-ring r3" />
        <div className="radar-axis a1" /><div className="radar-axis a2" />
        <div className="radar-sweep" />
        {[['26%','31%'],['68%','23%'],['77%','61%'],['37%','72%'],['55%','44%']].map((p, i) => <i key={i} style={{ left: p[0], top: p[1], '--delay': `${i * .3}s` }} />)}
        <strong>12.8K</strong><small>signals/min</small>
      </div>
      <div className="trend-list">
        {TRENDS.slice(0, 4).map((trend, i) => (
          <motion.div key={trend[0]} initial={scanning ? { opacity: 0, x: -8 } : false} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .12 }}>
            <b>{String(i + 1).padStart(2, '0')}</b><span>{trend[0]}</span><small>{trend[2]}</small>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PersonaDNA({ creator, active }) {
  const traits = [
    ['ASPIRATION', 94], ['RELATABILITY', 78], ['POLARITY', 61], ['AUTHORITY', 88], ['PARASOCIAL', 92],
  ]
  return (
    <div className="influencer-panel persona-dna-panel">
      <div className="influencer-panel-title"><BrainCircuit size={12} /> PERSONA DNA <span>{creator.score}% COHERENCE</span></div>
      <div className="persona-bars">
        {traits.map(([label, width], i) => (
          <div key={label}><span>{label}</span><i><b style={{ '--dna': `${active ? width : Math.max(35, width - 18)}%`, '--delay': `${i * .08}s` }} /></i><small>{active ? width : width - 7}</small></div>
        ))}
      </div>
      <div className="voiceprint">
        <div className="waveform">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--h': `${20 + ((i * 17) % 70)}%`, '--d': `${i * .04}s` }} />)}</div>
        <span><Mic size={10} /> VOICEPRINT LOCKED · 98.2%</span>
      </div>
    </div>
  )
}

function PhonePreview({ creator, phase, viral }) {
  const published = phase === 'publishing' || viral
  return (
    <div className={`content-phone ${published ? 'published' : ''} ${viral ? 'viral' : ''}`}>
      <div className="phone-speaker" />
      <div className={`phone-content creator-bg-${creator.accent}`}>
        <div className="phone-topline"><span>{creator.handle}</span><b>{published ? 'LIVE' : 'PREVIEW'}</b></div>
        <div className="phone-portrait"><CreatorAvatar creator={creator} large generating={phase === 'content'} /></div>
        <div className="phone-caption"><strong>POV: the airport fit finally matches the itinerary.</strong><span>#quietluxury #travelstyle #syntheticcreator</span></div>
        <div className="phone-social-rail">
          <div><Heart size={15} /><span>{viral ? '284K' : published ? '18.4K' : '—'}</span></div>
          <div><MessageCircle size={15} /><span>{viral ? '8.7K' : published ? '642' : '—'}</span></div>
          <div><Share2 size={15} /><span>{viral ? '31K' : published ? '1.8K' : '—'}</span></div>
        </div>
        {viral && <div className="viral-burst"><i /><i /><i /><i /><i /><i /></div>}
        <div className="phone-progress"><i /></div>
      </div>
    </div>
  )
}

function ContentPipeline({ phase }) {
  const phaseMap = { idle: -1, trends: 0, persona: 1, content: 4, publishing: 5, viral: 5 }
  const active = phaseMap[phase]
  return (
    <div className="influencer-panel content-pipeline-panel">
      <div className="influencer-panel-title"><Video size={12} /> CONTENT FACTORY <span>14 JOBS ACTIVE</span></div>
      <div className="pipeline-row">
        {PIPELINE.map((step, i) => (
          <div className={`pipeline-node ${i <= active ? 'complete' : ''} ${i === active ? 'current' : ''}`} key={step[0]}>
            <b>{step[0]}</b><span>{step[1]}</span><small>{step[2]}</small>{i < PIPELINE.length - 1 && <i />}
          </div>
        ))}
      </div>
      <div className="generation-jobs">
        <div><ImageIcon size={10} /><span>IMAGE / FRAME GEN</span><i><b style={{ '--p': phase === 'content' ? '92%' : phase === 'publishing' || phase === 'viral' ? '100%' : '38%' }} /></i><small>{phase === 'content' ? '92%' : phase === 'publishing' || phase === 'viral' ? 'DONE' : '38%'}</small></div>
        <div><Mic size={10} /><span>VOICE SYNTHESIS</span><i><b style={{ '--p': phase === 'content' ? '78%' : phase === 'publishing' || phase === 'viral' ? '100%' : '21%' }} /></i><small>{phase === 'content' ? '78%' : phase === 'publishing' || phase === 'viral' ? 'DONE' : '21%'}</small></div>
        <div><Video size={10} /><span>MOTION / LIPSYNC</span><i><b style={{ '--p': phase === 'content' ? '66%' : phase === 'publishing' || phase === 'viral' ? '100%' : '12%' }} /></i><small>{phase === 'content' ? '66%' : phase === 'publishing' || phase === 'viral' ? 'DONE' : '12%'}</small></div>
      </div>
    </div>
  )
}

function Roster({ selected, onSelect, viral }) {
  return (
    <div className="influencer-panel creator-roster-panel">
      <div className="influencer-panel-title"><Users size={12} /> SYNTHETIC TALENT <span>8 ACTIVE</span></div>
      <div className="creator-roster">
        {CREATORS.map(c => (
          <button key={c.id} className={selected.id === c.id ? 'selected' : ''} onClick={() => onSelect(c)}>
            <CreatorAvatar creator={c} />
            <div><strong>{c.name}</strong><span>{c.niche}</span><small>{c.followers} · <b>{viral && selected.id === c.id ? '+74.2K' : c.growth}</b> / 24H</small></div>
            <i>{c.score}</i>
          </button>
        ))}
      </div>
    </div>
  )
}

function DealDesk({ viral }) {
  return (
    <div className="influencer-panel deal-desk-panel">
      <div className="influencer-panel-title"><CircleDollarSign size={12} /> BRAND DEAL DESK <span>AI NEGOTIATION</span></div>
      <div className="deal-total"><span>OPEN DEAL VALUE</span><strong>{viral ? '$142,840' : '$96,420'}</strong><small><TrendingUp size={10} /> +24.8% this cycle</small></div>
      <div className="deal-list">
        {BRAND_DEALS.map((deal, i) => <div key={deal[0]}><b>{deal[0]}</b><span>{deal[1]}</span><small>{deal[2]}</small><i style={{ '--deal': `${92 - i * 11}%` }} /></div>)}
      </div>
    </div>
  )
}

export default function InfluencerHUD() {
  const [creator, setCreator] = useState(CREATORS[0])
  const [phase, setPhase] = useState('idle')
  const [eventCursor, setEventCursor] = useState(0)
  const [autopilot, setAutopilot] = useState(false)
  const [toast, setToast] = useState(null)
  const impressions = useCounter(2841000, 3174, 1100, phase === 'publishing' || phase === 'viral')
  const revenue = useCounter(38420, 18.4, 1700, phase === 'publishing' || phase === 'viral')
  const viral = phase === 'viral'

  useEffect(() => {
    const id = setInterval(() => setEventCursor(v => (v + 1) % AUTONOMOUS_EVENTS.length), 2100)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!autopilot) return
    let idx = 0
    setPhase(PHASE_ORDER[idx])
    const id = setInterval(() => {
      idx += 1
      if (idx >= PHASE_ORDER.length) {
        clearInterval(id)
        setAutopilot(false)
        return
      }
      const next = PHASE_ORDER[idx]
      setPhase(next)
      const copy = {
        trends: ['CULTURE SIGNAL LOCKED', '+182%', 'trend velocity'],
        persona: ['PERSONA RECALIBRATED', '96%', 'coherence'],
        content: ['CONTENT FACTORY ACTIVE', '03', 'assets rendering'],
        publishing: ['AUTONOMOUS DISTRIBUTION', '3', 'platforms live'],
        viral: ['BREAKOUT DETECTED', '+284K', 'engagement burst'],
      }[next]
      if (copy) setToast(copy)
    }, 2400)
    return () => clearInterval(id)
  }, [autopilot])

  const setStage = (next, toastCopy) => {
    setAutopilot(false)
    setPhase(next)
    if (toastCopy) setToast(toastCopy)
  }

  const visibleEvents = useMemo(() => Array.from({ length: 4 }, (_, i) => AUTONOMOUS_EVENTS[(eventCursor + i) % AUTONOMOUS_EVENTS.length]), [eventCursor])

  return (
    <div className={`influencer-hud phase-${phase}`}>
      <header className="influencer-header">
        <div className="influencer-brand"><Sparkles size={17} /><div><small>SYNTHETIC CREATOR NETWORK</small><strong>ORBITAL // INFLUENCER OS</strong></div></div>
        <div className="influencer-disclosure"><i /> SIMULATED CREATOR OPERATIONS · DEMO DATA</div>
        <div className="influencer-system-stats"><span><Radio size={10} /> ACCOUNTS <b>08</b></span><span><Activity size={10} /> JOBS <b>14</b></span><span><Zap size={10} /> UPTIME <b>99.98%</b></span></div>
      </header>

      <aside className="influencer-left">
        <TrendRadar scanning={phase === 'trends'} />
        <Roster selected={creator} onSelect={setCreator} viral={viral} />
      </aside>

      <main className="influencer-stage">
        <div className="creator-identity-strip">
          <div><CreatorAvatar creator={creator} /><span><small>ACTIVE PERSONA</small><strong>{creator.name}</strong><b>{creator.handle}</b></span></div>
          <div className="identity-metrics"><span>FOLLOWERS <b>{viral ? '1.91M' : creator.followers}</b></span><span>24H GROWTH <b>{viral ? '+74.2K' : creator.growth}</b></span><span>COHERENCE <b>{creator.score}%</b></span><span>STATUS <b>ACTIVE</b></span></div>
        </div>

        <div className="creator-command-grid">
          <PhonePreview creator={creator} phase={phase} viral={viral} />
          <div className="creator-center-intelligence">
            <PersonaDNA creator={creator} active={phase === 'persona' || phase === 'content' || phase === 'publishing' || viral} />
            <ContentPipeline phase={phase} />
          </div>
          <div className="creator-performance-panel influencer-panel">
            <div className="influencer-panel-title"><TrendingUp size={12} /> NETWORK PERFORMANCE <span>{viral ? 'BREAKOUT' : 'LIVE'}</span></div>
            <div className="performance-number"><small>24H IMPRESSIONS</small><strong>{Math.floor(impressions).toLocaleString()}</strong><span>{viral ? '+218.4%' : '+38.7%'}</span></div>
            <SparkChart viral={viral} />
            <div className="platform-grid">
              <div><b>TIKTOK</b><span>{viral ? '4.8M' : '2.1M'}</span><small>{viral ? '+284%' : '+42%'}</small></div>
              <div><b>REELS</b><span>{viral ? '2.7M' : '1.4M'}</span><small>{viral ? '+176%' : '+31%'}</small></div>
              <div><b>SHORTS</b><span>{viral ? '1.9M' : '884K'}</span><small>{viral ? '+142%' : '+28%'}</small></div>
            </div>
          </div>
        </div>

        <div className="influencer-bottom-stage">
          <div className="influencer-panel content-calendar-panel">
            <div className="influencer-panel-title"><Calendar size={12} /> AUTONOMOUS DISTRIBUTION <span>18 POSTS / DAY</span></div>
            <div className="calendar-slots">
              {['08:15','10:40','13:20','17:05','20:30'].map((time, i) => <div key={time} className={phase === 'publishing' || viral ? 'active' : ''}><b>{time}</b><span>{['FIT CHECK','VOICE POV','TREND REMIX','STORYTIME','BRAND SLOT'][i]}</span><i>{['TT','IG','YT','TT','IG'][i]}</i></div>)}
            </div>
          </div>
          <div className="influencer-panel autonomous-feed-panel">
            <div className="influencer-panel-title"><Bot size={12} /> AUTONOMOUS ACTIVITY <i /></div>
            {visibleEvents.map((event, i) => <motion.div className="autonomous-event" key={`${event[0]}-${eventCursor}-${i}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .06 }}><b>{event[0]}</b><span>{event[1]}</span><small>{event[2]}</small></motion.div>)}
          </div>
        </div>
      </main>

      <aside className="influencer-right">
        <DealDesk viral={viral} />
        <div className="influencer-panel monetization-panel">
          <div className="influencer-panel-title"><CircleDollarSign size={12} /> CREATOR REVENUE <span>SIMULATED</span></div>
          <div className="revenue-big"><small>MTD NETWORK REVENUE</small><strong>${Math.floor(revenue).toLocaleString()}</strong><span>+31.6% trajectory</span></div>
          <div className="revenue-sources"><div><span>BRAND</span><b>62%</b></div><div><span>AFFILIATE</span><b>21%</b></div><div><span>PLATFORM</span><b>11%</b></div><div><span>LICENSING</span><b>6%</b></div></div>
        </div>
        <div className="influencer-panel audience-panel">
          <div className="influencer-panel-title"><Users size={12} /> AUDIENCE MODEL <span>18.4M GRAPH NODES</span></div>
          <div className="audience-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><i className="audience-core"/>{Array.from({ length: 12 }, (_, i) => <i key={i} className="audience-node" style={{ '--a': `${i * 30}deg`, '--r': `${34 + (i % 3) * 13}px`, '--delay': `${i * .09}s` }} />)}</div>
          <div className="audience-labels"><span>FASHION <b>34%</b></span><span>TRAVEL <b>27%</b></span><span>LIFESTYLE <b>22%</b></span><span>OTHER <b>17%</b></span></div>
        </div>
      </aside>

      <div className="influencer-controls influencer-panel">
        <button onClick={() => setStage('trends', ['CULTURE SCAN ACTIVE', '12.8K', 'signals / min'])}><Radar size={12}/> SCAN TRENDS</button>
        <button onClick={() => setStage('persona', ['PERSONA ENGINE', '96%', 'identity coherence'])}><BrainCircuit size={12}/> TUNE PERSONA</button>
        <button onClick={() => setStage('content', ['GENERATION STARTED', '03', 'assets rendering'])}><Video size={12}/> GENERATE CONTENT</button>
        <button className="primary" onClick={() => setStage('publishing', ['AUTO-PUBLISH LIVE', '3', 'platforms'])}><Radio size={12}/> AUTO-PUBLISH</button>
        <button className="viral" onClick={() => setStage('viral', ['BREAKOUT DETECTED', '+284K', 'engagement burst'])}><TrendingUp size={12}/> TRIGGER VIRAL</button>
        <button className={autopilot ? 'running' : ''} onClick={() => { setAutopilot(true); setToast(['AUTOPILOT 24H', 'LIVE', 'full creator cycle']) }}><Play size={12}/> {autopilot ? 'RUNNING…' : 'AUTOPILOT 24H'}</button>
      </div>

      <AnimatePresence mode="wait">
        {toast && <motion.div className="influencer-toast influencer-panel" key={`${toast[0]}-${toast[1]}`} initial={{ opacity: 0, y: 16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}><div><Sparkles size={13}/></div><span><small>{toast[0]}</small><strong>{toast[2]}</strong></span><b>{toast[1]}</b><i /></motion.div>}
      </AnimatePresence>

      {viral && <div className="engagement-particles" aria-hidden="true">{Array.from({ length: 26 }, (_, i) => <i key={i} style={{ '--x': `${8 + ((i * 37) % 84)}%`, '--delay': `${(i % 8) * .16}s`, '--dur': `${2.1 + (i % 5) * .3}s` }}>{i % 3 === 0 ? '♥' : i % 3 === 1 ? '+' : '●'}</i>)}</div>}

      <div className="influencer-footer"><span><Eye size={10}/> SYNTHETIC MEDIA DEMO</span><span><BrainCircuit size={10}/> PERSONA MEMORY 48.2K TOKENS</span><span><Activity size={10}/> PHASE {phase.toUpperCase()}</span><strong><i/> NO REAL SOCIAL ACCOUNTS CONNECTED</strong></div>
    </div>
  )
}
