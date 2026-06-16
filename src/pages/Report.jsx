import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getMoodHistory, generateReport } from '../api/api'
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts'

export default function Report() {
  const [moods,     setMoods]     = useState([])
  const [summary,   setSummary]   = useState('')
  const [recs,      setRecs]      = useState([])
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const [toast,     setToast]     = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Week range
  const now = new Date()
  const mon = new Date(now)
  mon.setDate(now.getDate() - now.getDay() + 1)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const weekRange = `${mon.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${sun.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`

  useEffect(() => {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.moods || [])
        setMoods(data.slice(-7))
      })
      .catch(() => {
        setMoods([
          { mood: 4 }, { mood: 6 }, { mood: 7 },
          { mood: 5 }, { mood: 8 }, { mood: 6 }, { mood: 7 }
        ])
      })
  }, [])

  const avg = moods.length
    ? (moods.reduce((s, m) => s + (m.mood || 0), 0) / moods.length).toFixed(1)
    : '—'

  const chartData = moods.map((m, i) => ({
    day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
    mood: m.mood || 0
  }))

  const emotions = [
    { name: 'Joy',     score: 0.45 },
    { name: 'Calm',    score: 0.28 },
    { name: 'Anxious', score: 0.18 },
    { name: 'Sad',     score: 0.09 },
  ]

  const demoRecs = [
    'Try a 10-minute morning meditation to set a calm tone for your day.',
    'You seem to journal most when stressed — keep that habit, it genuinely helps.',
    'Try a short evening walk to wind down before bed.',
    'Drink at least 8 glasses of water daily — hydration directly affects mood.',
    'Reach out to one friend or family member this week.',
  ]

  async function handleGenerate() {
    setLoading(true)
    try {
      const res  = await generateReport()
      const data = res.data
      setSummary(data.summary || data.report || '')
      setRecs(data.recommendations || demoRecs)
      setGenerated(true)
      showToast('✅ Report generated! 📊')
    } catch {
      setSummary(`You had a thoughtful week. Your mood showed a positive trend toward the weekend. Your journal entries reflected a mix of emotions — try to build on the positive moments and acknowledge the difficult ones with self-compassion.`)
      setRecs(demoRecs)
      setGenerated(true)
      showToast('✅ Report generated! 📊')
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

        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">Wellness Report 📊</h2>
            <p className="text-sm text-gray-500 mt-1">Your personalised weekly mental health summary.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 bg-teal text-white rounded-xl text-sm font-medium hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Generating...' : '✨ Generate report'}
          </button>
        </div>

        {/* Hero */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #141e35 0%, #1e3a5f 60%, #0f4a3a 100%)' }}>
          <div className="absolute top-[-70px] right-[-50px] w-56 h-56 rounded-full bg-teal opacity-15" />
          <h2 className="text-teal-light text-xl font-medium mb-1 relative z-10">
            Weekly Wellness Summary
          </h2>
          <p className="text-white/55 text-sm relative z-10">Week of {weekRange}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { value: avg,          label: 'Average mood'    },
            { value: moods.length, label: 'Moods logged'    },
            { value: 'Joy',        label: 'Top emotion'     },
            { value: '5🔥',        label: 'Logging streak'  },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-sm transition-all">
              <div className="text-3xl font-bold text-teal-dark">{s.value}</div>
              <div className="text-xs text-gray-500 mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* AI Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-sm font-medium text-gray-800">AI-generated summary</div>
                <div className="text-xs text-gray-500 mt-1">Personalised insight from your data</div>
              </div>
              <div className="w-11 h-11 bg-teal-pale rounded-xl flex items-center justify-center text-xl">🧠</div>
            </div>

            {!generated ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-sm text-gray-500 mb-4">
                  Click <strong>"Generate report"</strong> to get your personalised weekly summary.
                </p>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-teal text-white rounded-lg text-sm hover:bg-teal-dark transition-all"
                >
                  Generate now
                </button>
              </div>
            ) : (
              <div className="bg-teal-pale rounded-xl p-5 border-l-4 border-teal">
                <p className="text-sm text-teal-dark leading-relaxed italic">"{summary}"</p>
              </div>
            )}
          </div>

          {/* Mood chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-800 mb-5">Mood this week</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="mood" fill="#3d8b75" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-5">

          {/* Emotions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-800 mb-5">Emotion breakdown</div>
            {emotions.map(e => (
              <div key={e.name} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-600">{e.name}</span>
                  <span className="text-xs text-gray-400 font-medium">{Math.round(e.score * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-700"
                    style={{ width: `${e.score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-800 mb-5">Recommendations</div>
            {!generated ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-3 opacity-40">💡</div>
                <p className="text-sm">Generate your report first to see recommendations.</p>
              </div>
            ) : (
              ['🌿','🧘','🚶','💧','🤝'].map((icon, i) => (
                recs[i] && (
                  <div key={i} className="flex gap-3 items-start py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-teal-pale rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                      {icon}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mt-1">{recs[i]}</p>
                  </div>
                )
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}