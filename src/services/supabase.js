import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function createAppointment(data) {
  return supabase.from('appointments').insert([data]).select().single()
}

export function generateTimeSlots(start, end, intervalMinutes = 15) {
  const slots = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let current = sh * 60 + sm
  const endMin = eh * 60 + em
  while (current < endMin) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += intervalMinutes
  }
  return slots
}

// Doctors with multilingual specialties
export const DOCTORS_DATA = [
  {
    name: 'Dr. Ananya Mehta',
    avatar: '👩‍⚕️',
    specialty: { en: 'General Physician', hi: 'सामान्य चिकित्सक', mr: 'सामान्य चिकित्सक' }
  },
  {
    name: 'Dr. Rohan Kapoor',
    avatar: '🫀',
    specialty: { en: 'Cardiologist', hi: 'हृदय रोग विशेषज्ञ', mr: 'हृदयरोग तज्ज्ञ' }
  },
  {
    name: 'Dr. Priya Sharma',
    avatar: '🩺',
    specialty: { en: 'Dermatologist', hi: 'त्वचा रोग विशेषज्ञ', mr: 'त्वचारोग तज्ज्ञ' }
  },
  {
    name: 'Dr. Vikram Nair',
    avatar: '🦴',
    specialty: { en: 'Orthopedist', hi: 'हड्डी रोग विशेषज्ञ', mr: 'अस्थिरोग तज्ज्ञ' }
  },
]

// Keep DOCTORS for backward compat
export const DOCTORS = DOCTORS_DATA.map(d => ({ ...d, specialty: d.specialty.en }))

export const URGENT_KEYWORDS = [
  'chest pain', 'breathing', 'severe pain', 'unconscious', 'bleeding',
  'heart', 'stroke', 'emergency', 'accident', 'fracture', 'seizure',
  'allergic', 'anaphylaxis', 'overdose', 'poisoning', 'choking',
  'छाती दर्द', 'सांस', 'गंभीर दर्द', 'बेहोश', 'खून',
  'छातीदुखी', 'श्वास', 'तीव्र वेदना',
]

export function detectUrgency(symptoms) {
  const lower = symptoms.toLowerCase()
  return URGENT_KEYWORDS.some(kw => lower.includes(kw))
}
