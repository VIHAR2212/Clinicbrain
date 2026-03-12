import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

// ── Appointments ──────────────────────────────────────────────────────────────

export async function getAppointments(filters = {}) {
  let query = supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true })
    .order('time_slot', { ascending: true })

  if (filters.date) query = query.eq('date', filters.date)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.doctor) query = query.eq('doctor_name', filters.doctor)

  return query
}

export async function getTodayAppointments() {
  const today = new Date().toISOString().split('T')[0]
  return getAppointments({ date: today })
}

export async function checkSlotAvailability(doctorName, date, timeSlot) {
  const { data, error } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_name', doctorName)
    .eq('date', date)
    .eq('time_slot', timeSlot)
    .not('status', 'eq', 'cancelled')

  if (error) throw error
  return data.length === 0 // true = slot is free
}

export async function getNextAvailableSlots(doctorName, date, preferredTime, count = 3) {
  const allSlots = generateTimeSlots('09:00', '17:00', 15)
  const preferredIdx = allSlots.indexOf(preferredTime)
  const slotsToCheck = [
    ...allSlots.slice(preferredIdx + 1),
    ...allSlots.slice(0, preferredIdx),
  ]

  const available = []
  for (const slot of slotsToCheck) {
    if (available.length >= count) break
    const isFree = await checkSlotAvailability(doctorName, date, slot)
    if (isFree) available.push(slot)
  }
  return available
}

export async function createAppointment(data) {
  return supabase.from('appointments').insert([data]).select().single()
}

export async function updateAppointment(id, updates) {
  return supabase.from('appointments').update(updates).eq('id', id).select().single()
}

export async function deleteAppointment(id) {
  return supabase.from('appointments').delete().eq('id', id)
}

export async function searchPatient(phone) {
  return supabase.from('appointments').select('*').ilike('phone', `%${phone}%`)
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function getAnalytics() {
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: false })
    .limit(200)

  if (!appointments) return null

  // Peak hours
  const hourCount = {}
  appointments.forEach(a => {
    const hour = a.time_slot?.split(':')[0]
    if (hour) hourCount[hour] = (hourCount[hour] || 0) + 1
  })

  // Daily counts (last 7 days)
  const dailyCounts = {}
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  last7.forEach(d => { dailyCounts[d] = 0 })
  appointments.forEach(a => {
    if (dailyCounts[a.date] !== undefined) dailyCounts[a.date]++
  })

  const noShows = appointments.filter(a => a.status === 'no_show').length
  const noShowPct = appointments.length > 0
    ? Math.round((noShows / appointments.length) * 100)
    : 0

  return {
    peakHours: Object.entries(hourCount).map(([hour, count]) => ({
      hour: `${hour}:00`, count
    })).sort((a, b) => a.hour.localeCompare(b.hour)),
    daily: last7.map(d => ({ date: d.slice(5), count: dailyCounts[d] })),
    noShowPct,
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    urgent: appointments.filter(a => a.urgent).length,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

export const DOCTORS = [
  { name: 'Dr. Ananya Mehta', specialty: 'General Physician', avatar: '👩‍⚕️' },
  { name: 'Dr. Rohan Kapoor', specialty: 'Cardiologist', avatar: '🫀' },
  { name: 'Dr. Priya Sharma', specialty: 'Dermatologist', avatar: '🩺' },
  { name: 'Dr. Vikram Nair', specialty: 'Orthopedist', avatar: '🦴' },
]

export const URGENT_KEYWORDS = [
  'chest pain', 'breathing', 'severe pain', 'unconscious', 'bleeding',
  'heart', 'stroke', 'emergency', 'accident', 'fracture', 'seizure',
  'allergic', 'anaphylaxis', 'overdose', 'poisoning', 'choking',
]

export function detectUrgency(symptoms) {
  const lower = symptoms.toLowerCase()
  return URGENT_KEYWORDS.some(kw => lower.includes(kw))
}
