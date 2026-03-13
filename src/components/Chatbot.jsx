import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Zap } from 'lucide-react'
import { detectUrgency } from '../services/supabase'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'

const RESPONSES = {
  en: {
    urgent: ['🚨 These symptoms sound serious! Please go to the nearest emergency room immediately. Would you like me to book a priority appointment?'],
    headache: ['Headaches can have many causes. How severe is it on a scale of 1-10? Any fever or nausea?'],
    fever: ['Fever can indicate infection. Is it above 102°F (38.9°C)? Any other symptoms like cough or body ache?'],
    cough: ['How long have you had the cough? Is it dry or productive? Any difficulty breathing?'],
    back: ['Back pain is very common. Is it sharp or dull? Does it radiate to your legs?'],
    booking: ['Ready to book! I can help you schedule with the right specialist. Shall I open the booking form?'],
    default: [
      'I understand your concern. Based on what you\'ve described, I recommend booking an appointment for a proper diagnosis.',
      'That sounds like something a doctor should evaluate. Would you like me to check available slots?',
    ],
  },
  hi: {
    urgent: ['🚨 ये लक्षण गंभीर लग रहे हैं! कृपया तुरंत नजदीकी आपातकालीन कक्ष जाएं। क्या मैं प्राथमिकता अपॉइंटमेंट बुक करूं?'],
    headache: ['सिरदर्द के कई कारण हो सकते हैं। 1-10 के पैमाने पर कितना दर्द है? बुखार या मतली भी है?'],
    fever: ['बुखार संक्रमण का संकेत हो सकता है। क्या यह 38.9°C से ऊपर है? खांसी या बदन दर्द भी है?'],
    cough: ['खांसी कब से है? सूखी है या बलगम है? सांस लेने में कठिनाई है?'],
    back: ['पीठ दर्द बहुत आम है। तेज दर्द है या हल्का? क्या दर्द पैरों तक जाता है?'],
    booking: ['बुकिंग के लिए तैयार हूं! क्या मैं बुकिंग फॉर्म खोलूं?'],
    default: ['आपकी बात समझी। उचित जांच के लिए डॉक्टर से मिलना जरूरी है। क्या अपॉइंटमेंट बुक करें?'],
  },
  mr: {
    urgent: ['🚨 ही लक्षणे गंभीर वाटतात! कृपया ताबडतोब जवळच्या रुग्णालयात जा. प्राधान्य अपॉइंटमेंट बुक करू का?'],
    headache: ['डोकेदुखीची अनेक कारणे असू शकतात. 1-10 च्या स्केलवर किती दुखतं? ताप किंवा मळमळ आहे का?'],
    fever: ['ताप हे संसर्गाचे लक्षण असू शकते. 38.9°C पेक्षा जास्त आहे का? खोकला किंवा अंगदुखी आहे का?'],
    cough: ['खोकला किती दिवसांपासून आहे? कोरडा की बेडका? श्वास घेण्यास त्रास आहे का?'],
    back: ['पाठदुखी खूप सामान्य आहे. तीव्र की सौम्य? दुखणे पायांपर्यंत जाते का?'],
    booking: ['बुकिंगसाठी तयार! बुकिंग फॉर्म उघडू का?'],
    default: ['तुमची समस्या समजली. योग्य तपासणीसाठी डॉक्टरांना भेटणे आवश्यक आहे. अपॉइंटमेंट बुक करायची का?'],
  },
}

function detectIntent(msg) {
  const lower = msg.toLowerCase()
  if (detectUrgency(msg)) return 'urgent'
  if (lower.includes('headache') || lower.includes('head pain') || lower.includes('सिरदर्द') || lower.includes('डोकेदुखी')) return 'headache'
  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('बुखार') || lower.includes('ताप')) return 'fever'
  if (lower.includes('cough') || lower.includes('cold') || lower.includes('खांसी') || lower.includes('खोकला')) return 'cough'
  if (lower.includes('back') || lower.includes('spine') || lower.includes('पीठ') || lower.includes('पाठ')) return 'back'
  if (lower.includes('book') || lower.includes('appointment') || lower.includes('अपॉइंटमेंट') || lower.includes('बुक')) return 'booking'
  return 'default'
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export default function Chatbot({ onOpenBooking }) {
  const { lang } = useApp()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef()

  // Reset messages when language changes
  useEffect(() => {
    setMessages([{ from: 'bot', text: t(lang, 'chatbot_greeting'), ts: Date.now() }])
  }, [lang])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(m => [...m, { from: 'user', text, ts: Date.now() }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500))

    const intent = detectIntent(text)
    const langResponses = RESPONSES[lang] || RESPONSES.en
    const response = pick(langResponses[intent] || langResponses.default)
    setTyping(false)
    setMessages(m => [...m, { from: 'bot', text: response, ts: Date.now(), urgent: intent === 'urgent' }])

    if (intent !== 'urgent') {
      setTimeout(() => {
        const bookMsg = lang === 'hi' ? '📅 नीचे बुकिंग फॉर्म खोलें →' :
          lang === 'mr' ? '📅 खाली बुकिंग फॉर्म उघडा →' :
          '📅 Click below to open the booking form and schedule your appointment.'
        setMessages(m => [...m, { from: 'bot', text: bookMsg, ts: Date.now(), action: 'book' }])
      }, 1000)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-teal rounded-full shadow-teal flex items-center justify-center"
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && <span className="absolute inset-0 rounded-full bg-teal/40 animate-ping" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ maxHeight: '520px', border: '1px solid rgba(94,200,194,0.2)' }}
          >
            <div className="gradient-teal px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">BrainBot</div>
                <div className="text-white/70 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block animate-pulse" />
                  AI Triage · {lang === 'hi' ? 'हिंदी' : lang === 'mr' ? 'मराठी' : 'English'}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-warm-white dark:bg-obsidian">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center
                    ${msg.from === 'bot' ? 'bg-teal/20 text-teal' : 'bg-obsidian/10 text-slate'}`}>
                    {msg.from === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className={`max-w-[220px] px-3 py-2 rounded-xl text-xs leading-relaxed
                      ${msg.from === 'bot'
                        ? msg.urgent ? 'bg-coral/10 border border-coral/30 text-coral' : 'bg-mist dark:bg-slate/20 text-obsidian dark:text-ivory'
                        : 'bg-teal text-white'}`}>
                      {msg.text}
                    </div>
                    {msg.action === 'book' && (
                      <button onClick={() => { onOpenBooking?.(); setOpen(false) }}
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-teal font-semibold hover:underline">
                        <Zap className="w-3 h-3" />
                        {lang === 'hi' ? 'बुकिंग फॉर्म खोलें →' : lang === 'mr' ? 'बुकिंग फॉर्म उघडा →' : 'Open Booking Form →'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-teal" />
                  </div>
                  <div className="bg-mist dark:bg-slate/20 px-3 py-2 rounded-xl flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-slate/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white dark:bg-obsidian border-t border-mist/40 flex gap-2">
              <input
                className="input flex-1 text-xs py-2"
                placeholder={t(lang, 'chatbot_placeholder')}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
              />
              <button onClick={send} disabled={!input.trim()}
                className="w-9 h-9 gradient-teal rounded-xl flex items-center justify-center disabled:opacity-40">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
