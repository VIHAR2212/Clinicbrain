# ClinicBrain 🏥
### Smart Doctor Appointment & Clinic Management System
**TechBlitz26 · Team Parallax**

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Smart Booking** | 5-step intelligent flow with AI triage |
| **Clash Detection** | Real-time slot availability — suggests 3 alternatives |
| **AI Triage (BrainBot)** | Detects urgent symptoms, prioritizes appointments |
| **WhatsApp Confirmations** | Instant messages on booking/cancellation |
| **Live Queue Board** | TV-optimized screen at `/queue` |
| **Role-Based Dashboards** | Doctor + Receptionist views |
| **Analytics** | Peak hours, daily trends, no-show rates |
| **Multi-language** | EN / HI / MR / ES / FR + Google Translate |
| **Dark Mode** | Full theme toggle |
| **Demo Mode** | One-click login for judges |

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + Framer Motion
- **Backend/DB**: Supabase (PostgreSQL + Auth + Realtime)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 📦 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/clinicbrain.git
cd clinicbrain

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run locally
npm run dev
```

Open http://localhost:5173

---

## 🗄 Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `supabase_schema.sql` and run
4. Go to **Project Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
5. Paste into your `.env` file

---

## 🌐 Vercel Deployment

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/clinicbrain.git
git push -u origin main

# 2. Import to Vercel
# Go to vercel.com → New Project → Import from GitHub
# Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
# Deploy!
```

---

## 🎭 Demo Mode (for judges)

Click **"Quick Demo"** on the homepage to instantly access:

| Role | Dashboard |
|---|---|
| **Patient** | Book appointments, see flow |
| **Doctor** | Today's schedule, notes, complete |
| **Receptionist** | Full management, analytics, walk-in |

No signup required. All features work with pre-loaded demo data.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Responsive nav with lang/dark toggle
│   ├── BookingForm.jsx      # 5-step booking wizard
│   ├── DemoLogin.jsx        # Judge demo modal
│   └── Chatbot.jsx          # BrainBot AI triage assistant
├── pages/
│   ├── Home.jsx             # Landing page + hero
│   ├── DoctorDashboard.jsx  # Doctor view
│   ├── ReceptionDashboard.jsx # Receptionist view
│   └── QueueBoard.jsx       # TV queue display
├── services/
│   └── supabase.js          # DB queries + helpers
├── hooks/
│   └── useApp.jsx           # Global app context
├── i18n/
│   └── translations.js      # EN/HI/MR/ES/FR strings
└── index.css                # Tailwind + custom animations
```

---

## 🎨 Design System

Colors from the Clinic OS palette:
- **Obsidian** `#0F1923` — Sidebar/nav
- **Teal** `#1A8A8F` — Primary CTAs
- **Mint** `#5EC8C2` — Confirmed status
- **Amber** `#E8A04A` — Pending/warnings
- **Coral** `#E8614A` — Urgent/cancelled
- **Ivory** `#F5F0E8` — Page background

Fonts: DM Serif Display (headings) + DM Sans (body)

---

## 📱 Pages

| Route | Description |
|---|---|
| `/` | Landing page + booking |
| `/queue` | Live TV queue board |
| `/doctor` | Doctor dashboard |
| `/receptionist` | Receptionist dashboard |

---

Built with ❤️ by Team Parallax for TechBlitz26
