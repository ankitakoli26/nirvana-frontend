import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getMoodHistory } from '../api/api'
import useAuthStore from '../store/authStore'
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts'

const tips = [
  "Start your morning with 5 minutes of silence. Let your thoughts settle before the day begins.",
  "Write down 3 things you are grateful for today. Gratitude rewires the brain toward positivity.",
  "Take a 10-minute walk outside. Nature reduces stress and calms anxiety.",
  "Drink a full glass of water before checking your phone. Hydration improves mood and focus.",
  "Reach out to one person you care about today. Social connection is the #1 predictor of wellbeing.",
  "Put your phone away 30 minutes before bed. Blue light disrupts sleep quality.",
  "Do one thing today purely for joy — not productivity, not obligation. Just joy."
]

export default function Dashboard() {
  const { user }            = useAuthStore()
  const [moods, setMoods]   = useState([])
  const [loading, setLoading] = useState(true)

  const name    = user?.name || user?.username || 'Friend'
  const hour    = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const tip     = tips[new Date().getDay()]

  useEffect(() => {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.moods || [])
        setMoods(data.slice(-7))
      })
      .catch(() => {
        // Demo data when backend not ready
        setMoods([
          { mood: 4, createdAt: '2026-04-01' },
          { mood: 6, createdAt: '2026-04-02' },
          { mood: 7, createdAt: '2026-04-03' },
          { mood: 5, createdAt: '2026-04-04' },
          { mood: 8, createdAt: '2026-04-05' },
          { mood: 6, createdAt: '2026-04-06' },
          { mood: 7, createdAt: '2026-04-07' },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const avg = moods.length
    ? (moods.reduce((s, m) => s + (m.mood || m.score || 0), 0) / moods.length).toFixed(1)
    : '—'

  const chartData = moods.map((m, i) => ({
    day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
    mood: m.mood || m.score || 0
  }))

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-60 flex-1 p-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">
              {greeting}, {name.split(' ')[0]} 🌿
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', year: 'numeric',
                month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/mood"
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-all hover:-translate-y-0.5">
              + Log mood
            </Link>
            <Link to="/journal"
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-all">
              ✏️ Write
            </Link>
          </div>
        </div>

        {/* Hero banner */}
        <div className="rounded-2xl p-8 mb-7 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #141e35 0%, #1e3a5f 60%, #0f4a3a 100%)'
          }}>
          <div className="absolute top-[-70px] right-[-50px] w-56 h-56 rounded-full bg-teal opacity-15" />
          <h2 className="text-teal-light text-2xl font-medium mb-2 relative z-10">
            How are you feeling today?
          </h2>
          <p className="text-white/55 text-sm mb-6 relative z-10">
            Your mental wellness journey is unique. Track, reflect, and grow.
          </p>
          <div className="flex gap-3 relative z-10">
            <Link to="/mood"
              className="px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-all">
              😊 Log today's mood
            </Link>
            <Link to="/chat"
              className="px-5 py-2.5 text-white/85 rounded-lg text-sm border border-white/20 hover:bg-white/10 transition-all">
              🤖 Talk to AI
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[
            { value: avg,           label: 'Avg mood this week', icon: '😊', color: 'bg-teal-pale' },
            { value: moods.length,  label: 'Moods logged',       icon: '📊', color: 'bg-amber-50'  },
            { value: '5🔥',         label: 'Day streak',         icon: '🔥', color: 'bg-red-50'    },
            { value: 'Joy',         label: 'Top emotion',        icon: '🧠', color: 'bg-purple-50' },
          ].map((s) => (
            <div key={s.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-sm transition-all">
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-xl`}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle grid */}
        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* Mood chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-sm font-medium text-gray-800">This week's mood</div>
                <div className="text-xs text-gray-500 mt-1">Daily score out of 10</div>
              </div>
              <Link to="/mood" className="text-xs text-teal hover:text-teal-dark">View all →</Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#3d8b75"
                    strokeWidth={2.5}
                    dot={{ fill: '#3d8b75', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* AI Companion card */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #141e35, #1e3a5f)' }}>
            <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-teal opacity-15" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-teal/30 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <div className="text-sm font-medium text-teal-light">AI Companion</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online · aware of your moods
                </div>
              </div>
            </div>
            <div className="bg-teal-light/10 border border-teal-light/15 rounded-xl p-3 mb-4 relative z-10">
              <p className="text-white/75 text-sm leading-relaxed italic">
                "I've noticed your mood has been improving this week.
                Would you like to talk about what's been going well?"
              </p>
            </div>
            <Link to="/chat"
              className="block w-full py-2.5 bg-teal text-white rounded-lg text-sm font-medium text-center hover:bg-teal-dark transition-all relative z-10">
              Open chat →
            </Link>
          </div>

        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-2 gap-5">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-800 mb-4">Quick actions</div>
            {[
              { to: '/mood',    icon: '😊', label: 'Log today\'s mood',   bg: 'bg-teal-pale'   },
              { to: '/journal', icon: '📓', label: 'Write journal entry', bg: 'bg-amber-50'    },
              { to: '/report',  icon: '📊', label: 'View wellness report',bg: 'bg-purple-50'   },
              { to: '/clinics', icon: '🏥', label: 'Find nearby clinics', bg: 'bg-blue-50'     },
            ].map((item) => (
              <Link key={item.to} to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 mb-2 hover:border-teal hover:bg-teal-pale transition-all group">
                <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center text-base`}>
                  {item.icon}
                </div>
                <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                <span className="ml-auto text-gray-400 text-xs group-hover:text-teal">→</span>
              </Link>
            ))}
          </div>

          {/* Daily wellness tip */}
          <div className="rounded-2xl p-6 border"
            style={{ background: 'linear-gradient(135deg, #e1f5ee, #d4ede4)', borderColor: 'rgba(61,139,117,0.15)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center text-lg">
                🌿
              </div>
              <div>
                <div className="text-sm font-medium text-teal-dark">Daily wellness tip</div>
                <div className="text-xs text-teal">Refreshes every day</div>
              </div>
            </div>
            <p className="text-sm text-teal-dark leading-relaxed italic mb-5">
              "{tip}"
            </p>
            <div className="bg-teal/10 rounded-xl p-4">
              <div className="text-xs font-medium text-teal-dark mb-2">🧘 Quick breathing exercise</div>
              <p className="text-xs text-teal leading-relaxed">
                Inhale for <strong>4 seconds</strong> → Hold for <strong>7 seconds</strong>
                → Exhale for <strong>8 seconds</strong>. Repeat 3 times.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}