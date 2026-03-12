import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Calendar, CheckCircle, Clock, AlertTriangle,
  FileText, ChevronRight, User, Stethoscope, LogOut, Menu
} from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'

// Demo data
const DEMO_APPOINTMENTS = [
  { id: 1, patient_name: 'Priya Sharma', phone: '+91 98765 43210', time_slot: '09:30', status: 'confirmed', urgent: false, symptoms: 'Mild headache and fatigue for 2 days' },
  { id: 2, patient_name: 'Rahul Verma', phone: '+91 87654 32109', time_slot: '10:00', status: 'confirmed', urgent: true, symptoms: 'Chest pain and shortness of breath' },
  { id: 3, patient_name: 'Sunita Patel', phone: '+91 76543 21098', time_slot: '10:30', status: 'pending', urgent: false, symptoms: 'Back pain for a week' },
  { id: 4, patient_name: 'Amit Kumar', phone: '+91 65432 10987', time_slot: '11:00', status: 'confirmed', urgent: false, symptoms: 'Follow-up for diabetes' },
  { id: 5, patient_name: 'Neha Singh', phone: '+91 54321 09876', time_slot: '11:30', status: 'confirmed', urgent: false, symptoms: 'Skin rash since 3 days' },
  { id: 6, patient_name: 'Vikram Joshi', phone: '+91 43210 98765', time_slot: '14:00', status: 'confirmed', urgent: false, symptoms: 'General checkup' },
]

function statusChip(status, urgent) {
  if (urgent) return <span className="chip chip-urgent">🚨 Urgent</span>
  if (status === 'confirmed') return <span className="chip chip-confirmed">Confirmed</span>
  if (status === 'pending') return <span className="chip chip-pending">Pending</span>
  if (status === 'completed') return <span className="chip bg-sage/20 text-deep-teal">Completed</span>
  return <span className="chip chip-cancelled">Cancelled</span>
}

