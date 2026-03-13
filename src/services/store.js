// Global shared appointment store
// This simulates a real-time database in demo mode

const INITIAL_APPOINTMENTS = [
  { id: 1, patient_name: 'Priya Sharma', phone: '+91 98765 43210', doctor_name: 'Dr. Ananya Mehta', date: new Date().toISOString().split('T')[0], time_slot: '09:30', status: 'confirmed', urgent: false, source: 'whatsapp', symptoms: 'Mild headache and fatigue for 2 days', note: '' },
  { id: 2, patient_name: 'Rahul Verma', phone: '+91 87654 32109', doctor_name: 'Dr. Rohan Kapoor', date: new Date().toISOString().split('T')[0], time_slot: '10:00', status: 'confirmed', urgent: true, source: 'web', symptoms: 'Chest pain and shortness of breath', note: '' },
  { id: 3, patient_name: 'Sunita Patel', phone: '+91 76543 21098', doctor_name: 'Dr. Ananya Mehta', date: new Date().toISOString().split('T')[0], time_slot: '10:30', status: 'pending', urgent: false, source: 'walkin', symptoms: 'Back pain for a week', note: '' },
  { id: 4, patient_name: 'Amit Kumar', phone: '+91 65432 10987', doctor_name: 'Dr. Priya Sharma', date: new Date().toISOString().split('T')[0], time_slot: '11:00', status: 'confirmed', urgent: false, source: 'web', symptoms: 'Follow-up for diabetes', note: '' },
  { id: 5, patient_name: 'Neha Singh', phone: '+91 54321 09876', doctor_name: 'Dr. Vikram Nair', date: new Date().toISOString().split('T')[0], time_slot: '11:30', status: 'cancelled', urgent: false, source: 'whatsapp', symptoms: 'Skin rash since 3 days', note: '' },
  { id: 6, patient_name: 'Vikram Joshi', phone: '+91 43210 98765', doctor_name: 'Dr. Ananya Mehta', date: new Date().toISOString().split('T')[0], time_slot: '14:00', status: 'pending', urgent: false, source: 'walkin', symptoms: 'General checkup', note: '' },
]

let appointments = [...INITIAL_APPOINTMENTS]
let listeners = []
let nextId = 100

export function getAppointments() {
  return [...appointments]
}

export function addAppointment(appt) {
  const newAppt = { ...appt, id: nextId++, note: '' }
  appointments = [newAppt, ...appointments]
  notify()
  return newAppt
}

export function updateAppointment(id, updates) {
  appointments = appointments.map(a => a.id === id ? { ...a, ...updates } : a)
  notify()
}

export function subscribe(fn) {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}

function notify() {
  listeners.forEach(fn => fn([...appointments]))
}
