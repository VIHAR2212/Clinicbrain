import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './hooks/useApp'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DoctorDashboard from './pages/DoctorDashboard'
import ReceptionDashboard from './pages/ReceptionDashboard'
import QueueBoard from './pages/QueueBoard'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/receptionist" element={<ReceptionDashboard />} />
            <Route path="/queue" element={<QueueBoard />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AppProvider>
  )
}
