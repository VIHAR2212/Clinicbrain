import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Calendar, Clock, AlertTriangle, CheckCircle,
  XCircle, RefreshCw, BarChart3, Users, ClipboardList, Menu,
  Trash2, Phone, Filter, Download
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'
import { DOCTORS, generateTimeSlots } from '../services/supabase'

const DEMO_APPOINTMENTS = [
  { id: 1, patient_name: 'Priya Sharma', phone: '+91 98765 43210', doctor_name: 'Dr. Ananya Mehta', date: '2026-03-13', time_slot: '09:30', status: 'confirmed', urgent: false, source: 'whatsapp' },
  { id: 2, patient_name: 'Rahul Verma', phone: '+91 87654 32109', doctor_name: 'Dr. Rohan Kapoor', date: '2026-03-13', time_slot: '10:00', status: 'confirmed', urgent: true, source: 'web' },
  { id: 3, patient_name: 'Sunita Patel', phone: '+91 76543 21098', doctor_name: 'Dr. Ananya Mehta', date: '2026-03-13', time_slot: '10:30', status: 'pending', urgent: false, source: 'walkin' },
  { id: 4, patient_name: 'Amit Kumar', phone: '+91 65432 10987', doctor_name: 'Dr. Priya Sharma', date: '2026-03-13', time_slot: '11:00', status: 'confirmed', urgent: false, source: 'web' },
  { id: 5, patient_name: 'Neha Singh', phone: '+91 54321 09876', doctor_name: 'Dr. Vikram Nair', date: '2026-03-13', time_slot: '11:30', status: 'cancelled', urgent: false, source: 'whatsapp' },
  { id: 6, patient_name: 'Vikram Joshi', phone: '+91 43210 98765', doctor_name: 'Dr. Ananya Mehta', date: '2026-03-13', time_slot: '14:00', status: 'pending', urgent: false, source: 'walkin' },
  { id: 7, patient_name: 'Kavya Reddy', phone: '+91 32109 87654', doctor_name: 'Dr. Rohan Kapoor', date: '2026-03-14', time_slot: '09:00', status: 'confirmed', urgent: false, source: 'web' },
]

const PEAK_DATA = [
  { hour: '9', count: 8 }, { hour: '10', count: 12 }, { hour: '11', count: 10 },
  { hour: '12', count: 5 }, { hour: '13', count: 3 }, { hour: '14', count: 9 },
  { hour: '15', count: 7 }, { hour: '16', count: 4 },
]

const DAILY_DATA = [
  { date: 'Mar 7', count: 18 }, { date: 'Mar 8', count: 22 }, { date: 'Mar 9', count: 15 },
  { date: 'Mar 10', count: 25 }, { date: 'Mar 11', count: 19 }, { date: 'Mar 12', count: 28 },
  { date: 'Mar 13', count: 21 },
]

const TABS = ['appointments', 'analytics', 'walkin']

function StatusChip({ status, urgent }) {
  if (urgent) return <span className="chip chip-urgent text-[10px]">🚨 Urgent</span>
  if (status === 'confirmed') return <span className="chip chip-confirmed text-[10px]">Confirmed</span>
  if (status === 'pending') return <span className="chip chip-pending text-[10px]">Pending</span>
  if (status === 'cancelled') return <span className="chip chip-cancelled text-[10px]">Cancelled</span>
  if (status === 'completed') return <span className="chip bg-sage/20 text-deep-teal text-[10px]">Completed</span>
  return null
}

