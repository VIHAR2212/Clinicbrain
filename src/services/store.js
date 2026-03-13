// Global appointment store with localStorage persistence
// So bookings made on Home page show up on Doctor/Receptionist dashboards

const STORAGE_KEY = 'clinicbrain_appointments'

const INITIAL_APPOINTMENTS = [
  { id: 1, patient_name: 'Priya Sharma', phone: '+91 98765 43210', doctor_name: 'Dr. Ananya Mehta', date: new Date().toISOString().split('T')[0], time_slot: '09:30', status: 'confirmed', urgent: false, source: 'whatsapp', symptoms: 'Mild headache and fatigue for 2 days', note: '' },
  { id: 2, patient_name: 'Rahul Verma', phone: '+91 87654 32109', doctor_name: 'Dr. Rohan Kapoor', date: new Date().toISOString().split('T')[0], time_slot: '10:00', status: 'confirmed', urgent: true, source: 'web', symptoms: 'Chest pain and shortness of breath', note: '' },
  { id: 3, patient_name: 'Sunita Patel', phone: '+91 76543 21098', doctor_name: 'Dr. Ananya Mehta', date: new Date().toISOString().split('T')[0], time_slot: '10:30', status: 'pending', urgent: false, source: 'walkin', symptoms: 'Back pain for a week', note: '' },
  { id: 4, patient_name: 'Amit Kumar', phone: '+91 65432 10987', doctor_name: 'Dr. Priya Sharma', date: new Date().toISOString().split('T')[0], time_slot: '11:00', status: 'confirmed', urgent: false, source: 'web', symptoms: 'Follow-up for diabetes', note: '' },
  { id: 5, patient_name: 'Neha Singh', phone: '+91 54321 09876', doctor_name: 'Dr. Vikram Nair', date: new Date().toISOString().split('T')[0], time_slot: '11:30', status: 'cancelled', urgent: false, source: 'whatsapp', symptoms: 'Skin rash since 3 days', note: '' },
  { id: 6, patient_name: 'Vikram Joshi', phone: '+91 43210 98765', doctor_name: 'Dr. Ananya Mehta', date: new Date().toISOString().split('T')[0], time_slot: '14:00', status: 'pending', urgent: false, source: 'walkin', symptoms: 'General checkup', note: '' },
]

// Load from localStorage or use initial data
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Fix dates — replace old stored dates with today if they are stale demo entries (id <= 6)
      const today = new Date().toISOString().split('T')[0]
      return parsed.map(a => {
        if (a.id <= 6) return { ...a, date: today }
        return a
      })
    }
  } catch (e) {
    console.warn('Could not load from storage', e)
  }
  // First time — save initial data
  const today = new Date().toISOString().split('T')[0]
  const initial = INITIAL_APPOINTMENTS.map(a => ({ ...a, date: today }))
  saveToStorage(initial)
  return initial
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Could not save to storage', e)
  }
}

let appointments = loadFromStorage()
let listeners = []
let nextId = Math.max(...appointments.map(a => a.id), 99) + 1

export function getAppointments() {
  return [...appointments]
}

export function addAppointment(appt) {
  const newAppt = {
    ...appt,
    id: nextId++,
    note: '',
    created_at: new Date().toISOString(),
  }
  appointments = [newAppt, ...appointments]
  saveToStorage(appointments)
  notify()
  return newAppt
}

export function updateAppointment(id, updates) {
  appointments = appointments.map(a => a.id === id ? { ...a, ...updates } : a)
  saveToStorage(appointments)
  notify()
}

export function clearAllAppointments() {
  appointments = [...INITIAL_APPOINTMENTS.map(a => ({ ...a, date: new Date().toISOString().split('T')[0] }))]
  saveToStorage(appointments)
  notify()
}

export function subscribe(fn) {
  listeners.push(fn)
  // Immediately call with current data
  fn([...appointments])
  return () => {
    listeners = listeners.filter(l => l !== fn)
  }
}

function notify() {
  listeners.forEach(fn => fn([...appointments]))
}
