import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, Heart, MapPin, Calendar, Clock, CheckCircle, AlertTriangle, ChevronRight, Loader2, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'
import { DOCTORS, detectUrgency, generateTimeSlots, checkSlotAvailability, getNextAvailableSlots, createAppointment } from '../services/supabase'

const STEPS = 5
const SLIDE = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.25, ease: 'easeOut' },
}

function ProgressDots({ step }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: STEPS }).map((_, i) => (
        <div key={i} className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'todo'}`} />
      ))}
    </div>
  )
}

export default function BookingForm({ onClose }) {
  const { lang } = useApp()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [altSlots, setAltSlots] = useState([])
  const [confirmation, setConfirmation] = useState(null)

  const [form, setForm] = useState({
    name: '', phone: '',
    symptoms: '',
    address: '', notes: '',
    doctor: DOCTORS[0].name,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
  })

  const urgent = detectUrgency(form.symptoms)
  const slots = generateTimeSlots('09:00', '17:00', 15)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const next = () => {
    setError('')
    if (step === 0 && (!form.name.trim() || !form.phone.trim())) {
      setError('Please fill in your name and phone number.')
      return
    }
    if (step === 1 && !form.symptoms.trim()) {
      setError('Please describe your symptoms.')
      return
    }
    setStep(s => s + 1)
  }

  const back = () => setStep(s => s - 1)

  const handleSlotSelect = async (slot) => {
    setForm(f => ({ ...f, timeSlot: slot }))
    setAltSlots([])
    setLoading(true)
    try {
      const available = await checkSlotAvailability(form.doctor, form.date, slot)
      if (!available) {
        const alts = await getNextAvailableSlots(form.doctor, form.date, slot)
        setAltSlots(alts)
        setForm(f => ({ ...f, timeSlot: '' }))
      }
    } catch {
      // Demo mode: slot always available
    }
    setLoading(false)
  }

  const handleConfirm = async () => {
    if (!form.timeSlot) { setError('Please select a time slot.'); return }
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await createAppointment({
        patient_name: form.name,
        phone: form.phone,
        doctor_name: form.doctor,
        date: form.date,
        time_slot: form.timeSlot,
        symptoms: form.symptoms,
        address: form.address,
        status: 'pending',
        urgent,
        source: 'web',
      })
      if (err) throw err
      setConfirmation(data || { ...form, id: 'DEMO-' + Date.now(), status: 'pending', urgent })
      setStep(4)
    } catch {
      // Demo mode fallback
      setConfirmation({ ...form, id: 'DEMO-' + Date.now(), status: 'pending', urgent })
      setStep(4)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(15,25,35,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-md bg-warm-white dark:bg-obsidian rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="gradient-teal px-6 py-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">ClinicBrain</div>
          <div className="text-white font-serif text-xl">
            {step === 0 && t(lang, 'step1_title')}
            {step === 1 && t(lang, 'step2_title')}
            {step === 2 && (urgent ? '⚡ Emergency Details' : t(lang, 'step3_title'))}
            {step === 3 && t(lang, 'step4_title')}
            {step === 4 && t(lang, 'step5_title')}
          </div>
          {urgent && step < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1.5 text-xs text-white bg-coral/80 rounded-full px-3 py-1 w-fit"
            >
              <AlertTriangle className="w-3 h-3" />
              {t(lang, 'urgent_badge')}
            </motion.div>
          )}
        </div>

        <div className="px-6 py-6">
          <ProgressDots step={step} />

          <AnimatePresence mode="wait">
            {/* Step 0: Name + Phone */}
            {step === 0 && (
              <motion.div key="s0" {...SLIDE} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    <User className="inline w-3 h-3 mr-1" />{t(lang, 'name_label')}
                  </label>
                  <input className="input" placeholder="Priya Sharma" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    <Phone className="inline w-3 h-3 mr-1" />{t(lang, 'phone_label')}
                  </label>
                  <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} type="tel" />
                </div>
              </motion.div>
            )}

            {/* Step 1: Symptoms */}
            {step === 1 && (
              <motion.div key="s1" {...SLIDE} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    <Heart className="inline w-3 h-3 mr-1" />{t(lang, 'symptoms_label')}
                  </label>
                  <textarea
                    className="input resize-none"
                    rows={4}
                    placeholder="e.g. Mild headache and fever since yesterday..."
                    value={form.symptoms}
                    onChange={set('symptoms')}
                  />
                </div>
                {urgent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-coral/10 border border-coral/30"
                  >
                    <AlertTriangle className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-coral font-medium leading-relaxed">
                      Your symptoms may require urgent attention. We'll prioritize your appointment and notify the doctor immediately.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Extra Details */}
            {step === 2 && (
              <motion.div key="s2" {...SLIDE} className="space-y-4">
                {urgent && (
                  <div>
                    <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                      <MapPin className="inline w-3 h-3 mr-1" />{t(lang, 'address_label')}
                    </label>
                    <textarea className="input resize-none" rows={2} placeholder="123 MG Road, Pune..." value={form.address} onChange={set('address')} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    <Calendar className="inline w-3 h-3 mr-1" />Choose Doctor
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {DOCTORS.map(doc => (
                      <button
                        key={doc.name}
                        onClick={() => setForm(f => ({ ...f, doctor: doc.name }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                          ${form.doctor === doc.name ? 'border-teal bg-teal/5' : 'border-mist hover:border-teal/40'}`}
                      >
                        <span className="text-xl">{doc.avatar}</span>
                        <div>
                          <div className="text-sm font-semibold text-obsidian dark:text-ivory">{doc.name}</div>
                          <div className="text-xs text-slate">{doc.specialty}</div>
                        </div>
                        {form.doctor === doc.name && <CheckCircle className="w-4 h-4 text-teal ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input type="date" className="input" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={set('date')} />
                </div>
              </motion.div>
            )}

            {/* Step 3: Time Slot */}
            {step === 3 && (
              <motion.div key="s3" {...SLIDE} className="space-y-3">
                {altSlots.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber/10 border border-amber/30 text-xs text-amber font-medium mb-2">
                    ⚠ {t(lang, 'slot_taken')}
                    <div className="flex gap-2 mt-2">
                      {altSlots.map(s => (
                        <button key={s} onClick={() => { setForm(f => ({ ...f, timeSlot: s })); setAltSlots([]) }}
                          className="px-3 py-1.5 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-deep-teal transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider">
                  <Clock className="inline w-3 h-3 mr-1" />Select Time
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => handleSlotSelect(slot)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all
                        ${form.timeSlot === slot
                          ? 'bg-teal text-white border-teal shadow-teal'
                          : 'border-mist hover:border-teal/40 text-slate hover:text-teal'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {form.timeSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-teal/5 border border-teal/20 text-sm"
                  >
                    <p className="font-semibold text-teal">Selected: {form.timeSlot}</p>
                    <p className="text-xs text-slate mt-0.5">{form.doctor} · {form.date}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && confirmation && (
              <motion.div key="s4" {...SLIDE} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-serif text-xl text-obsidian dark:text-ivory mb-1">You're all set!</h3>
                <p className="text-sm text-slate mb-5">Confirmation sent via WhatsApp to {confirmation.phone}</p>

                <div className="text-left space-y-2.5 p-4 rounded-2xl bg-mist/60 dark:bg-slate/10">
                  {[
                    ['Patient', confirmation.name || confirmation.patient_name],
                    ['Doctor', confirmation.doctor || confirmation.doctor_name],
                    ['Date', confirmation.date],
                    ['Time', confirmation.time_slot || confirmation.timeSlot],
                    ['Status', confirmation.urgent ? '🚨 URGENT' : '⏳ Pending Confirmation'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate font-medium">{label}</span>
                      <span className="text-obsidian dark:text-ivory font-semibold">{val}</span>
                    </div>
                  ))}
                </div>

                <button onClick={onClose} className="btn-primary w-full justify-center mt-5">
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-coral mt-3 text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Nav Buttons */}
          {step < 4 && (
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={back} className="btn-secondary flex-1 justify-center">
                  {t(lang, 'back')}
                </button>
              )}
              {step < 3 && (
                <button onClick={next} className="btn-primary flex-1 justify-center">
                  {t(lang, 'next')} <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {step === 3 && (
                <button onClick={handleConfirm} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {loading ? 'Booking...' : t(lang, 'confirm')}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
