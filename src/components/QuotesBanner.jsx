import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../hooks/useApp'

const QUOTES = {
  en: [
    { text: "Your health is your greatest wealth. We make caring for it effortless.", author: "ClinicBrain", emoji: "💚" },
    { text: "A doctor who listens is worth more than a dozen who don't. Book yours today.", author: "Healthcare Wisdom", emoji: "🩺" },
    { text: "Prevention is better than cure. Regular checkups save lives.", author: "World Health Organization", emoji: "🏥" },
    { text: "The greatest medicine is to teach people how not to need it.", author: "Hippocrates", emoji: "✨" },
    { text: "Zero wait. Zero confusion. Zero double bookings. That's ClinicBrain.", author: "Team Parallax", emoji: "🚀" },
  ],
  hi: [
    { text: "आपका स्वास्थ्य आपकी सबसे बड़ी संपत्ति है। हम इसकी देखभाल आसान बनाते हैं।", author: "क्लिनिकब्रेन", emoji: "💚" },
    { text: "समय पर इलाज, सही डॉक्टर — यही है सेहतमंद जिंदगी का राज।", author: "स्वास्थ्य ज्ञान", emoji: "🩺" },
    { text: "इलाज से बेहतर है बचाव। नियमित जांच करवाएं।", author: "विश्व स्वास्थ्य संगठन", emoji: "🏥" },
    { text: "अपने परिवार की सेहत की चिंता छोड़ें — हम हैं न।", author: "क्लिनिकब्रेन", emoji: "✨" },
    { text: "डबल बुकिंग नहीं, इंतजार नहीं, परेशानी नहीं। बस क्लिनिकब्रेन।", author: "टीम पैरेलैक्स", emoji: "🚀" },
  ],
  mr: [
    { text: "तुमचे आरोग्य हीच तुमची सर्वात मोठी संपत्ती आहे. आम्ही काळजी सोपी करतो.", author: "क्लिनिकब्रेन", emoji: "💚" },
    { text: "वेळेवर उपचार, योग्य डॉक्टर — हेच निरोगी जीवनाचे रहस्य.", author: "आरोग्य ज्ञान", emoji: "🩺" },
    { text: "उपचारापेक्षा प्रतिबंध चांगला. नियमित तपासणी करा.", author: "जागतिक आरोग्य संघटना", emoji: "🏥" },
    { text: "तुमच्या कुटुंबाच्या आरोग्याची काळजी आम्हाला द्या.", author: "क्लिनिकब्रेन", emoji: "✨" },
    { text: "दुहेरी बुकिंग नाही, प्रतीक्षा नाही, त्रास नाही. फक्त क्लिनिकब्रेन.", author: "टीम पॅरलॅक्स", emoji: "🚀" },
  ],
}

export default function QuotesBanner() {
  const { lang } = useApp()
  const [current, setCurrent] = useState(0)
  const quotes = QUOTES[lang] || QUOTES.en

  useEffect(() => {
    setCurrent(0)
  }, [lang])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % quotes.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [quotes.length])

  return (
    <div className="w-full bg-obsidian overflow-hidden relative" style={{ height: '80px' }}>
      {/* Gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(to right, #0F1923, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(to left, #0F1923, transparent)' }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${lang}-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center px-16"
        >
          <div className="text-center">
            <p className="text-white/90 text-sm font-medium leading-snug">
              <span className="mr-2">{quotes[current].emoji}</span>
              "{quotes[current].text}"
            </p>
            <p className="text-sage text-xs mt-1">— {quotes[current].author}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-mint w-4' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  )
}
