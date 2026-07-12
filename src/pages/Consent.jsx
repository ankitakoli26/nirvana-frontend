import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { inviteDoctor, revokeConsent, getMyDoctors } from '../api/api'

export default function Consent() {
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctors,     setDoctors]     = useState([])
  const [loading,     setLoading]     = useState(false)
  const [inviting,    setInviting]    = useState(false)
  const [toast,       setToast]       = useState('')

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(''), 3000)
  }

  async function loadDoctors() {
    setLoading(true)
    try {
      const res = await getMyDoctors()
      setDoctors(Array.isArray(res.data) ? res.data : [])
    } catch {
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // loadDoctors synchronizes this view with the persisted doctor list on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDoctors()
  }, [])

  async function handleInvite(e) {
    e.preventDefault()
    if (!doctorEmail.trim()) return

    setInviting(true)
    try {
      await inviteDoctor(doctorEmail)
      showToast('✅ Doctor invited successfully!')
      setDoctorEmail('')
      loadDoctors()
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not invite doctor. Try again.'
      showToast(msg, 'error')
    } finally {
      setInviting(false)
    }
  }

  async function handleRevoke(consentId) {
    try {
      await revokeConsent(consentId)
      showToast('✅ Consent revoked!')
      loadDoctors()
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not revoke consent.'
      showToast(msg, 'error')
    }
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl text-sm shadow-lg z-50 border-l-4
          ${toast.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-400'
            : 'bg-navy text-teal-light border-teal'
          }`}>
          {toast.msg}
        </div>
      )}

      <main className="ml-60 flex-1 p-8">

        <div className="mb-7">
          <h2 className="text-2xl font-medium text-gray-800">My Doctors 🤝</h2>
          <p className="text-sm text-gray-500 mt-1">
            Invite your doctor to view your mood and journal history.
            You can revoke access anytime.
          </p>
        </div>

        {/* Hero */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #141e35 0%, #1e3a5f 60%, #0f4a3a 100%)'
          }}>
          <div className="absolute top-[-70px] right-[-50px] w-56 h-56 rounded-full bg-teal opacity-15" />
          <h2 className="text-teal-light text-xl font-medium mb-2 relative z-10">
            Connect with your doctor 🩺
          </h2>
          <p className="text-white/55 text-sm relative z-10 max-w-lg">
            When you invite a doctor, they can see your mood history and journal entries
            to give you better care. Your data stays private from everyone else.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Invite form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium text-gray-800">Invite a doctor</div>
                <div className="text-xs text-gray-500 mt-1">
                  Enter your doctor's email address
                </div>
              </div>
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
                🩺
              </div>
            </div>

            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's email address
                </label>
                <input
                  type="email"
                  value={doctorEmail}
                  onChange={e => setDoctorEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 outline-none focus:border-teal transition-all"
                />
              </div>

              <div className="bg-teal-pale rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
                <span className="mt-0.5">ℹ️</span>
                <span className="text-xs text-teal-dark leading-relaxed">
                  The doctor must already have a Nirvana account with role DOCTOR.
                  Once invited they can view your mood scores and journal entries.
                </span>
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full py-3 bg-teal text-white rounded-xl font-medium text-sm hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {inviting ? 'Sending invite...' : '🤝 Invite doctor'}
              </button>
            </form>
          </div>

          {/* Doctors list */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-medium text-gray-800">
                Doctors with access
              </div>
              <span className="text-xs bg-teal-pale text-teal-dark px-3 py-1 rounded-full">
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-teal rounded-full animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3 opacity-30">🩺</div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  No doctors yet
                </h4>
                <p className="text-xs text-gray-400">
                  Invite your doctor using the form on the left.
                </p>
              </div>
            ) : (
              doctors.map((d) => (
                <div key={d.ConsentId}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 mb-3 hover:border-teal transition-all group">

                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                    🩺
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {d.doctorName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {d.doctorEmail}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevoke(d.ConsentId)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    Revoke
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}