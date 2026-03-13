import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import {
  Activity, Calendar, Shield, Zap, MessageCircle, BarChart3,
  CheckCircle, ArrowRight, Play, Star, Clock, Users, TrendingUp
} from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'
import BookingForm from '../components/BookingForm'
import DemoLogin from '../components/DemoLogin'
import Chatbot from '../components/Chatbot'
import QuotesBanner from '../components/QuotesBanner'
import WhatsAppReceipt from '../components/WhatsAppReceipt'

function getFeatures(lang) {
  const features = {
    en: [
      { icon: Shield, title: 'Zero Double-Bookings', desc: 'Intelligent clash detection checks every slot in real-time. Suggests the next 3 available times automatically.', color: 'text-mint', bg: 'bg-mint/10' },
      { icon: MessageCircle, title: 'WhatsApp Confirmations', desc: 'Patients get instant WhatsApp messages when appointments are confirmed, rescheduled, or cancelled.', color: 'text-teal', bg: 'bg-teal/10' },
      { icon: Zap, title: 'AI Triage', desc: 'BrainBot detects urgent symptoms like chest pain and automatically prioritizes those appointments.', color: 'text-coral', bg: 'bg-coral/10' },
      { icon: BarChart3, title: 'Smart Analytics', desc: 'Peak hour charts, daily counts, no-show rates — all in a beautiful real-time dashboard.', color: 'text-lavender', bg: 'bg-lavender/10' },
      { icon: Calendar, title: 'Live Queue Board', desc: 'A TV-optimized public screen showing current patient, next up, and estimated wait time.', color: 'text-amber', bg: 'bg-amber/10' },
      { icon: Users, title: 'Role-Based Access', desc: 'Separate dashboards for doctors and receptionists with exactly the controls each role needs.', color: 'text-sage', bg: 'bg-sage/10' },
    ],
    hi: [
      { icon: Shield, title: 'डबल बुकिंग नहीं', desc: 'स्मार्ट क्लैश डिटेक्शन हर स्लॉट को रीयल-टाइम में चेक करता है। अगले 3 उपलब्ध समय अपने आप सुझाता है।', color: 'text-mint', bg: 'bg-mint/10' },
      { icon: MessageCircle, title: 'व्हाट्सएप पुष्टि', desc: 'अपॉइंटमेंट की पुष्टि, रीशेड्यूल या रद्द होने पर मरीज को तुरंत व्हाट्सएप मैसेज।', color: 'text-teal', bg: 'bg-teal/10' },
      { icon: Zap, title: 'AI ट्राइज', desc: 'ब्रेनबॉट छाती दर्द जैसे गंभीर लक्षणों को पहचानकर उन अपॉइंटमेंट को प्राथमिकता देता है।', color: 'text-coral', bg: 'bg-coral/10' },
      { icon: BarChart3, title: 'स्मार्ट एनालिटिक्स', desc: 'पीक आवर चार्ट, दैनिक गिनती, नो-शो दर — सुंदर रीयल-टाइम डैशबोर्ड में।', color: 'text-lavender', bg: 'bg-lavender/10' },
      { icon: Calendar, title: 'लाइव क्यू बोर्ड', desc: 'TV स्क्रीन के लिए पब्लिक पेज — अभी कौन है, अगला कौन है, कितना इंतजार।', color: 'text-amber', bg: 'bg-amber/10' },
      { icon: Users, title: 'रोल-बेस्ड एक्सेस', desc: 'डॉक्टर और रिसेप्शनिस्ट के लिए अलग-अलग डैशबोर्ड।', color: 'text-sage', bg: 'bg-sage/10' },
    ],
    mr: [
      { icon: Shield, title: 'दुहेरी बुकिंग नाही', desc: 'स्मार्ट क्लॅश डिटेक्शन प्रत्येक स्लॉट रिअल-टाइममध्ये तपासतो. पुढील 3 उपलब्ध वेळा आपोआप सुचवतो.', color: 'text-mint', bg: 'bg-mint/10' },
      { icon: MessageCircle, title: 'व्हॉट्सॲप पुष्टी', desc: 'अपॉइंटमेंट पुष्टी, पुनर्निर्धारण किंवा रद्द झाल्यावर रुग्णाला तात्काळ व्हॉट्सॲप संदेश.', color: 'text-teal', bg: 'bg-teal/10' },
      { icon: Zap, title: 'AI ट्रायज', desc: 'ब्रेनबॉट छातीदुखी सारखी गंभीर लक्षणे ओळखून त्या अपॉइंटमेंटना प्राधान्य देतो.', color: 'text-coral', bg: 'bg-coral/10' },
      { icon: BarChart3, title: 'स्मार्ट विश्लेषण', desc: 'व्यस्त तास चार्ट, दैनिक संख्या, अनुपस्थिती दर — सुंदर रिअल-टाइम डॅशबोर्डमध्ये.', color: 'text-lavender', bg: 'bg-lavender/10' },
      { icon: Calendar, title: 'थेट रांग बोर्ड', desc: 'TV स्क्रीनसाठी सार्वजनिक पेज — आता कोण, पुढे कोण, किती प्रतीक्षा.', color: 'text-amber', bg: 'bg-amber/10' },
      { icon: Users, title: 'भूमिका-आधारित प्रवेश', desc: 'डॉक्टर आणि रिसेप्शनिस्टसाठी स्वतंत्र डॅशबोर्ड.', color: 'text-sage', bg: 'bg-sage/10' },
    ],
  }
  return features[lang] || features.en
}

