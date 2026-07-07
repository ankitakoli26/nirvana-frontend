import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

import Login    from './pages/Login'
import Register from './pages/Register'

import Dashboard  from './pages/Dashboard'
import MoodLog    from './pages/MoodLog'
import Journal    from './pages/Journal'
import Chat       from './pages/Chat'
import Report     from './pages/Report'
import Clinics    from './pages/Clinics'
import Consent    from './pages/Consent'

import DoctorDashboard from './pages/DoctorDashboard'

// Protects any route — redirects to login if not logged in
function Protected({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

// Only PATIENT can access
function PatientOnly({ children }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'PATIENT') return <Navigate to="/doctor/dashboard" replace />
  return children
}

// Only DOCTOR can access
function DoctorOnly({ children }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'DOCTOR') return <Navigate to="/patient/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={<PatientOnly><Dashboard /></PatientOnly>} />
        <Route path="/patient/mood"      element={<PatientOnly><MoodLog /></PatientOnly>} />
        <Route path="/patient/journal"   element={<PatientOnly><Journal /></PatientOnly>} />
        <Route path="/patient/chat"      element={<PatientOnly><Chat /></PatientOnly>} />
        <Route path="/patient/wellness"  element={<PatientOnly><Report /></PatientOnly>} />
        <Route path="/patient/clinics"   element={<PatientOnly><Clinics /></PatientOnly>} />
        <Route path="/patient/consent"   element={<PatientOnly><Consent /></PatientOnly>} />

        {/* Doctor routes */}
        <Route path="/doctor/dashboard"  element={<DoctorOnly><DoctorDashboard /></DoctorOnly>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}