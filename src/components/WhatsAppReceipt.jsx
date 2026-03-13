import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MessageCircle, CheckCheck, X } from 'lucide-react'

// Simulates a WhatsApp message popup receipt
export default function WhatsAppReceipt({ appointment, lang, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 400)
    }, 8000) // auto close after 8 seconds
    return () => clearTimeout(timer)
  }, [])

  const messages = {
    en: {
      greeting: `Hello ${appointment?.patient_name}! 👋`,
      confirmed: `✅ Your appointment has been confirmed at ClinicBrain.`,
      doctor: `🩺 Doctor: ${appointment?.doctor_name}`,
      date: `📅 Date: ${appointment?.date}`,
      time: `🕐 Time: ${appointment?.time_slot}`,
      urgent: `🚨 Your case has been marked URGENT. The doctor will prioritize you.`,
      footer: `Thank you for choosing ClinicBrain. Stay healthy! 💚`,
      title: 'WhatsApp Receipt',
      sent: 'Message sent to',
      dismiss: 'Dismiss',
    },
    hi: {
      greeting: `नमस्ते ${appointment?.patient_name}! 👋`,
      confirmed: `✅ आपकी अपॉइंटमेंट क्लिनिकब्रेन में पुष्टि हो गई है।`,
      doctor: `🩺 डॉक्टर: ${appointment?.doctor_name}`,
      date: `📅 तारीख: ${appointment?.date}`,
      time: `🕐 समय: ${appointment?.time_slot}`,
      urgent: `🚨 आपका मामला आपातकालीन है। डॉक्टर आपको प्राथमिकता देंगे।`,
      footer: `क्लिनिकब्रेन चुनने के लिए धन्यवाद। स्वस्थ रहें! 💚`,
      title: 'व्हाट्सएप रसीद',
      sent: 'मैसेज भेजा गया',
      dismiss: 'बंद करें',
    },
    mr: {
      greeting: `नमस्कार ${appointment?.patient_name}! 👋`,
      confirmed: `✅ तुमची अपॉइंटमेंट क्लिनिकब्रेनमध्ये पुष्टी झाली आहे.`,
      doctor: `🩺 डॉक्टर: ${appointment?.doctor_name}`,
      date: `📅 तारीख: ${appointment?.date}`,
      time: `🕐 वेळ: ${appointment?.time_slot}`,
      urgent: `🚨 तुमचा मामला तातडीचा आहे. डॉक्टर तुम्हाला प्राधान्य देतील.`,
      footer: `क्लिनिकब्रेन निवडल्याबद्दल धन्यवाद. निरोगी राहा! 💚`,
      title: 'व्हॉट्सॲप पावती',
      sent: 'संदेश पाठवला',
      dismiss: 'बंद करा',
    },
  }

  const m = messages[lang] || messages.en

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-24 right-4 z-[200] w-80 rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: '1px solid rgba(37,211,102,0.3)' }}
        >
          {/* WhatsApp Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ background: '#075E54' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ClinicBrain</p>
                <p className="text-white/70 text-xs">{m.title}</p>
              </div>
            </div>
            <button onClick={() => { setVisible(false); setTimeout(onClose, 400) }}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Message Bubble */}
          <div style={{ background: '#ECE5DD' }} className="p-3">
            <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-full">
              <div className="space-y-1.5 text-xs text-gray-800 leading-relaxed">
                <p className="font-semibold">{m.greeting}</p>
                <p>{m.confirmed}</p>
                <div className="my-2 border-t border-gray-100" />
                <p>{m.doctor}</p>
                <p>{m.date}</p>
                <p>{m.time}</p>
                {appointment?.urgent && (
                  <p className="text-red-600 font-semibold mt-1">{m.urgent}</p>
                )}
                <div className="my-2 border-t border-gray-100" />
                <p className="text-gray-500">{m.footer}</p>
              </div>
              {/* Timestamp + ticks */}
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[10px] text-gray-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            {/* Sent to line */}
            <p className="text-center text-[10px] mt-2" style={{ color: '#667781' }}>
              {m.sent}: {appointment?.phone}
            </p>
          </div>

          {/* Progress bar - auto dismiss */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: 'linear' }}
            className="h-0.5"
            style={{ background: '#25D366' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