function getSteps(lang) {
  const steps = {
    en: [
      { step: '01', title: 'Enter Details', desc: 'Name and phone number', emoji: '👤' },
      { step: '02', title: 'Describe Symptoms', desc: 'AI checks for urgency', emoji: '🩺' },
      { step: '03', title: 'Choose Doctor', desc: 'Pick doctor & date', emoji: '📋' },
      { step: '04', title: 'Pick Time', desc: 'Smart slot suggestion', emoji: '🕐' },
      { step: '05', title: 'Confirmed!', desc: 'WhatsApp sent instantly', emoji: '✅' },
    ],
    hi: [
      { step: '01', title: 'जानकारी दें', desc: 'नाम और फोन नंबर', emoji: '👤' },
      { step: '02', title: 'लक्षण बताएं', desc: 'AI आपातकाल जांचता है', emoji: '🩺' },
      { step: '03', title: 'डॉक्टर चुनें', desc: 'डॉक्टर और तारीख चुनें', emoji: '📋' },
      { step: '04', title: 'समय चुनें', desc: 'स्मार्ट स्लॉट सुझाव', emoji: '🕐' },
      { step: '05', title: 'पुष्टि!', desc: 'व्हाट्सएप तुरंत भेजा', emoji: '✅' },
    ],
    mr: [
      { step: '01', title: 'माहिती द्या', desc: 'नाव आणि फोन नंबर', emoji: '👤' },
      { step: '02', title: 'लक्षणे सांगा', desc: 'AI तातडी तपासतो', emoji: '🩺' },
      { step: '03', title: 'डॉक्टर निवडा', desc: 'डॉक्टर आणि तारीख', emoji: '📋' },
      { step: '04', title: 'वेळ निवडा', desc: 'स्मार्ट स्लॉट सूचना', emoji: '🕐' },
      { step: '05', title: 'पुष्टी!', desc: 'व्हॉट्सॲप तात्काळ', emoji: '✅' },
    ],
  }
  return steps[lang] || steps.en
}

function getStats(lang) {
  const stats = {
    en: [
      { label: 'Avg. time saved per day', value: '3.5hrs', icon: Clock },
      { label: 'Booking conflicts prevented', value: '100%', icon: Shield },
      { label: 'Patient satisfaction', value: '4.9★', icon: Star },
      { label: 'Appointments managed', value: '10k+', icon: TrendingUp },
    ],
    hi: [
      { label: 'प्रतिदिन बचाया गया समय', value: '3.5 घंटे', icon: Clock },
      { label: 'बुकिंग टकराव रोके', value: '100%', icon: Shield },
      { label: 'मरीज संतुष्टि', value: '4.9★', icon: Star },
      { label: 'अपॉइंटमेंट प्रबंधित', value: '10k+', icon: TrendingUp },
    ],
    mr: [
      { label: 'दररोज वाचवलेला वेळ', value: '3.5 तास', icon: Clock },
      { label: 'बुकिंग संघर्ष रोखले', value: '100%', icon: Shield },
      { label: 'रुग्ण समाधान', value: '4.9★', icon: Star },
      { label: 'अपॉइंटमेंट व्यवस्थापित', value: '10k+', icon: TrendingUp },
    ],
  }
  return stats[lang] || stats.en
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }
}

const CTA_LABELS = {
  en: { ready: 'Ready to streamline your clinic?', sub: 'Book your first appointment in under 60 seconds. No setup required.', book: 'Book Appointment', try: 'Try Demo' },
  hi: { ready: 'अपने क्लिनिक को स्मार्ट बनाने के लिए तैयार हैं?', sub: '60 सेकंड में पहली अपॉइंटमेंट बुक करें। कोई सेटअप नहीं।', book: 'अपॉइंटमेंट बुक करें', try: 'डेमो देखें' },
  mr: { ready: 'तुमचे क्लिनिक स्मार्ट करण्यास तयार आहात?', sub: '60 सेकंदात पहिली अपॉइंटमेंट बुक करा. कोणतीही सेटअप नाही.', book: 'अपॉइंटमेंट बुक करा', try: 'डेमो पहा' },
}

