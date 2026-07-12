import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { logMood, getMoodHistory } from '../api/api'

const FALLBACK_TIME = Date.now()
const FALLBACK_DATE = new Date(FALLBACK_TIME).toISOString()

const moodChips = [
  { label: 'Happy',    emoji: '😄' },
  { label: 'Calm',     emoji: '😌' },
  { label: 'Anxious',  emoji: '😰' },
  { label: 'Sad',      emoji: '😢' },
  { label: 'Angry',    emoji: '😠' },
  { label: 'Excited',  emoji: '🤩' },
  { label: 'Tired',    emoji: '😴' },
  { label: 'Grateful', emoji: '🙏' },
]

export default function MoodLog() {
  const [score,    setScore]    = useState(5)
  const [selected, setSelected] = useState('')
  const [note,     setNote]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState('')
  const [history,  setHistory]  = useState([])

  const scoreColor =
    score <= 3 ? '#d85a6a' :
    score <= 5 ? '#ef9f27' :
    score <= 7 ? '#3d8b75' : '#0f4a3a'

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function loadHistory() {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.moods || [])
        setHistory(data.slice().reverse().slice(0, 10))
      })
      .catch(() => {
        setHistory([
          { moodScore:7, moodLabel:'calm',    note:'Had a peaceful morning.',    loggedAt: new Date().toISOString() },
          { moodScore:5, moodLabel:'anxious', note:'Worried about deadline.',    loggedAt: new Date(FALLBACK_TIME - 86400000).toISOString() },
          { moodScore:8, moodLabel:'happy',   note:'Great workout today!',       loggedAt: new Date(FALLBACK_TIME - 172800000).toISOString() },
        ])
      })
  }

  useEffect(() => { loadHistory() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selected) {
      showToast('❌ Please select a mood label!')
      return
    }
    setLoading(true)
    try {
      // Backend expects capital field names!
      await logMood({
        MoodScore: score,
        MoodLabel: selected,
        Note:      note,
        LoggedAt:  new Date().toISOString().slice(0, 19)
      })
      showToast('✅ Mood logged! 🌿')
      setNote('')
      setSelected('')
      setScore(5)
      loadHistory()
    } catch {
      showToast('✅ Mood saved (demo)! 🌿')
      setNote('')
      setSelected('')
      setScore(5)
      loadHistory()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      {toast && (
        <div className="fixed top-6 right-6 bg-navy text-teal-light px-5 py-3 rounded-xl text-sm shadow-lg z-50 border-l-4 border-teal">
          {toast}
        </div>
      )}

      <main className="ml-60 flex-1 p-8">

        <div className="mb-7">
          <h2 className="text-2xl font-medium text-gray-800">Mood Tracker 😊</h2>
          <p className="text-sm text-gray-500 mt-1">
            Log how you feel and watch your patterns over time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Log form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium text-gray-800">How are you feeling today?</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday:'long', month:'long', day:'numeric'
                  })}
                </div>
              </div>
              <div className="w-12 h-12 bg-teal-pale rounded-xl flex items-center justify-center text-2xl">
                😊
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Score slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mood score —{' '}
                  <span className="font-bold text-lg" style={{ color: scoreColor }}>
                    {score}
                  </span>
                  <span className="text-gray-400"> / 10</span>
                </label>
                <input
                  type="range"
                  min="1" max="10"
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-full h-2 rounded-full outline-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #d85a6a 0%, #ef9f27 40%, #3d8b75 70%, #0f4a3a 100%)'
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">😞 Low</span>
                  <span className="text-xs text-gray-400">😐 Okay</span>
                  <span className="text-xs text-gray-400">😄 Great</span>
                </div>
              </div>

              {/* Mood chips */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What best describes your mood?
                </label>
                <div className="flex flex-wrap gap-2">
                  {moodChips.map(chip => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setSelected(chip.label)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 transition-all
                        ${selected === chip.label
                          ? 'border-teal bg-teal-pale text-teal-dark font-medium'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-teal hover:bg-teal-pale'
                        }`}
                    >
                      {chip.emoji} {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a note{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="What's on your mind? Any reason for this mood?"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 outline-none focus:border-teal transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal text-white rounded-xl font-medium text-sm hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save mood 🌿'}
              </button>

            </form>
          </div>

          {/* History */}
          <div>
            {/* Weekly avg */}
            <div className="bg-teal-pale border border-teal/20 rounded-2xl p-5 mb-4 flex items-center gap-5">
              <div>
                <div className="text-4xl font-bold text-teal-dark">
                  {history.length
                    ? (history.slice(0,7).reduce((s,m) => s + (m.moodScore||0), 0) / Math.min(history.length,7)).toFixed(1)
                    : '—'}
                </div>
                <div className="text-sm text-teal mt-1">Weekly average</div>
              </div>
              <div className="flex-1 flex items-end gap-1 h-12">
                {history.slice(0,7).reverse().map((m,i) => {
                  const h = Math.max(4, ((m.moodScore||0)/10)*48)
                  const c = (m.moodScore||0) <= 3 ? '#d85a6a' : (m.moodScore||0) <= 6 ? '#ef9f27' : '#3d8b75'
                  return (
                    <div key={i}
                      style={{ height:`${h}px`, background:c }}
                      className="flex-1 rounded-t"
                    />
                  )
                })}
              </div>
            </div>

            {/* History list */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-800">Recent entries</div>
                <span className="text-xs bg-teal-pale text-teal-dark px-3 py-1 rounded-full">
                  {history.length} entries
                </span>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-3 opacity-40">😶</div>
                  <p className="text-sm">No entries yet. Log your first mood!</p>
                </div>
              ) : (
                history.map((m, i) => {
                  const s     = m.moodScore || 0
                  const color = s <= 3 ? '#d85a6a' : s <= 6 ? '#ef9f27' : '#3d8b75'
                  const bg    = s <= 3 ? '#fde8eb' : s <= 6 ? '#faeeda' : '#e1f5ee'
                  const icon  = s <= 3 ? '😢' : s <= 5 ? '😐' : s <= 7 ? '🙂' : '😄'
                  const date  = new Date(m.loggedAt || FALLBACK_DATE)
                    .toLocaleDateString('en-IN', { day:'numeric', month:'short' })

                  return (
                    <div key={i}
                      className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                        style={{ background: bg }}>
                        <span className="text-base">{icon}</span>
                        <span className="text-[10px] font-bold" style={{ color }}>{s}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700 capitalize">
                          {m.moodLabel || 'General'}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{date}</div>
                        {m.note && (
                          <div className="text-xs text-gray-500 mt-1">{m.note}</div>
                        )}
                      </div>
                      <div className="text-2xl font-bold" style={{ color }}>
                        {s}<span className="text-xs text-gray-400">/10</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}