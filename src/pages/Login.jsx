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

  const features = [
    'Daily mood tracking',
    'Private journaling',
    'AI companion',
    'Wellness insights'
  ]

  return (
    <div className="nirvana-auth-bg min-h-screen flex items-center justify-center px-6 py-10 sm:px-8 sm:py-16 relative overflow-hidden">
      <div className="absolute top-[-160px] right-[-104px] w-[28rem] h-[28rem] rounded-full bg-[#2D8C7C] opacity-15 blur-3xl" />
      <div className="absolute bottom-[-152px] left-[-96px] w-96 h-96 rounded-full bg-[#A8C7A1] opacity-25 blur-3xl" />

      <div className="w-full max-w-lg bg-white/95 rounded-[28px] border border-white/80 shadow-[0_24px_80px_rgba(20,30,53,0.14)] px-8 py-10 sm:px-12 sm:py-12 relative z-10 backdrop-blur">
        <div className="text-center mb-10">
          <div className="font-serif text-5xl text-teal-dark mb-4 tracking-wide">Nirvana</div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
            Sign in to continue your wellness journey in one calm, focused space.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map((feature) => (
            <span
              key={feature}
              className="text-xs font-medium text-teal-dark bg-[#E8F5EF] border border-[#CFE8DE] px-4 py-2 rounded-full shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#DDEFE7]"
            >
              {feature}
            </span>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-8">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-white text-gray-800 text-base outline-none transition-all placeholder:text-gray-400 hover:border-[#B8D9CF] focus:border-[#2D8C7C] focus:ring-4 focus:ring-[#2D8C7C]/10 focus:shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-white text-gray-800 text-base outline-none transition-all placeholder:text-gray-400 hover:border-[#B8D9CF] focus:border-[#2D8C7C] focus:ring-4 focus:ring-[#2D8C7C]/10 focus:shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#2D8C7C] text-white rounded-2xl font-semibold text-base transition-all hover:-translate-y-1 hover:bg-teal-dark hover:shadow-[0_16px_32px_rgba(45,140,124,0.25)] active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2D8C7C] font-semibold transition-colors hover:text-teal-dark focus:outline-none focus:ring-4 focus:ring-[#2D8C7C]/10 rounded-md">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