export default function ReceptionDashboard() {
  const { lang } = useApp()
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS)
  const [tab, setTab] = useState('appointments')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sideOpen, setSideOpen] = useState(true)
  const [walkin, setWalkin] = useState({ name: '', phone: '', doctor: DOCTORS[0].name, time_slot: '09:00', date: new Date().toISOString().split('T')[0] })
  const [walkinDone, setWalkinDone] = useState(false)
  const [rescheduleId, setRescheduleId] = useState(null)
  const [newTime, setNewTime] = useState('')

  const filtered = appointments.filter(a => {
    const matchSearch = !search || a.patient_name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search)
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const updateStatus = (id, status) => {
    setAppointments(aps => aps.map(a => a.id === id ? { ...a, status } : a))
  }

  const doReschedule = (id) => {
    if (!newTime) return
    setAppointments(aps => aps.map(a => a.id === id ? { ...a, time_slot: newTime, status: 'confirmed' } : a))
    setRescheduleId(null)
    setNewTime('')
  }

  const addWalkin = () => {
    const newAppt = {
      id: Date.now(),
      ...walkin,
      status: 'confirmed',
      urgent: false,
      source: 'walkin',
    }
    setAppointments(aps => [...aps, newAppt])
    setWalkinDone(true)
    setTimeout(() => setWalkinDone(false), 2000)
  }

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === '2026-03-13').length,
    urgent: appointments.filter(a => a.urgent).length,
    noShow: appointments.filter(a => a.status === 'cancelled').length,
  }

  const slots = generateTimeSlots('09:00', '17:00', 15)

  return (
    <div className="flex h-screen pt-16 bg-warm-white dark:bg-obsidian overflow-hidden">

      {/* Sidebar */}
      <AnimatePresence>
        {sideOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="w-56 bg-obsidian flex flex-col flex-shrink-0 z-20"
          >
            <div className="p-4 border-b border-white/10">
              <p className="font-semibold text-white text-sm">Reception Desk</p>
              <p className="text-sage text-xs">Ritu Gupta</p>
            </div>
            <nav className="flex-1 p-2 space-y-1">
              {TABS.map(tab2 => (
                <button
                  key={tab2}
                  onClick={() => setTab(tab2)}
                  className={`sidebar-link w-full text-left ${tab === tab2 ? 'active' : ''}`}
                >
                  {tab2 === 'appointments' && <><ClipboardList className="w-4 h-4" /> Appointments</>}
                  {tab2 === 'analytics' && <><BarChart3 className="w-4 h-4" /> Analytics</>}
                  {tab2 === 'walkin' && <><Plus className="w-4 h-4" /> Add Walk-in</>}
                </button>
              ))}
            </nav>
            <div className="p-3 space-y-1">
              {[
                { label: 'Total Today', value: stats.today, color: 'text-mint' },
                { label: 'Urgent', value: stats.urgent, color: 'text-coral' },
              ].map(s => (
                <div key={s.label} className="flex justify-between px-2 py-1 rounded-lg bg-white/5">
                  <span className="text-xs text-sage">{s.label}</span>
                  <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-mist/60 dark:border-slate/20 flex items-center gap-3 bg-white dark:bg-obsidian/80">
          <button onClick={() => setSideOpen(o => !o)} className="btn-ghost w-8 h-8 p-0 justify-center">
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="font-serif text-lg text-obsidian dark:text-ivory capitalize">{tab}</h1>
          <div className="ml-auto flex items-center gap-2">
            {stats.urgent > 0 && (
              <div className="chip chip-urgent text-[10px]">
                <AlertTriangle className="w-3 h-3 mr-0.5" />{stats.urgent} urgent
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">

            {/* ── Appointments Tab ── */}
            {tab === 'appointments' && (
              <motion.div key="appts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/40" />
                    <input
                      className="input pl-9 text-sm"
                      placeholder={t(lang, 'search_patient')}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="input w-auto text-sm"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Table */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-mist/60 dark:border-slate/20 bg-mist/30 dark:bg-slate/10">
                          {['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Source', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-mist/40 dark:divide-slate/10">
                        {filtered.map(appt => (
                          <motion.tr
                            key={appt.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`hover:bg-mist/30 dark:hover:bg-slate/5 transition-colors ${appt.urgent ? 'bg-coral/5' : ''}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                  ${appt.urgent ? 'bg-coral/20 text-coral' : 'bg-teal/20 text-teal'}`}>
                                  {appt.patient_name[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-obsidian dark:text-ivory">{appt.patient_name}</p>
                                  <p className="text-xs text-slate flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5" />{appt.phone}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate text-xs">{appt.doctor_name}</td>
                            <td className="px-4 py-3 text-slate text-xs">{appt.date}</td>
                            <td className="px-4 py-3">
                              {rescheduleId === appt.id ? (
                                <div className="flex gap-1.5">
                                  <select className="input text-xs py-1 px-2 w-24" value={newTime} onChange={e => setNewTime(e.target.value)}>
                                    <option value="">Pick</option>
                                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                  <button onClick={() => doReschedule(appt.id)} className="text-teal text-xs font-semibold">OK</button>
                                  <button onClick={() => setRescheduleId(null)} className="text-slate text-xs">✕</button>
                                </div>
                              ) : (
                                <span className="font-mono text-xs text-obsidian dark:text-ivory">{appt.time_slot}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <StatusChip status={appt.status} urgent={appt.urgent} />
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize
                                ${appt.source === 'whatsapp' ? 'bg-mint/20 text-deep-teal' : appt.source === 'walkin' ? 'bg-amber/20 text-amber' : 'bg-lavender/20 text-lavender'}`}>
                                {appt.source}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => setRescheduleId(appt.id)}
                                    className="p-1.5 rounded-lg hover:bg-lavender/10 text-lavender transition-colors"
                                    title={t(lang, 'reschedule')}
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {appt.status === 'pending' && (
                                  <button
                                    onClick={() => updateStatus(appt.id, 'confirmed')}
                                    className="p-1.5 rounded-lg hover:bg-mint/10 text-teal transition-colors"
                                    title="Confirm"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                  <button
                                    onClick={() => updateStatus(appt.id, 'cancelled')}
                                    className="p-1.5 rounded-lg hover:bg-coral/10 text-coral transition-colors"
                                    title={t(lang, 'cancel_appt')}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Analytics Tab ── */}
            {tab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: t(lang, 'total'), value: stats.total, icon: Calendar, color: 'text-teal', bg: 'bg-teal/10' },
                    { label: 'Today', value: stats.today, icon: Clock, color: 'text-mint', bg: 'bg-mint/10' },
                    { label: t(lang, 'no_show_pct'), value: `${Math.round((stats.noShow / stats.total) * 100)}%`, icon: Users, color: 'text-coral', bg: 'bg-coral/10' },
                    { label: 'Urgent', value: stats.urgent, icon: AlertTriangle, color: 'text-amber', bg: 'bg-amber/10' },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <div key={s.label} className="card p-4">
                        <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                          <Icon className={`w-4 h-4 ${s.color}`} />
                        </div>
                        <p className={`font-serif text-3xl ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate mt-0.5">{s.label}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card p-5">
                    <h3 className="font-serif text-lg text-obsidian dark:text-ivory mb-4">Peak Hours</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={PEAK_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2EBE9" />
                        <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={h => `${h}:00`} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
                          labelFormatter={h => `${h}:00`}
                        />
                        <Bar dataKey="count" fill="#1A8A8F" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="card p-5">
                    <h3 className="font-serif text-lg text-obsidian dark:text-ivory mb-4">Daily Appointments (7 days)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={DAILY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2EBE9" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="count" stroke="#5EC8C2" strokeWidth={2.5} dot={{ fill: '#1A8A8F', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Walk-in Tab ── */}
            {tab === 'walkin' && (
              <motion.div key="walkin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-md"
              >
                <div className="card p-6">
                  <h2 className="font-serif text-xl text-obsidian dark:text-ivory mb-5 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-teal" /> {t(lang, 'add_walkin')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Patient Name</label>
                      <input className="input" placeholder="Full name" value={walkin.name} onChange={e => setWalkin(w => ({ ...w, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Phone</label>
                      <input className="input" placeholder="+91 ..." value={walkin.phone} onChange={e => setWalkin(w => ({ ...w, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Doctor</label>
                      <select className="input" value={walkin.doctor} onChange={e => setWalkin(w => ({ ...w, doctor: e.target.value }))}>
                        {DOCTORS.map(d => <option key={d.name} value={d.name}>{d.name} — {d.specialty}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Date</label>
                        <input type="date" className="input" value={walkin.date} onChange={e => setWalkin(w => ({ ...w, date: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Time</label>
                        <select className="input" value={walkin.time_slot} onChange={e => setWalkin(w => ({ ...w, time_slot: e.target.value }))}>
                          {slots.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <button onClick={addWalkin} disabled={!walkin.name || !walkin.phone} className="btn-primary w-full justify-center">
                      {walkinDone ? <><CheckCircle className="w-4 h-4" /> Added!</> : <><Plus className="w-4 h-4" /> Add Walk-in Patient</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