const FEATURES_LABEL = { en: 'Everything You Need', hi: 'सब कुछ जो आपको चाहिए', mr: 'तुम्हाला हवे ते सर्व' }
const BUILT_LABEL = { en: 'Built for real clinics', hi: 'वास्तविक क्लीनिकों के लिए बनाया गया', mr: 'खऱ्या क्लिनिकसाठी बनवले' }
const BUILT_SUB = { en: "Not a generic booking template. ClinicBrain is purpose-built for doctor's offices that need reliability.", hi: 'यह कोई सामान्य बुकिंग टेम्प्लेट नहीं है। क्लिनिकब्रेन डॉक्टर के क्लीनिक के लिए बनाया गया है।', mr: 'हे सामान्य बुकिंग टेम्प्लेट नाही. क्लिनिकब्रेन डॉक्टरांच्या कार्यालयांसाठी उद्देशाने बनवले आहे.' }
const FLOW_LABEL = { en: 'The Flow', hi: 'कैसे काम करता है', mr: 'कसे कार्य करते' }
const FLOW_SUB = { en: 'How booking works', hi: 'बुकिंग कैसे होती है', mr: 'बुकिंग कसे होते' }
const HERO_BADGE = { en: 'TechBlitz26 · Team Parallax', hi: 'टेकब्लिट्ज़26 · टीम पैरेलैक्स', mr: 'टेकब्लिट्झ26 · टीम पॅरलॅक्स' }

