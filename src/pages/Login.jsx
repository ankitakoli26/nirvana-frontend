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
      // Backend returns plain JWT string as text
      const token = res.data
      setAuth(token)

      // Redirect based on role decoded from token
      const savedRole = localStorage.getItem('nirvana_role')
      if (savedRole === 'DOCTOR') {
        navigate('/doctor/dashboard')
      } else {
        navigate('/patient/dashboard')
      }

    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-2">

      {/* LEFT — dark navy panel */}
      <div className="bg-navy flex flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-80px] w-80 h-80 rounded-full bg-teal opacity-10" />
        <div className="absolute bottom-[40px] left-[-60px] w-52 h-52 rounded-full bg-teal opacity-[0.08]" />

        <div className="font-serif text-4xl text-teal-light mb-12 relative z-10">
          Nirvana
        </div>

        <h1 className="text-3xl font-medium text-white/85 leading-tight mb-4 relative z-10">
          Your mind deserves<br />a safe space.
        </h1>

        <p className="text-white/40 text-sm leading-loose relative z-10 max-w-xs">
          Track your moods, reflect through journaling, talk to an AI companion,
          and get weekly wellness insights.
        </p>

        <div className="mt-12 flex flex-col gap-4 relative z-10">
          {[
            'Daily mood tracking with trends',
            'Private journal with emotion analysis',
            'AI companion that knows your history',
            'Weekly wellness reports',
            'Nearby mental health clinic finder'
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 text-white/55 text-sm">
              <div className="w-2 h-2 rounded-full bg-teal flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — login form */}
      <div className="bg-cream flex items-center justify-center px-16">
        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-medium text-gray-800 mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to continue your wellness journey.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-800 text-sm outline-none focus:border-teal transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-800 text-sm outline-none focus:border-teal transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal text-white rounded-lg font-medium text-sm hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal font-medium hover:text-teal-dark">
              Sign up free
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}