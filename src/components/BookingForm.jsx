import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, Heart, MapPin, Calendar, Clock, CheckCircle, AlertTriangle, ChevronRight, Loader2, X, MessageCircle } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'
import { DOCTORS_DATA, detectUrgency, generateTimeSlots, getDoctorDisplayName } from '../services/supabase'
import { addAppointment, getAppointments } from '../services/store'

const STEPS = 5

function ProgressDots({ step }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: STEPS }).map((_, i) => (
        <div key={i} className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'todo'}`} />
      ))}
    </div>
  )
}

const SLIDE = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.25, ease: 'easeOut' },
}

const CHOOSE_DOCTOR  = { en: 'Choose Doctor',     hi: 'डॉक्टर चुनें',         mr: 'डॉक्टर निवडा' }
const DATE_LABEL     = { en: 'Date',              hi: 'तारीख',                mr: 'तारीख' }
const SELECT_TIME    = { en: 'Select Time Slot',  hi: 'समय चुनें',            mr: 'वेळ निवडा' }
const SELECTED_LABEL = { en: 'Selected',          hi: 'चुना गया',             mr: 'निवडले' }
const BOOKING_MSG    = { en: 'Booking...',        hi: 'बुक हो रहा है...',     mr: 'बुक होत आहे...' }
const WHATSAPP_MSG   = { en: 'WhatsApp confirmation sent to', hi: 'व्हाट्सएप पुष्टि भेजी गई', mr: 'व्हॉट्सॲप पुष्टी पाठवली' }
const REALTIME_MSG   = { en: 'Your appointment is visible to the doctor and receptionist in real-time.', hi: 'आपकी अपॉइंटमेंट डॉक्टर और रिसेप्शनिस्ट को रीयल-टाइम में दिखती है।', mr: 'तुमची अपॉइंटमेंट डॉक्टर आणि रिसेप्शनिस्टला रिअल-टाइममध्ये दिसते.' }
const SLOT_TAKEN_MSG = { en: 'already booked',   hi: 'पहले से बुक',           mr: 'आधीच बुक' }
const NO_SLOTS_MSG   = { en: 'All slots booked for this doctor on this date!', hi: 'इस डॉक्टर के सभी स्लॉट बुक हो गए हैं!', mr: 'या डॉक्टरचे सर्व स्लॉट बुक झाले आहेत!' }
const DONE_LABEL     = { en: 'Done',             hi: 'हो गया',                mr: 'झाले' }
const URGENT_MSG     = { en: 'Your symptoms may require urgent attention! We will prioritize your appointment.', hi: 'आपके लक्षणों पर तत्काल ध्यान देना जरूरी है! आपकी अपॉइंटमेंट को प्राथमिकता दी जाएगी।', mr: 'तुमच्या लक्षणांकडे तातडीने लक्ष देणे आवश्यक आहे! तुमच्या अपॉइंटमेंटला प्राधान्य दिले जाईल.' }
const DOCTOR_LABEL   = { en: 'Doctor',           hi: 'डॉक्टर',               mr: 'डॉक्टर' }
const PATIENT_LABEL  = { en: 'Patient',          hi: 'मरीज',                 mr: 'रुग्ण' }
const DATE_LBL       = { en: 'Date',             hi: 'तारीख',                mr: 'तारीख' }
const TIME_LABEL     = { en: 'Time',             hi: 'समय',                  mr: 'वेळ' }
const STATUS_LABEL   = { en: 'Status',           hi: 'स्थिति',               mr: 'स्थिती' }
const URGENT_STATUS  = { en: 'URGENT',           hi: 'आपातकाल',              mr: 'तातडीचे' }
const PENDING_STATUS = { en: 'Pending Confirmation', hi: 'पुष्टि प्रतीक्षित', mr: 'पुष्टीची प्रतीक्षा' }

export default function BookingForm({ onClose }) {
  const { lang } = useApp()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    symptoms: '',
    address: '',
    doctor: DOCTORS_DATA[0].name,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
  })

  const urgent = detectUrgency(form.symptoms)
  const allSlots = generateTimeSlots('09:00', '17:00', 15)

  const bookedSlots = getAppointments()
    .filter(a =>
      a.doctor_name === form.doctor &&
      a.date === form.date &&
      a.status !== 'cancelled'
    )
    .map(a => a.time_slot)

  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s))

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handlePhone = (e) => {
    const val = e.target.value.replace(/[^0-9+\s\-]/g, '')
    setForm(f => ({ ...f, phone: val }))
  }

  const next = () => {
    setError('')
    if (step === 0) {
      if (!form.name.trim()) {
        setError(lang === 'hi' ? 'कृपया नाम दर्ज करें' : lang === 'mr' ? 'कृपया नाव टाका' : 'Please enter your name.')
        return
      }
      if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
        setError(lang === 'hi' ? 'कृपया सही फोन नंबर दर्ज करें (10 अंक)' : lang === 'mr' ? 'कृपया योग्य फोन नंबर टाका (10 अंक)' : 'Please enter a valid 10-digit phone number.')
        return
      }
    }
    if (step === 1 && !form.symptoms.trim()) {
      setError(lang === 'hi' ? 'कृपया लक्षण बताएं' : lang === 'mr' ? 'कृपया लक्षणे सांगा' : 'Please describe your symptoms.')
      return
    }
    setStep(s => s + 1)
  }

  const back = () => { setStep(s => s - 1); setError('') }

  const handleConfirm = async () => {
    if (!form.timeSlot) {
      setError(lang === 'hi' ? 'कृपया समय चुनें' : lang === 'mr' ? 'कृपया वेळ निवडा' : 'Please select a time slot.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const newAppt = addAppointment({
      patient_name: form.name,
      phone: form.phone,            // ✅ real phone stored
      doctor_name: form.doctor,     // always English key for store lookups
      date: form.date,
      time_slot: form.timeSlot,
      symptoms: form.symptoms,
      address: form.address,
      status: 'pending',
      urgent,
      source: 'web',
    })
    setConfirmation(newAppt)
    setStep(4)
    setLoading(false)
  }

  // ✅ Helper: translated doctor display name
  const dn = (name) => getDoctorDisplayName(name, lang)

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(15,25,35,0.6)', backdropFilter: 'blur(6px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
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
            {step === 2 && t(lang, 'step3_title')}
            {step === 3 && t(lang, 'step4_title')}
            {step === 4 && t(lang, 'step5_title')}
          </div>
          {urgent && step > 0 && step < 4 && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1.5 text-xs text-white bg-coral/80 rounded-full px-3 py-1 w-fit">
              <AlertTriangle className="w-3 h-3" />{t(lang, 'urgent_badge')}
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
                  <input className="input"
                    placeholder={lang === 'hi' ? 'प्रिया शर्मा' : lang === 'mr' ? 'प्रिया शर्मा' : 'Priya Sharma'}
                    value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    <Phone className="inline w-3 h-3 mr-1" />{t(lang, 'phone_label')}
                  </label>
                  <input
                    className="input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handlePhone}
                    type="tel"
                    inputMode="numeric"
                    maxLength={15}
                  />
                  <p className="text-xs text-slate mt-1">
                    {lang === 'hi' ? '📱 केवल नंबर दर्ज करें' : lang === 'mr' ? '📱 फक्त नंबर टाका' : '📱 Numbers only'}
                  </p>
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
                  <textarea className="input resize-none" rows={4}
                    placeholder={lang === 'hi' ? 'जैसे: कल से हल्का बुखार और सिरदर्द...' : lang === 'mr' ? 'उदा. काल पासून हलका ताप आणि डोकेदुखी...' : 'e.g. Mild headache and fever since yesterday...'}
                    value={form.symptoms} onChange={set('symptoms')} />
                </div>
                {urgent && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-coral/10 border border-coral/30">
                    <AlertTriangle className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-coral font-medium leading-relaxed">{URGENT_MSG[lang] || URGENT_MSG.en}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Doctor + Date */}
            {step === 2 && (
              <motion.div key="s2" {...SLIDE} className="space-y-4">
                {urgent && (
                  <div>
                    <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                      <MapPin className="inline w-3 h-3 mr-1" />{t(lang, 'address_label')}
                    </label>
                    <textarea className="input resize-none" rows={2}
                      placeholder={lang === 'hi' ? '123 एमजी रोड, पुणे...' : lang === 'mr' ? '123 एमजी रोड, पुणे...' : '123 MG Road, Pune...'}
                      value={form.address} onChange={set('address')} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    {CHOOSE_DOCTOR[lang] || CHOOSE_DOCTOR.en}
                  </label>
                  <div className="grid gap-2 max-h-52 overflow-y-auto pr-1">
                    {DOCTORS_DATA.map(doc => (
                      <button key={doc.name}
                        onClick={() => setForm(f => ({ ...f, doctor: doc.name, timeSlot: '' }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                          ${form.doctor === doc.name ? 'border-teal bg-teal/5' : 'border-mist hover:border-teal/40'}`}>
                        <span className="text-xl">{doc.avatar}</span>
                        <div>
                          {/* ✅ FIX: Translated doctor name in picker */}
                          <div className="text-sm font-semibold text-obsidian dark:text-ivory">
                            {doc.displayName?.[lang] || doc.name}
                          </div>
                          <div className="text-xs text-slate">{doc.specialty[lang] || doc.specialty.en}</div>
                        </div>
                        {form.doctor === doc.name && <CheckCircle className="w-4 h-4 text-teal ml-auto flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                    <Calendar className="inline w-3 h-3 mr-1" />{DATE_LABEL[lang] || DATE_LABEL.en}
                  </label>
                  <input type="date" className="input" value={form.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value, timeSlot: '' }))} />
                </div>
              </motion.div>
            )}

            {/* Step 3: Time Slot */}
            {step === 3 && (
              <motion.div key="s3" {...SLIDE} className="space-y-3">
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider">
                  <Clock className="inline w-3 h-3 mr-1" />{SELECT_TIME[lang] || SELECT_TIME.en}
                </label>
                {availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-coral">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">{NO_SLOTS_MSG[lang] || NO_SLOTS_MSG.en}</p>
                    <button onClick={back} className="btn-secondary mt-3 text-xs">
                      {lang === 'hi' ? 'दूसरी तारीख चुनें' : lang === 'mr' ? 'दुसरी तारीख निवडा' : 'Choose another date'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                      {availableSlots.map(slot => (
                        <button key={slot} onClick={() => setForm(f => ({ ...f, timeSlot: slot }))}
                          className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all
                            ${form.timeSlot === slot
                              ? 'bg-teal text-white border-teal shadow-teal'
                              : 'border-mist hover:border-teal/40 text-slate hover:text-teal'}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    {bookedSlots.length > 0 && (
                      <p className="text-[10px] text-slate/60 text-center">
                        {bookedSlots.length} {SLOT_TAKEN_MSG[lang] || SLOT_TAKEN_MSG.en} • {availableSlots.length} {lang === 'hi' ? 'उपलब्ध' : lang === 'mr' ? 'उपलब्ध' : 'available'}
                      </p>
                    )}
                    {form.timeSlot && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-teal/5 border border-teal/20">
                        <p className="font-semibold text-teal text-sm">✓ {SELECTED_LABEL[lang]}: {form.timeSlot}</p>
                        {/* ✅ FIX: Translated doctor name in slot preview */}
                        <p className="text-xs text-slate mt-0.5">{dn(form.doctor)} · {form.date}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && confirmation && (
              <motion.div key="s4" {...SLIDE} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-serif text-xl text-obsidian dark:text-ivory mb-1">{t(lang, 'book_confirmed')}</h3>

                {/* ✅ FIX: Shows ACTUAL registered phone number */}
                <p className="text-sm text-slate mb-2 flex items-center justify-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-mint" />
                  {WHATSAPP_MSG[lang]} {confirmation.phone}
                </p>

                <div className="text-left space-y-2.5 p-4 rounded-2xl bg-mist/60 dark:bg-slate/10 mb-4">
                  {[
                    [PATIENT_LABEL[lang],  confirmation.patient_name],
                    // ✅ FIX: Translated doctor name in confirmation receipt
                    [DOCTOR_LABEL[lang],   dn(confirmation.doctor_name)],
                    [DATE_LBL[lang],       confirmation.date],
                    [TIME_LABEL[lang],     confirmation.time_slot],
                    [STATUS_LABEL[lang],   confirmation.urgent
                      ? '🚨 ' + URGENT_STATUS[lang]
                      : '⏳ ' + PENDING_STATUS[lang]],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate font-medium">{label}</span>
                      <span className="text-obsidian dark:text-ivory font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate mb-4">{REALTIME_MSG[lang] || REALTIME_MSG.en}</p>
                <button onClick={() => onClose(confirmation)} className="btn-primary w-full justify-center">
                  {DONE_LABEL[lang] || DONE_LABEL.en}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-coral mt-3 text-center">{error}</motion.p>
          )}

          {step < 4 && (
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={back} className="btn-secondary flex-1 justify-center">{t(lang, 'back')}</button>
              )}
              {step < 3 && (
                <button onClick={next} className="btn-primary flex-1 justify-center">
                  {t(lang, 'next')} <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {step === 3 && availableSlots.length > 0 && (
                <button onClick={handleConfirm} disabled={loading || !form.timeSlot}
                  className="btn-primary flex-1 justify-center disabled:opacity-50">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />{BOOKING_MSG[lang]}</>
                    : <><CheckCircle className="w-4 h-4" />{t(lang, 'confirm')}</>}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
