// ============================================================
// ClinicBrain — supabase.js
// DOCTORS_DATA: names stay English (proper nouns),
// BUT specialties are translated in EN / HI / MR
// Doctor display names are NOW translated in HI & MR too
// ============================================================

export const DOCTORS_DATA = [
  {
    name: 'Dr. Ananya Mehta',
    // ✅ FIX: translated display names per language
    displayName: {
      en: 'Dr. Ananya Mehta',
      hi: 'डॉ. अनन्या मेहता',
      mr: 'डॉ. अनन्या मेहता',
    },
    avatar: '👩‍⚕️',
    specialty: {
      en: 'Cardiologist',
      hi: 'हृदय रोग विशेषज्ञ',
      mr: 'हृदयरोग तज्ञ',
    },
  },
  {
    name: 'Dr. Rohan Kapoor',
    displayName: {
      en: 'Dr. Rohan Kapoor',
      hi: 'डॉ. रोहन कपूर',
      mr: 'डॉ. रोहन कपूर',
    },
    avatar: '👨‍⚕️',
    specialty: {
      en: 'Neurologist',
      hi: 'न्यूरोलॉजिस्ट',
      mr: 'मज्जातंतू तज्ञ',
    },
  },
  {
    name: 'Dr. Priya Sharma',
    displayName: {
      en: 'Dr. Priya Sharma',
      hi: 'डॉ. प्रिया शर्मा',
      mr: 'डॉ. प्रिया शर्मा',
    },
    avatar: '👩‍⚕️',
    specialty: {
      en: 'General Physician',
      hi: 'सामान्य चिकित्सक',
      mr: 'सामान्य वैद्य',
    },
  },
  {
    name: 'Dr. Vikram Nair',
    displayName: {
      en: 'Dr. Vikram Nair',
      hi: 'डॉ. विक्रम नायर',
      mr: 'डॉ. विक्रम नायर',
    },
    avatar: '👨‍⚕️',
    specialty: {
      en: 'Orthopedic Surgeon',
      hi: 'हड्डी रोग विशेषज्ञ',
      mr: 'अस्थिरोग शल्यचिकित्सक',
    },
  },
  {
    name: 'Dr. Sneha Joshi',
    displayName: {
      en: 'Dr. Sneha Joshi',
      hi: 'डॉ. स्नेहा जोशी',
      mr: 'डॉ. स्नेहा जोशी',
    },
    avatar: '👩‍⚕️',
    specialty: {
      en: 'Pediatrician',
      hi: 'बाल रोग विशेषज्ञ',
      mr: 'बालरोग तज्ञ',
    },
  },
  {
    name: 'Dr. Arjun Desai',
    displayName: {
      en: 'Dr. Arjun Desai',
      hi: 'डॉ. अर्जुन देसाई',
      mr: 'डॉ. अर्जुन देसाई',
    },
    avatar: '👨‍⚕️',
    specialty: {
      en: 'Dermatologist',
      hi: 'त्वचा रोग विशेषज्ञ',
      mr: 'त्वचारोग तज्ञ',
    },
  },
]

// ✅ Backward-compatibility alias — ReceptionDashboard & DoctorDashboard import { DOCTORS }
export const DOCTORS = DOCTORS_DATA

// Helper: get display name for current language
export function getDoctorDisplayName(doctorName, lang = 'en') {
  const doc = DOCTORS_DATA.find(d => d.name === doctorName)
  if (!doc) return doctorName
  return doc.displayName?.[lang] || doctorName
}

// Helper: get specialty for current language
export function getDoctorSpecialty(doctorName, lang = 'en') {
  const doc = DOCTORS_DATA.find(d => d.name === doctorName)
  if (!doc) return ''
  return doc.specialty?.[lang] || doc.specialty.en
}

// ============================================================
// Urgency Detection
// ============================================================
const URGENT_KEYWORDS = [
  // English
  'chest pain', 'chest ache', 'heart attack', 'can\'t breathe', 'cannot breathe',
  'difficulty breathing', 'shortness of breath', 'stroke', 'unconscious',
  'severe bleeding', 'high fever', 'seizure', 'fits', 'overdose',
  // Hindi
  'सीने में दर्द', 'सांस नहीं', 'सांस लेने में तकलीफ', 'दिल का दौरा',
  'बेहोश', 'तेज बुखार', 'दौरा',
  // Marathi
  'छातीत दुखणे', 'श्वास घेता येत नाही', 'हृदयविकाराचा झटका',
  'बेशुद्ध', 'तीव्र ताप', 'झटका',
]

export function detectUrgency(text = '') {
  const lower = text.toLowerCase()
  return URGENT_KEYWORDS.some(k => lower.includes(k.toLowerCase()))
}

// ============================================================
// Time Slot Generator
// ============================================================
export function generateTimeSlots(start = '09:00', end = '17:00', interval = 15) {
  const slots = []
  let [h, m] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  while (h < eh || (h === eh && m < em)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += interval
    if (m >= 60) { h++; m -= 60 }
  }
  return slots
}
