import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/api'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { setAuth }             = useAuthStore()
  const navigate                = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res   = await loginUser({ email, password })
      const token = res.data
      setAuth(token)
      const role = localStorage.getItem('nirvana_role')
      navigate(role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0f4a3a 0%, #1a6b52 40%, #141e35 100%)'
        }}>

        {/* Background image overlay */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(168,216,200,0.2)', border: '1px solid rgba(168,216,200,0.3)' }}>
              🧘
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">Nirvana</span>
          </div>

          {/* Main text */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Your mind<br />
              <span style={{ color: '#a8d8c8' }}>deserves</span><br />
              a safe space.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Track your moods, reflect through journaling,
              and get AI-powered wellness insights every day.
            </p>
          </div>

          {/* Stats row — like B Corp website */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: '30s',   label: 'Daily check-in'     },
              { num: '100%',  label: 'Private & secure'   },
              { num: 'Free',  label: 'Always free'        },
            ].map(s => (
              <div key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(168,216,200,0.12)', border: '1px solid rgba(168,216,200,0.2)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#a8d8c8' }}>{s.num}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['😊 Mood tracking','📓 Journaling','🤖 AI companion','📊 Weekly reports','🏥 Find clinics'].map(f => (
              <span key={f}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(168,216,200,0.15)', color: '#a8d8c8', border: '1px solid rgba(168,216,200,0.25)' }}>
                {f}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ background: '#faf7f2' }}>

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-xl">🧘</span>
            <span className="text-xl font-bold" style={{ color: '#0f4a3a' }}>Nirvana</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#141e35' }}>
              Welcome back
            </h2>
            <p style={{ color: '#8a9aac' }}>
              Sign in to continue your wellness journey.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: '#fde8eb', color: '#8b2030', border: '1px solid #f7c1c1' }}>
              ❌ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>

            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a2430' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'white',
                  border: '2px solid #e0d8cc',
                  color: '#1a2430'
                }}
                onFocus={e => e.target.style.borderColor = '#3d8b75'}
                onBlur={e  => e.target.style.borderColor = '#e0d8cc'}
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a2430' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'white',
                  border: '2px solid #e0d8cc',
                  color: '#1a2430'
                }}
                onFocus={e => e.target.style.borderColor = '#3d8b75'}
                onBlur={e  => e.target.style.borderColor = '#e0d8cc'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all"
              style={{
                background: loading ? '#7ab5a0' : 'linear-gradient(135deg, #3d8b75, #0f4a3a)',
                boxShadow: '0 4px 20px rgba(61,139,117,0.35)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#e0d8cc' }} />
            <span className="text-xs" style={{ color: '#b0bcc8' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#e0d8cc' }} />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm" style={{ color: '#8a9aac' }}>
            Don't have an account?{' '}
            <Link to="/register"
              className="font-semibold transition-all"
              style={{ color: '#3d8b75' }}>
              Sign up free →
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6"
            style={{ borderTop: '1px solid #e0d8cc' }}>
            {['🔒 Secure', '🌿 Mindful', '💚 Free'].map(b => (
              <span key={b} className="text-xs font-medium" style={{ color: '#b0bcc8' }}>
                {b}
              </span>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}