export default function Home() {
  const { lang } = useApp()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const handleBookingClose = (appointment) => {
    setBookingOpen(false)
    // ✅ FIX: Show WhatsApp receipt with the real phone number from the booking
    if (appointment) setReceipt(appointment)
  }

  // ✅ FIX: Pass onOpenBooking so Patient Demo opens booking form directly
  const handleDemoClose = () => setDemoOpen(false)
  const handleOpenBooking = () => setBookingOpen(true)

  const features = getFeatures(lang)
  const steps = getSteps(lang)
  const stats = getStats(lang)
  const cta = CTA_LABELS[lang] || CTA_LABELS.en

  return (
    <div className="pt-16">
      {/* ── Quotes Banner ─────────────────────────────────────────────── */}
      <QuotesBanner />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden mesh-bg">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal/15 to-mint/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber/8 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                {HERO_BADGE[lang] || HERO_BADGE.en}
              </div>
            </motion.div>

            <motion.h1 {...fadeUp(0.05)}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-obsidian dark:text-ivory mb-6">
              {lang === 'hi' ? <>आपका क्लिनिक,<br /><span className="text-teal italic">खुद चलाएं।</span></> :
               lang === 'mr' ? <>तुमचे क्लिनिक,<br /><span className="text-teal italic">स्वतः चालवा।</span></> :
               <>Your Clinic,<br /><span className="text-teal italic">Running Itself.</span></>}
            </motion.h1>

            <motion.p {...fadeUp(0.1)} className="text-slate text-lg leading-relaxed max-w-xl mb-8">
              {t(lang, 'hero_sub')}
            </motion.p>

            <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-3">
              <button onClick={() => setBookingOpen(true)} className="btn-primary text-base px-7 py-3.5">
                <Calendar className="w-5 h-5" />{t(lang, 'book_now')}
              </button>
              <button onClick={() => setDemoOpen(true)} className="btn-secondary text-base px-7 py-3.5">
                <Play className="w-5 h-5" />{t(lang, 'demo_login')}
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-6 mt-10">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-mist flex items-center justify-center">
                    <Icon className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <div className="font-serif text-xl text-obsidian dark:text-ivory leading-none">{value}</div>
                    <div className="text-xs text-slate mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Preview */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
            <div className="relative">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 z-10 card px-4 py-3 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                <span className="text-xs font-semibold text-obsidian dark:text-ivory">
                  {lang === 'hi' ? 'आज 3 अपॉइंटमेंट' : lang === 'mr' ? 'आज 3 अपॉइंटमेंट' : '3 appointments today'}
                </span>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -right-4 z-10 card px-4 py-3">
                <div className="chip chip-urgent text-[10px]">🚨 {lang === 'hi' ? 'आपातकाल' : lang === 'mr' ? 'तातडीचे' : 'URGENT'}</div>
                <p className="text-xs text-slate mt-1">
                  {/* ✅ FIX: Translated doctor name in hero preview card */}
                  {lang === 'hi' ? 'छाती दर्द · डॉ. कपूर' : lang === 'mr' ? 'छातीदुखी · डॉ. कपूर' : 'Chest pain · Dr. Kapoor'}
                </p>
              </motion.div>
              <div className="card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate uppercase tracking-wider font-semibold">
                      {lang === 'hi' ? 'आज का शेड्यूल' : lang === 'mr' ? 'आजचे वेळापत्रक' : "Today's Schedule"}
                    </p>
                    {/* ✅ FIX: Translated doctor name in hero card */}
                    <p className="font-serif text-xl text-obsidian dark:text-ivory mt-0.5">
                      {lang === 'hi' ? 'डॉ. अनन्या मेहता' : lang === 'mr' ? 'डॉ. अनन्या मेहता' : 'Dr. Ananya Mehta'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: 'Priya Sharma', time: '09:30', chip: 'chip-confirmed', label: lang === 'hi' ? 'पुष्टि' : lang === 'mr' ? 'पुष्टी' : 'confirmed' },
                    { name: 'Rahul Verma',  time: '10:00', chip: 'chip-urgent',    label: lang === 'hi' ? 'आपातकाल' : lang === 'mr' ? 'तातडीचे' : 'urgent' },
                    { name: 'Sunita Patel', time: '10:30', chip: 'chip-pending',   label: lang === 'hi' ? 'प्रतीक्षारत' : lang === 'mr' ? 'प्रलंबित' : 'pending' },
                    { name: 'Amit Kumar',   time: '11:00', chip: 'chip-confirmed', label: lang === 'hi' ? 'पुष्टि' : lang === 'mr' ? 'पुष्टी' : 'confirmed' },
                  ].map((appt, i) => (
                    <motion.div key={appt.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-mist/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center text-xs font-bold text-teal">
                          {appt.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-obsidian">{appt.name}</p>
                          <p className="text-[10px] text-slate">{appt.time} AM</p>
                        </div>
                      </div>
                      <span className={`chip ${appt.chip} text-[10px]`}>{appt.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-ivory/50 dark:bg-obsidian/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
              {FEATURES_LABEL[lang] || FEATURES_LABEL.en}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-obsidian dark:text-ivory">
              {BUILT_LABEL[lang] || BUILT_LABEL.en}
            </h2>
            <p className="text-slate text-lg mt-4 max-w-xl mx-auto">
              {BUILT_SUB[lang] || BUILT_SUB.en}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.06)}>
                  <div className="card p-6 h-full group hover:border-teal/30 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="font-serif text-lg text-obsidian dark:text-ivory mb-2">{f.title}</h3>
                    <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
              {FLOW_LABEL[lang] || FLOW_LABEL.en}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-obsidian dark:text-ivory">
              {FLOW_SUB[lang] || FLOW_SUB.en}
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.07)} className="text-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl gradient-teal flex items-center justify-center text-2xl mx-auto mb-3">
                    {s.emoji}
                  </div>
                  {i < 4 && <ArrowRight className="hidden lg:block absolute top-5 -right-4 w-4 h-4 text-mist" />}
                </div>
                <p className="text-teal text-xs font-bold uppercase tracking-wider mb-1">{s.step}</p>
                <p className="font-semibold text-sm text-obsidian dark:text-ivory">{s.title}</p>
                <p className="text-xs text-slate mt-0.5">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="py-20 gradient-teal">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="font-serif text-4xl sm:text-5xl text-white mb-4">{cta.ready}</h2>
            <p className="text-white/80 text-lg mb-8">{cta.sub}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setBookingOpen(true)}
                className="bg-white text-teal px-8 py-3.5 rounded-xl font-semibold hover:bg-ivory transition-colors flex items-center gap-2">
                <Calendar className="w-5 h-5" />{cta.book}
              </button>
              <button onClick={() => setDemoOpen(true)}
                className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" />{cta.try}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingOpen && <BookingForm key="booking" onClose={handleBookingClose} />}
        {demoOpen && (
          <DemoLogin
            key="demo"
            onClose={handleDemoClose}
            onOpenBooking={handleOpenBooking}
          />
        )}
      </AnimatePresence>

      {/* ✅ FIX: WhatsApp receipt uses real phone from booking form */}
      {receipt && (
        <WhatsAppReceipt
          appointment={receipt}
          lang={lang}
          onClose={() => setReceipt(null)}
        />
      )}

      <Chatbot onOpenBooking={() => setBookingOpen(true)} />
    </div>
  )
}
