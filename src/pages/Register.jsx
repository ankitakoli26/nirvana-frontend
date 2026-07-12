import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/api'
import useAuthStore from '../store/authStore'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [role,     setRole]     = useState('PATIENT')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { setAuth }             = useAuthStore()
  const navigate                = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      // Backend expects: { username, email, password, role }
      const res   = await registerUser({ username, email, password, role })
      // Backend returns plain JWT string
      const token = res.data
      setAuth(token)

      // Redirect based on role
      if (role === 'DOCTOR') {
        navigate('/doctor/dashboard')
      } else {
        navigate('/patient/dashboard')
      }

    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Free to use',
    'Private and secure',
    'AI-powered insights',
    'Clinic finder'
  ]

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-[-120px] right-[-80px] w-96 h-96 rounded-full bg-teal opacity-10" />
      <div className="absolute bottom-[-140px] left-[-90px] w-80 h-80 rounded-full bg-teal opacity-[0.08]" />

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg px-8 py-9 relative z-10">
        <div className="text-center mb-8">
          <div className="font-serif text-4xl text-teal-dark mb-3">Nirvana</div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            Create account
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Start your mental wellness journey from one calm, focused space.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {features.map((feature) => (
            <span
              key={feature}
              className="text-xs text-teal-dark bg-teal-pale px-3 py-1.5 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                className={`py-3 rounded-xl text-sm font-medium border-2 transition-all
                  ${role === 'PATIENT'
                    ? 'border-teal bg-teal-pale text-teal-dark'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-teal'
                  }`}
              >
                🧘 Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('DOCTOR')}
                className={`py-3 rounded-xl text-sm font-medium border-2 transition-all
                  ${role === 'DOCTOR'
                    ? 'border-teal bg-teal-pale text-teal-dark'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-teal'
                  }`}
              >
                🩺 Doctor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-800 text-sm outline-none focus:border-teal transition-all"
            />
          </div>

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
              placeholder="At least 6 characters"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-800 text-sm outline-none focus:border-teal transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal text-white rounded-lg font-medium text-sm hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal font-medium hover:text-teal-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
