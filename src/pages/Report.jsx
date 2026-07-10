import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getWellnessReport, getMoodHistory } from '../api/api'
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts'

export default function Report() {
  const [report,    setReport]    = useState(null)
  const [moods,     setMoods]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const [toast,     setToast]     = useState('')

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(''), 3000)
  }

  // Week range display
  const now = new Date()
  const mon = new Date(now)
  mon.setDate(now.getDate() - now.getDay() + 1)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const weekRange = `${mon.toLocaleDateString('en-IN', { day:'numeric', month:'short' })} – ${sun.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}`

  // Load mood history for chart
  useEffect(() => {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.moods || [])
        setMoods(data.slice(-7))
      })
      .catch(() => {
        setMoods([
          { moodScore:4 }, { moodScore:6 }, { moodScore:7 },
          { moodScore:5 }, { moodScore:8 }, { moodScore:6 }, { moodScore:7 }
        ])
      })
  }, [])

  const chartData = moods.map((m, i) => ({
    day:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
    mood: m.moodScore || m.mood || 0
  }))

  async function handleGenerate() {
    setLoading(true)
    try {
      const res  = await getWellnessReport()
      const data = res.data

      // Backend returns WellnessResponse with these fields
      setReport({
        avgMoodScore:       data.avgMoodScore       || 0,
        avgFrequentMood:    data.avgFrequentMood     || 'Unknown',
        totalMoodLogs:      data.totalMoodLogs       || 0,
        totalJournalEntries:data.totalJournalEntries || 0,
        bestday:            data.bestday             || '—',
        worstday:           data.worstday            || '—',
        aiInsight:          data.aiInsight           || '',
        emotions:           data.emotions            || [],
        recommendations:    data.recommendations     || [],
      })

      setGenerated(true)
      showToast('✅ Report generated! 📊')

    } catch {
      // Demo report when backend not ready
      setReport({
        avgMoodScore:        6.4,
        avgFrequentMood:     'Calm',
        totalMoodLogs:       7,
        totalJournalEntries: 3,
        bestday:             'Friday',
        worstday:            'Monday',
        aiInsight:           'You had a thoughtful week. Your mood showed a positive trend toward the weekend. Your journal entries reflected a mix of emotions — try to build on the positive moments and acknowledge the difficult ones with self-compassion.',
        emotions:            [],
        recommendations: [
          'Try a 10-minute morning meditation to set a calm tone for your day.',
          'You seem to journal most when stressed — keep that habit, it genuinely helps.',
          'Try a short evening walk to wind down before bed.',
          'Drink at least 8 glasses of water daily — hydration directly affects mood.',
          'Reach out to one friend or family member this week.',
        ]
      })
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
        <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl text-sm shadow-lg z-50 border-l-4
          ${toast.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-400'
            : 'bg-navy text-teal-light border-teal'
          }`}>
          {toast.msg}
        </div>
      )}

      <main className="ml-60 flex-1 p-8">

        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">Wellness Report 📊</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your personalised weekly mental health summary.
            </p>
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
          style={{ background:'linear-gradient(135deg, #141e35 0%, #1e3a5f 60%, #0f4a3a 100%)' }}>
          <div className="absolute top-[-70px] right-[-50px] w-56 h-56 rounded-full bg-teal opacity-15" />
          <h2 className="text-teal-light text-xl font-medium mb-1 relative z-10">
            Weekly Wellness Summary
          </h2>
          <p className="text-white/55 text-sm relative z-10">Week of {weekRange}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { value: report?.avgMoodScore?.toFixed(1) || '—',        label:'Average mood'      },
            { value: report?.totalMoodLogs       || moods.length,     label:'Moods logged'      },
            { value: report?.avgFrequentMood     || '—',              label:'Top emotion'       },
            { value: report?.totalJournalEntries || '—',              label:'Journal entries'   },
          ].map(s => (
            <div key={s.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-sm transition-all">
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
                <div className="text-xs text-gray-500 mt-1">Personalised insight</div>
              </div>
              <div className="w-11 h-11 bg-teal-pale rounded-xl flex items-center justify-center text-xl">
                🧠
              </div>
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
              <div>
                <div className="bg-teal-pale rounded-xl p-5 border-l-4 border-teal mb-4">
                  <p className="text-sm text-teal-dark leading-relaxed italic">
                    "{report?.aiInsight}"
                  </p>
                </div>

                {/* Best and worst day */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Best day</div>
                    <div className="text-sm font-medium text-green-700">
                      {report?.bestday || '—'}
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Toughest day</div>
                    <div className="text-sm font-medium text-red-600">
                      {report?.worstday || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mood chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-800 mb-5">Mood this week</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize:11 }} />
                <YAxis domain={[0,10]} tick={{ fontSize:11 }} />
                <Tooltip />
                <Bar dataKey="mood" fill="#3d8b75" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Recommendations */}
        {generated && report?.recommendations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-800 mb-5">
              Recommendations for you
            </div>
            <div className="grid grid-cols-2 gap-3">
              {report.recommendations.map((rec, i) => (
                <div key={i}
                  className="flex gap-3 items-start p-4 bg-cream rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-teal-pale rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                    {['🌿','🧘','🚶','💧','🤝','🌙','😴'][i % 7]}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}