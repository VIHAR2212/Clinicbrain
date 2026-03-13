import { motion, AnimatePresence } from 'framer-motion'
import { Zap, User, Stethoscope, ClipboardList, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

const DEMOS = {
  en: [
    { role: 'patient', label: 'Patient Demo', icon: User, color: 'from-mint/20 to-teal/10', border: 'border-mint/40', iconColor: 'text-teal', desc: 'Book appointments, view confirmations, get WhatsApp updates', path: '/' },
    { role: 'doctor', label: 'Doctor Demo', icon: Stethoscope, color: 'from-lavender/20 to-lavender/5', border: 'border-lavender/40', iconColor: 'text-lavender', desc: "View today's schedule, add notes, mark appointments complete", path: '/doctor' },
    { role: 'receptionist', label: 'Receptionist Demo', icon: ClipboardList, color: 'from-amber/20 to-amber/5', border: 'border-amber/40', iconColor: 'text-amber', desc: 'Full appointment management, search patients, analytics', path: '/receptionist' },
  ],
  hi: [
    { role: 'patient', label: 'मरीज डेमो', icon: User, color: 'from-mint/20 to-teal/10', border: 'border-mint/40', iconColor: 'text-teal', desc: 'अपॉइंटमेंट बुक करें, पुष्टि देखें, व्हाट्सएप अपडेट पाएं', path: '/' },
    { role: 'doctor', label: 'डॉक्टर डेमो', icon: Stethoscope, color: 'from-lavender/20 to-lavender/5', border: 'border-lavender/40', iconColor: 'text-lavender', desc: 'आज का शेड्यूल देखें, नोट्स जोड़ें, अपॉइंटमेंट पूर्ण करें', path: '/doctor' },
    { role: 'receptionist', label: 'रिसेप्शनिस्ट डेमो', icon: ClipboardList, color: 'from-amber/20 to-amber/5', border: 'border-amber/40', iconColor: 'text-amber', desc: 'पूर्ण अपॉइंटमेंट प्रबंधन, मरीज खोजें, एनालिटिक्स', path: '/receptionist' },
  ],
  mr: [
    { role: 'patient', label: 'रुग्ण डेमो', icon: User, color: 'from-mint/20 to-teal/10', border: 'border-mint/40', iconColor: 'text-teal', desc: 'अपॉइंटमेंट बुक करा, पुष्टी पहा, व्हॉट्सॲप अपडेट मिळवा', path: '/' },
    { role: 'doctor', label: 'डॉक्टर डेमो', icon: Stethoscope, color: 'from-lavender/20 to-lavender/5', border: 'border-lavender/40', iconColor: 'text-lavender', desc: 'आजचे वेळापत्रक पहा, नोंदी जोडा, अपॉइंटमेंट पूर्ण करा', path: '/doctor' },
    { role: 'receptionist', label: 'रिसेप्शनिस्ट डेमो', icon: ClipboardList, color: 'from-amber/20 to-amber/5', border: 'border-amber/40', iconColor: 'text-amber', desc: 'संपूर्ण अपॉइंटमेंट व्यवस्थापन, रुग्ण शोधा, विश्लेषण', path: '/receptionist' },
  ],
}

const TITLES   = { en: 'Quick Demo Access',       hi: 'त्वरित डेमो प्रवेश',    mr: 'त्वरित डेमो प्रवेश' }
const SUBS     = { en: 'Explore without signing up — for judges & visitors', hi: 'बिना साइन अप किए देखें — जजों और आगंतुकों के लिए', mr: 'साइन अप न करता एक्सप्लोर करा' }
const FOOTERS  = { en: 'Demo data is pre-loaded • No account required • Fully functional', hi: 'डेमो डेटा पहले से लोड है • कोई खाता नहीं चाहिए', mr: 'डेमो डेटा आधीच लोड आहे • खाते आवश्यक नाही' }

export default function DemoLogin({ onClose, onOpenBooking }) {
  const { activateDemo, lang } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const demos = DEMOS[lang] || DEMOS.en

  const handleSelect = (demo) => {
    setSelected(demo.role)
    setTimeout(() => {
      activateDemo(demo.role)
      if (demo.role === 'patient') {
        // ✅ FIX: Just close the modal — stay on home page, open booking form
        onClose?.()
        setTimeout(() => onOpenBooking?.(), 100)
      } else {
        navigate(demo.path)
        onClose?.()
      }
    }, 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,25,35,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-warm-white dark:bg-obsidian rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 btn-ghost w-8 h-8 p-0 justify-center rounded-full">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-obsidian dark:text-ivory">{TITLES[lang] || TITLES.en}</h2>
            <p className="text-xs text-slate">{SUBS[lang] || SUBS.en}</p>
          </div>
        </div>
        <div className="grid gap-3 mt-6">
          {demos.map((demo) => {
            const Icon = demo.icon
            const isSelected = selected === demo.role
            return (
              <motion.button key={demo.role} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect(demo)}
                className={`relative w-full text-left p-4 rounded-2xl border bg-gradient-to-br ${demo.color} ${demo.border} transition-all duration-200 hover:shadow-md overflow-hidden`}>
                {isSelected && <motion.div layoutId="demo-selected" className="absolute inset-0 bg-teal/10 rounded-2xl" />}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 ${demo.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-obsidian dark:text-ivory text-sm">{demo.label}</span>
                      <ArrowRight className={`w-4 h-4 transition-all duration-200 ${isSelected ? 'text-teal translate-x-1' : 'text-slate'}`} />
                    </div>
                    <p className="text-xs text-slate leading-relaxed">{demo.desc}</p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
        <p className="text-center text-xs text-slate mt-5">{FOOTERS[lang] || FOOTERS.en}</p>
      </motion.div>
    </motion.div>
  )
}
