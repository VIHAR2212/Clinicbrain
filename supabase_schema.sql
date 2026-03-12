-- ============================================================
-- ClinicBrain — Supabase Database Schema
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- 1. Profiles (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Patients
CREATE TABLE IF NOT EXISTS patients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  phone        TEXT NOT NULL,
  doctor_name  TEXT NOT NULL,
  date         DATE NOT NULL,
  time_slot    TIME NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','confirmed','cancelled','completed','no_show')),
  symptoms     TEXT,
  address      TEXT,
  notes        TEXT,
  urgent       BOOLEAN DEFAULT FALSE,
  source       TEXT DEFAULT 'web'
               CHECK (source IN ('web','whatsapp','walkin')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent double booking per doctor per slot
  UNIQUE (doctor_name, date, time_slot)
);

-- 4. Clinic config
CREATE TABLE IF NOT EXISTS clinic_config (
  id                   SERIAL PRIMARY KEY,
  doctor_id            UUID REFERENCES profiles(id),
  slot_duration        INT DEFAULT 15,
  working_hours_start  TIME DEFAULT '09:00',
  working_hours_end    TIME DEFAULT '17:00',
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
CREATE POLICY "profiles_self" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Appointments: authenticated users can read all, insert their own
CREATE POLICY "appointments_read" ON appointments
  FOR SELECT USING (true);

CREATE POLICY "appointments_insert" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "appointments_update" ON appointments
  FOR UPDATE USING (true);

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_appointments_date     ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor   ON appointments(doctor_name);
CREATE INDEX IF NOT EXISTS idx_appointments_status   ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_phone    ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_urgent   ON appointments(urgent) WHERE urgent = TRUE;

-- ============================================================
-- Demo seed data (optional — uncomment to populate)
-- ============================================================

-- INSERT INTO appointments (patient_name, phone, doctor_name, date, time_slot, status, urgent, source)
-- VALUES
--   ('Priya Sharma',  '+91 98765 43210', 'Dr. Ananya Mehta',  CURRENT_DATE, '09:30', 'confirmed', false, 'web'),
--   ('Rahul Verma',   '+91 87654 32109', 'Dr. Rohan Kapoor',  CURRENT_DATE, '10:00', 'confirmed', true,  'whatsapp'),
--   ('Sunita Patel',  '+91 76543 21098', 'Dr. Ananya Mehta',  CURRENT_DATE, '10:30', 'pending',   false, 'walkin'),
--   ('Amit Kumar',    '+91 65432 10987', 'Dr. Priya Sharma',  CURRENT_DATE, '11:00', 'confirmed', false, 'web'),
--   ('Neha Singh',    '+91 54321 09876', 'Dr. Vikram Nair',   CURRENT_DATE, '11:30', 'cancelled', false, 'whatsapp');
