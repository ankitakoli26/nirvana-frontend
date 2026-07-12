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
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: `
          linear-gradient(rgba(15,74,58,0.92), rgba(20,30,53,0.95)),
          url('https://images.unsplash.com/photo-1545389336-cf090694435e?w=1600&auto=format&fit=crop')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>

      {/* Floating blobs for depth */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: '#3d8b75' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ background: '#a8d8c8' }} />

      {/* Logo at top */}
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(168,216,200,0.2)', border: '1px solid rgba(168,216,200,0.4)' }}>
          🧘
        </div>
        <span className="text-3xl font-bold tracking-wide"
          style={{ color: '#a8d8c8', fontFamily: 'Georgia, serif' }}>
          Nirvana
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Your mind deserves<br />
          <span style={{ color: '#a8d8c8' }}>a safe space.</span>
        </h1>
        <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Track moods · Journal privately · Chat with AI · Find support
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-10 relative z-10">
        {[
          { num: '30s',   label: 'Daily check-in',   emoji: '⚡' },
          { num: '100%',  label: 'Private & secure',  emoji: '🔒' },
          { num: 'Free',  label: 'Always free',       emoji: '💚' },
          { num: 'AI',    label: 'Powered insights',  emoji: '🤖' },
        ].map(s => (
          <div key={s.label}
            className="flex flex-col items-center px-6 py-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)'
            }}>
            <span className="text-xl mb-1">{s.emoji}</span>
            <span className="text-xl font-bold text-white">{s.num}</span>
            <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10 rounded-3xl p-8"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}>

        <h2 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h2>
        <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Sign in to continue your wellness journey.
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(216,90,106,0.2)', color: '#fca5a5', border: '1px solid rgba(216,90,106,0.3)' }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
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
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#a8d8c8'
                e.target.style.background  = 'rgba(255,255,255,0.15)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                e.target.style.background  = 'rgba(255,255,255,0.1)'
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
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
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#a8d8c8'
                e.target.style.background  = 'rgba(255,255,255,0.15)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                e.target.style.background  = 'rgba(255,255,255,0.1)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #3d8b75 0%, #0f4a3a 100%)',
              boxShadow: '0 8px 25px rgba(61,139,117,0.4)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px'
            }}
            onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? '✨ Signing in...' : 'Sign in →'}
          </button>

        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Don't have an account?{' '}
          <Link to="/register"
            className="font-semibold"
            style={{ color: '#a8d8c8' }}>
            Sign up free →
          </Link>
        </p>

      </div>

      {/* Bottom tagline */}
      <p className="mt-8 text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
        🌿 Nirvana — Mental wellness for everyone
      </p>

    </div>
  )
}