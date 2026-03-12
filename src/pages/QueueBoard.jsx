import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Tv2, Users, Activity, ChevronRight } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'

// Demo queue data
const DEMO_QUEUE = [
  { id: 1, name: 'Priya Sharma', token: 'A001', doctor: 'Dr. Mehta', status: 'now', time: '09:30' },
  { id: 2, name: 'Rahul Verma', token: 'A002', doctor: 'Dr. Mehta', status: 'next', time: '10:00' },
  { id: 3, name: 'Sunita Patel', token: 'A003', doctor: 'Dr. Kapoor', status: 'waiting', time: '10:30' },
  { id: 4, name: 'Amit Kumar', token: 'A004', doctor: 'Dr. Mehta', status: 'waiting', time: '11:00' },
  { id: 5, name: 'Neha Singh', token: 'A005', doctor: 'Dr. Sharma', status: 'waiting', time: '11:30' },
]

export default function QueueBoard() {
  const { lang } = useApp()
  const [queue, setQueue] = useState(DEMO_QUEUE)
  const [time, setTime] = useState(new Date())
  const [ticker, setTicker] = useState(0)

  useEffect(() => {
    const int = setInterval(() => {
      setTime(new Date())
      setTicker(t => t + 1)
    }, 1000)
    return () => clearInterval(int)
  }, [])

  // Simulate queue advancement every 30s in demo
  useEffect(() => {
    if (ticker > 0 && ticker % 30 === 0) {
      setQueue(q => {
        const next = q.filter(p => p.status !== 'now')
        if (next.length === 0) return DEMO_QUEUE
        return next.map((p, i) => ({
          ...p,
          status: i === 0 ? 'now' : i === 1 ? 'next' : 'waiting',
        }))
      })
    }
  }, [ticker])

  const now = queue.find(p => p.status === 'now')
  const next = queue.find(p => p.status === 'next')
  const waiting = queue.filter(p => p.status === 'waiting')
  const waitMin = (waiting.length + 1) * 15

  const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <div className="min-h-screen bg-obsidian text-white pt-16 pb-8">
      {/* Header Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
            <Tv2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-serif text-xl">ClinicBrain Live Queue</p>
            <p className="text-sage text-xs">Real-time patient flow</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-mint text-sm">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            LIVE
          </div>
          <div className="font-mono text-2xl text-ivory">
            {fmt(time)}
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-6">

        {/* Now Serving — big card */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {now && (
              <motion.div
                key={now.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-3xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0D5C63, #1A8A8F)' }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #5EC8C2 0%, transparent 60%)' }}
                />
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-white/60 text-sm uppercase tracking-widest font-semibold mb-1">
                        {t(lang, 'queue_now')}
                      </p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-mint" />
                        <span className="text-mint text-sm font-medium">In Consultation</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-5xl font-bold text-white">{now.token}</div>
                    </div>
                  </div>

                  <div className="font-serif text-4xl text-white mb-2">{now.name}</div>
                  <p className="text-white/70">{now.doctor}</p>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-white font-semibold">{now.time}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-white/30 animate-pulse"
                          style={{ animationDelay: `${i * 0.3}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Patient */}
          {next && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 border border-slate/30 bg-white/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate text-xs uppercase tracking-widest font-semibold mb-1">
                    {t(lang, 'queue_next')}
                  </p>
                  <p className="font-serif text-2xl text-ivory">{next.name}</p>
                  <p className="text-slate text-sm mt-0.5">{next.doctor} · {next.time}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-3xl text-sage">{next.token}</div>
                  <div className="chip chip-pending text-xs mt-1">Please proceed</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Wait info + waiting list */}
        <div className="space-y-4">
          {/* Wait time */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl p-6 bg-amber/10 border border-amber/30 text-center"
          >
            <Clock className="w-6 h-6 text-amber mx-auto mb-2" />
            <p className="text-slate text-xs uppercase tracking-wider font-semibold mb-1">
              {t(lang, 'queue_wait')}
            </p>
            <div className="font-serif text-5xl text-amber">{waitMin}</div>
            <p className="text-slate text-sm">{t(lang, 'minutes')}</p>
          </motion.div>

          {/* Patients waiting */}
          <div className="rounded-2xl border border-slate/30 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate/20 flex items-center gap-2">
              <Users className="w-4 h-4 text-sage" />
              <span className="text-sage text-sm font-medium">Waiting ({waiting.length})</span>
            </div>
            <div className="divide-y divide-slate/10">
              {waiting.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm text-slate/60">{p.token}</div>
                    <div>
                      <p className="text-sm text-ivory font-medium">{p.name}</p>
                      <p className="text-xs text-slate">{p.time}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate/40" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ticker */}
          <div className="rounded-2xl p-4 bg-teal/10 border border-teal/20 text-center">
            <p className="text-teal text-xs font-semibold">ClinicBrain · Real-time Queue</p>
            <p className="text-slate text-xs mt-1">Updates every second</p>
          </div>
        </div>
      </div>
    </div>
  )
}
