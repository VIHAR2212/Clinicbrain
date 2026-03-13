import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Calendar, CheckCircle, AlertTriangle,
  FileText, ChevronRight, User, Stethoscope, Menu, Clock, Phone
} from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'
import { getAppointments, updateAppointment, subscribe } from '../services/store'

function StatusChip({ status, urgent }) {
  if (urgent) return <span className="chip chip-urgent">🚨 Urgent</span>
  if (status === 'confirmed') return <span className="chip chip-confirmed">Confirmed</span>
  if (status === 'pending') return <span className="chip chip-pending">Pending</span>
  if (status === 'completed') return <span className="chip bg-sage/20 text-deep-teal">Completed</span>
  if (status === 'cancelled') return <span className="chip chip-cancelled">Cancelled</span>
  return null
}

export default function DoctorDashboard() {
  const { lang, profile } = useApp()
  const [appointments, setAppointments] = useState([])
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [sideOpen, setSideOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('schedule') // 'schedule' | 'notes'

  const today = new Date().toISOString().split('T')[0]

  // Load and subscribe to global store
  useEffect(() => {
    setAppointments(getAppointments())
    const unsub = subscribe((appts) => {
      setAppointments(appts)
      // Update selected if it changed
      if (selected) {
        const updated = appts.find(a => a.id === selected.id)
        if (updated) setSelected(updated)
      }
    })
    return unsub
  }, [])

  // Filter to Dr. Ananya Mehta's appointments today
  const myAppointments = appointments.filter(a =>
    a.doctor_name === 'Dr. Ananya Mehta' && a.date === today
  ).sort((a, b) => {
    if (a.urgent && !b.urgent) return -1
    if (!a.urgent && b.urgent) return 1
    return a.time_slot.localeCompare(b.time_slot)
  })

  // All appointments with notes for the notes tab
  const appointmentsWithNotes = appointments.filter(a =>
    a.doctor_name === 'Dr. Ananya Mehta' && a.note && a.note.trim()
  )

  const stats = {
    total: myAppointments.length,
    confirmed: myAppointments.filter(a => a.status === 'confirmed').length,
    urgent: myAppointments.filter(a => a.urgent).length,
    pending: myAppointments.filter(a => a.status === 'pending').length,
    completed: myAppointments.filter(a => a.status === 'completed').length,
  }

  const markComplete = (id) => {
    updateAppointment(id, { status: 'completed' })
  }

  const saveNote = () => {
    if (!selected || !note.trim()) return
    updateAppointment(selected.id, { note: note.trim() })
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  // When selecting a patient, load their existing note
  const handleSelect = (appt) => {
    setSelected(appt)
    setNote(appt.note || '')
    setNoteSaved(false)
  }

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="flex h-screen pt-16 bg-warm-white dark:bg-obsidian overflow-hidden">

      {/* Sidebar */}
      <AnimatePresence>
        {sideOpen && (
          <motion.aside
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 bg-obsidian text-white flex flex-col flex-shrink-0 z-20"
          >
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{profile?.full_name || 'Dr. Ananya Mehta'}</p>
                  <p className="text-xs text-sage">General Physician</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`sidebar-link w-full text-left ${activeTab === 'schedule' ? 'active' : ''}`}
              >
                <Calendar className="w-4 h-4" /> Today's Schedule
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`sidebar-link w-full text-left ${activeTab === 'notes' ? 'active' : ''}`}
              >
                <FileText className="w-4 h-4" /> Patient Notes
                {appointmentsWithNotes.length > 0 && (
                  <span className="ml-auto bg-teal/30 text-mint text-[10px] px-1.5 py-0.5 rounded-full">
                    {appointmentsWithNotes.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`sidebar-link w-full text-left ${activeTab === 'analytics' ? 'active' : ''}`}
              >
                <Activity className="w-4 h-4" /> My Stats
              </button>
            </nav>

            <div className="p-4">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-sage text-xs mb-2">{todayFormatted}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <p className="font-serif text-2xl text-white">{stats.total}</p>
                    <p className="text-sage text-[10px]">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-2xl text-coral">{stats.urgent}</p>
                    <p className="text-sage text-[10px]">Urgent</p>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-2xl text-mint">{stats.confirmed}</p>
                    <p className="text-sage text-[10px]">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-2xl text-sage">{stats.completed}</p>
                    <p className="text-sage text-[10px]">Done</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-mist/60 dark:border-slate/20 flex items-center justify-between bg-white dark:bg-obsidian/80">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(o => !o)} className="btn-ghost w-8 h-8 p-0 justify-center">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-serif text-xl text-obsidian dark:text-ivory">
              {activeTab === 'schedule' && t(lang, 'today')}
              {activeTab === 'notes' && 'Patient Notes'}
              {activeTab === 'analytics' && 'My Stats'}
            </h1>
          </div>
          {stats.urgent > 0 && (
            <div className="flex items-center gap-1.5 text-coral text-xs font-semibold bg-coral/10 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              {stats.urgent} urgent
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div className="px-6 py-3 border-b border-mist/40 dark:border-slate/20 flex gap-6 overflow-x-auto bg-white/60 dark:bg-obsidian/60">
          {[
            { label: 'Total', value: stats.total, color: 'text-teal' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-mint' },
            { label: 'Pending', value: stats.pending, color: 'text-amber' },
            { label: 'Urgent', value: stats.urgent, color: 'text-coral' },
            { label: 'Completed', value: stats.completed, color: 'text-sage' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className={`font-serif text-2xl ${s.color}`}>{s.value}</span>
              <span className="text-xs text-slate">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Schedule Tab ── */}
        {activeTab === 'schedule' && (
          <div className="flex-1 overflow-hidden flex">
            {/* Appointment list */}
            <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-mist/60 dark:border-slate/20">
              <div className="p-3 space-y-2">
                {myAppointments.length === 0 ? (
                  <div className="text-center py-12 text-slate">
                    <Calendar className="w-10 h-10 text-mist mx-auto mb-2" />
                    <p className="text-sm font-medium">{t(lang, 'no_appointments')}</p>
                    <p className="text-xs mt-1">No appointments for today yet</p>
                  </div>
                ) : (
                  myAppointments.map(appt => (
                    <motion.button
                      key={appt.id}
                      onClick={() => handleSelect(appt)}
                      whileHover={{ scale: 1.01 }}
                      className={`w-full text-left p-4 rounded-xl border transition-all
                        ${selected?.id === appt.id
                          ? 'border-teal bg-teal/5 shadow-sm'
                          : appt.urgent
                            ? 'border-coral/40 bg-coral/5'
                            : 'border-mist hover:border-teal/30 bg-white dark:bg-obsidian/40'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${appt.urgent ? 'bg-coral/20 text-coral' : 'bg-teal/20 text-teal'}`}>
                            {appt.patient_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-obsidian dark:text-ivory">{appt.patient_name}</p>
                            <p className="text-xs text-slate flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />{appt.time_slot}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate/40 mt-1" />
                      </div>
                      <StatusChip status={appt.status} urgent={appt.urgent} />
                      {appt.note && (
                        <p className="text-[10px] text-teal mt-1.5 flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5" /> Has note
                        </p>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {/* Detail panel */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="max-w-lg space-y-4"
                  >
                    {/* Patient Info Card */}
                    <div className={`p-6 rounded-2xl ${selected.urgent ? 'bg-coral/10 border border-coral/30' : 'card'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="font-serif text-2xl text-obsidian dark:text-ivory">{selected.patient_name}</h2>
                          <p className="text-slate text-sm mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" />{selected.phone}
                          </p>
                        </div>
                        <StatusChip status={selected.status} urgent={selected.urgent} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-mist/60 dark:bg-slate/10">
                          <p className="text-xs text-slate uppercase tracking-wider mb-1">Time</p>
                          <p className="font-semibold text-sm text-obsidian dark:text-ivory">{selected.time_slot}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-mist/60 dark:bg-slate/10">
                          <p className="text-xs text-slate uppercase tracking-wider mb-1">Source</p>
                          <p className="font-semibold text-sm text-obsidian dark:text-ivory capitalize">{selected.source}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-mist/60 dark:bg-slate/10">
                        <p className="text-xs text-slate uppercase tracking-wider mb-1">Symptoms</p>
                        <p className="text-sm text-obsidian dark:text-ivory">{selected.symptoms || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="card p-5">
                      <h3 className="font-semibold text-sm text-obsidian dark:text-ivory mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal" /> Consultation Notes
                      </h3>
                      <textarea
                        className="input resize-none"
                        rows={4}
                        placeholder="Diagnosis, prescription, follow-up instructions..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                      <button
                        onClick={saveNote}
                        disabled={!note.trim()}
                        className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                          ${noteSaved ? 'bg-mint/20 text-deep-teal' : 'btn-secondary'}`}
                      >
                        {noteSaved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><FileText className="w-4 h-4" /> {t(lang, 'save_note')}</>}
                      </button>
                    </div>

                    {/* Action Button */}
                    {selected.status !== 'completed' && selected.status !== 'cancelled' && (
                      <button onClick={() => markComplete(selected.id)} className="btn-primary w-full justify-center">
                        <CheckCircle className="w-4 h-4" />{t(lang, 'complete')}
                      </button>
                    )}
                    {selected.status === 'completed' && (
                      <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-mint/10 text-deep-teal text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" /> Consultation Completed
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center text-slate py-20">
                    <User className="w-12 h-12 text-mist mb-3" />
                    <p className="font-medium">Select a patient to view details</p>
                    <p className="text-xs mt-1">Click any appointment from the list</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Patient Notes Tab ── */}
        {activeTab === 'notes' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl space-y-4">
              {appointmentsWithNotes.length === 0 ? (
                <div className="text-center py-20 text-slate">
                  <FileText className="w-12 h-12 text-mist mx-auto mb-3" />
                  <p className="font-medium">No patient notes yet</p>
                  <p className="text-xs mt-1">Go to Today's Schedule, select a patient, and add notes</p>
                </div>
              ) : (
                appointmentsWithNotes.map(appt => (
                  <motion.div key={appt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal/20 flex items-center justify-center font-bold text-teal">
                          {appt.patient_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-obsidian dark:text-ivory">{appt.patient_name}</p>
                          <p className="text-xs text-slate">{appt.date} · {appt.time_slot}</p>
                        </div>
                      </div>
                      <StatusChip status={appt.status} urgent={appt.urgent} />
                    </div>
                    <div className="p-3 rounded-xl bg-teal/5 border border-teal/20">
                      <p className="text-xs text-teal uppercase tracking-wider font-semibold mb-1">Doctor's Note</p>
                      <p className="text-sm text-obsidian dark:text-ivory">{appt.note}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Today Total', value: stats.total, color: 'text-teal', bg: 'bg-teal/10' },
                  { label: 'Completed', value: stats.completed, color: 'text-mint', bg: 'bg-mint/10' },
                  { label: 'Urgent Cases', value: stats.urgent, color: 'text-coral', bg: 'bg-coral/10' },
                  { label: 'Pending', value: stats.pending, color: 'text-amber', bg: 'bg-amber/10' },
                ].map(s => (
                  <div key={s.label} className={`card p-5 ${s.bg} border-0`}>
                    <p className={`font-serif text-4xl ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="card p-5">
                <p className="text-xs text-slate uppercase tracking-wider font-semibold mb-3">Completion Rate</p>
                <div className="w-full bg-mist rounded-full h-3">
                  <div className="bg-teal h-3 rounded-full transition-all duration-500"
                    style={{ width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%' }} />
                </div>
                <p className="text-sm text-teal font-semibold mt-2">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completed today
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