export default function DoctorDashboard() {
  const { lang, profile } = useApp()
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [sideOpen, setSideOpen] = useState(true)

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    urgent: appointments.filter(a => a.urgent).length,
    pending: appointments.filter(a => a.status === 'pending').length,
  }

  const markComplete = (id) => {
    setAppointments(aps => aps.map(a => a.id === id ? { ...a, status: 'completed' } : a))
    if (selected?.id === id) setSelected(a => ({ ...a, status: 'completed' }))
  }

  const saveNote = (id) => {
    setAppointments(aps => aps.map(a => a.id === id ? { ...a, note } : a))
    setNote('')
  }

  return (
    <div className="flex h-screen pt-16 bg-warm-white dark:bg-obsidian overflow-hidden">

      {/* Sidebar */}
      <AnimatePresence>
        {sideOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
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
              <button className="sidebar-link active w-full text-left">
                <Calendar className="w-4 h-4" /> Today's Schedule
              </button>
              <button className="sidebar-link w-full text-left">
                <FileText className="w-4 h-4" /> Patient Notes
              </button>
              <button className="sidebar-link w-full text-left">
                <Activity className="w-4 h-4" /> Analytics
              </button>
            </nav>

            <div className="p-3">
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-sage text-xs">{today}</p>
                <p className="font-serif text-2xl text-white mt-0.5">{stats.total}</p>
                <p className="text-sage text-xs">appointments</p>
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
            <h1 className="font-serif text-xl text-obsidian dark:text-ivory">{t(lang, 'today')}</h1>
          </div>
          <div className="flex items-center gap-3">
            {stats.urgent > 0 && (
              <div className="flex items-center gap-1.5 text-coral text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stats.urgent} urgent
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="px-6 py-3 border-b border-mist/40 dark:border-slate/20 flex gap-4 overflow-x-auto bg-white/60 dark:bg-obsidian/60">
          {[
            { label: 'Total', value: stats.total, color: 'text-teal' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-mint' },
            { label: 'Pending', value: stats.pending, color: 'text-amber' },
            { label: 'Urgent', value: stats.urgent, color: 'text-coral' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className={`font-serif text-2xl ${s.color}`}>{s.value}</span>
              <span className="text-xs text-slate">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* Appointment list */}
          <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-mist/60 dark:border-slate/20">
            <div className="p-3 space-y-2">
              {appointments.sort((a, b) => (a.urgent ? -1 : 1) || a.time_slot.localeCompare(b.time_slot)).map(appt => (
                <motion.button
                  key={appt.id}
                  onClick={() => setSelected(appt)}
                  whileHover={{ scale: 1.01 }}
                  className={`w-full text-left p-4 rounded-xl border transition-all
                    ${selected?.id === appt.id
                      ? 'border-teal bg-teal/5 shadow-sm'
                      : appt.urgent
                        ? 'border-coral/40 bg-coral/5'
                        : 'border-mist hover:border-teal/30 bg-white dark:bg-obsidian/40'
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                        ${appt.urgent ? 'bg-coral/20 text-coral' : 'bg-teal/20 text-teal'}`}>
                        {appt.patient_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-obsidian dark:text-ivory">{appt.patient_name}</p>
                        <p className="text-xs text-slate">{appt.time_slot}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate/40 mt-1" />
                  </div>
                  {statusChip(appt.status, appt.urgent)}
                </motion.button>
              ))}
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
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-lg"
                >
                  <div className={`p-6 rounded-2xl mb-5 ${selected.urgent ? 'bg-coral/10 border border-coral/30' : 'card'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="font-serif text-2xl text-obsidian dark:text-ivory">{selected.patient_name}</h2>
                        <p className="text-slate text-sm mt-0.5">{selected.phone}</p>
                      </div>
                      {statusChip(selected.status, selected.urgent)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-mist/60 dark:bg-slate/10">
                        <p className="text-xs text-slate uppercase tracking-wider mb-1">Time</p>
                        <p className="font-semibold text-sm text-obsidian dark:text-ivory">{selected.time_slot}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-mist/60 dark:bg-slate/10">
                        <p className="text-xs text-slate uppercase tracking-wider mb-1">Status</p>
                        <p className="font-semibold text-sm text-obsidian dark:text-ivory capitalize">{selected.status}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-mist/60 dark:bg-slate/10 mb-4">
                      <p className="text-xs text-slate uppercase tracking-wider mb-1">Symptoms</p>
                      <p className="text-sm text-obsidian dark:text-ivory">{selected.symptoms}</p>
                    </div>

                    {selected.note && (
                      <div className="p-3 rounded-xl bg-teal/5 border border-teal/20">
                        <p className="text-xs text-teal uppercase tracking-wider mb-1">Doctor's Note</p>
                        <p className="text-sm text-obsidian dark:text-ivory">{selected.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Note input */}
                  <div className="card p-4 mb-4">
                    <label className="text-xs text-slate uppercase tracking-wider font-semibold block mb-2">
                      <FileText className="inline w-3 h-3 mr-1" />Add Consultation Note
                    </label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      placeholder="Diagnosis, prescription, follow-up instructions..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                    <button onClick={() => saveNote(selected.id)} className="btn-secondary mt-2 text-xs">
                      Save Note
                    </button>
                  </div>

                  {/* Actions */}
                  {selected.status !== 'completed' && (
                    <button
                      onClick={() => markComplete(selected.id)}
                      className="btn-primary w-full justify-center"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t(lang, 'complete')}
                    </button>
                  )}
                  {selected.status === 'completed' && (
                    <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-mint/10 text-deep-teal text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" /> Consultation Completed
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center text-slate"
                >
                  <User className="w-12 h-12 text-mist mb-3" />
                  <p className="font-medium">Select a patient to view details</p>
                  <p className="text-xs mt-1">Click any appointment from the list</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
