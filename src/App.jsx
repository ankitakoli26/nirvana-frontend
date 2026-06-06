import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import MoodLog   from './pages/MoodLog'
import Journal   from './pages/Journal'
import Chat      from './pages/Chat'
import Report    from './pages/Report'
import Clinics   from './pages/Clinics'

// Protected route — redirects to login if not logged in
function Protected({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/"          element={<Protected><Dashboard /></Protected>} />
        <Route path="/mood"      element={<Protected><MoodLog /></Protected>} />
        <Route path="/journal"   element={<Protected><Journal /></Protected>} />
        <Route path="/chat"      element={<Protected><Chat /></Protected>} />
        <Route path="/report"    element={<Protected><Report /></Protected>} />
        <Route path="/clinics"   element={<Protected><Clinics /></Protected>} />

        {/* Redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}