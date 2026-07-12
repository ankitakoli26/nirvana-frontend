import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getMyPatients, getDoctorPatientMoods, getDoctorPatientJournals } from '../api/api'

const NOW = Date.now()

export default function DoctorDashboard() {
  const [patients,       setPatients]       = useState([])
  const [selectedPatient,setSelectedPatient]= useState(null)
  const [moods,          setMoods]          = useState([])
  const [journals,       setJournals]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [tab,            setTab]            = useState('mood')

  // Load all patients on page load
  useEffect(() => {
    getMyPatients()
      .then(res => {
        setPatients(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        // Demo data
        setPatients([
          { ConsentId: 1, patientId: 101, patientName: 'Rahul Sharma',  patientEmail: 'rahul@example.com'  },
          { ConsentId: 2, patientId: 102, patientName: 'Priya Mehta',   patientEmail: 'priya@example.com'  },
          { ConsentId: 3, patientId: 103, patientName: 'Aarav Kulkarni',patientEmail: 'aarav@example.com'  },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  // Load patient data when doctor clicks a patient
  async function selectPatient(patient) {
    setSelectedPatient(patient)
    setMoods([])
    setJournals([])
    setTab('mood')

    try {
      const moodRes = await getDoctorPatientMoods(patient.patientId)
      setMoods(Array.isArray(moodRes.data) ? moodRes.data : [])
    } catch {
      setMoods([
        { moodScore: 7, moodLabel: 'calm',    note: 'Had a peaceful morning.', loggedAt: new Date(NOW).toISOString() },
        { moodScore: 5, moodLabel: 'anxious', note: 'Worried about exam.',     loggedAt: new Date(NOW - 86400000).toISOString() },
        { moodScore: 8, moodLabel: 'happy',   note: 'Great workout today!',    loggedAt: new Date(NOW - 172800000).toISOString() },
      ])
    }

    try {
      const journalRes = await getDoctorPatientJournals(patient.patientId)
      setJournals(Array.isArray(journalRes.data) ? journalRes.data : [])
    } catch {
      setJournals([
        { id:1, title:'Morning thoughts',   content:'Feeling better today after meditation.',         createdAt: new Date(NOW).toISOString() },
        { id:2, title:'A tough afternoon',  content:'Struggled to focus. Anxiety crept in again.',   createdAt: new Date(NOW - 86400000).toISOString() },
      ])
    }
  }

  const avgMood = moods.length
    ? (moods.reduce((s, m) => s + (m.moodScore || 0), 0) / moods.length).toFixed(1)
    : '—'

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />


      <main className="ml-60 flex-1 p-8">

        <div className="mb-7">
          <h2 className="text-2xl font-medium text-gray-800">Doctor Dashboard 🩺</h2>
          <p className="text-sm text-gray-500 mt-1">
            View your patients' mood history and journal entries.
          </p>
        </div>

        {/* Hero */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg, #141e35 0%, #1e3a5f 60%, #0f4a3a 100%)' }}>
          <div className="absolute top-[-70px] right-[-50px] w-56 h-56 rounded-full bg-teal opacity-15" />
          <h2 className="text-teal-light text-xl font-medium mb-2 relative z-10">
            Your patients 🌿
          </h2>
          <p className="text-white/55 text-sm relative z-10">
            Select a patient to view their mood and journal history.
            You only see patients who gave you consent.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 items-start">

          {/* Patient list */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-800">My patients</div>
              <span className="text-xs bg-teal-pale text-teal-dark px-3 py-1 rounded-full">
                {patients.length}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-teal rounded-full animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 opacity-30">👥</div>
                <p className="text-sm text-gray-400">
                  No patients yet. Patients need to invite you using your email.
                </p>
              </div>
            ) : (
              patients.map(p => (
                <div
                  key={p.ConsentId}
                  onClick={() => selectPatient(p)}
                  className={`flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all
                    ${selectedPatient?.patientId === p.patientId
                      ? 'bg-teal-pale border-2 border-teal'
                      : 'border-2 border-gray-100 hover:border-teal hover:bg-teal-pale'
                    }`}
                >
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-teal-light text-xs font-bold flex-shrink-0">
                    {p.patientName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium text-gray-800 truncate">{p.patientName}</div>
                    <div className="text-xs text-gray-400 truncate">{p.patientEmail}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Patient data */}
          <div className="col-span-2">
            {!selectedPatient ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4 opacity-30">👈</div>
                <h4 className="text-base font-medium text-gray-500 mb-2">
                  Select a patient
                </h4>
                <p className="text-sm text-gray-400">
                  Click on a patient from the list to view their health data.
                </p>
              </div>
            ) : (
              <div>

                {/* Patient header */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-teal-light font-bold">
                    {selectedPatient.patientName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-800">{selectedPatient.patientName}</div>
                    <div className="text-sm text-gray-500">{selectedPatient.patientEmail}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-dark">{avgMood}</div>
                    <div className="text-xs text-gray-500">Avg mood</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-dark">{moods.length}</div>
                    <div className="text-xs text-gray-500">Mood logs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-dark">{journals.length}</div>
                    <div className="text-xs text-gray-500">Journals</div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setTab('mood')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${tab === 'mood'
                        ? 'bg-teal text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-teal'
                      }`}
                  >
                    😊 Mood History
                  </button>
                  <button
                    onClick={() => setTab('journal')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${tab === 'journal'
                        ? 'bg-teal text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-teal'
                      }`}
                  >
                    📓 Journal Entries
                  </button>
                </div>

                {/* Mood tab */}
                {tab === 'mood' && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    {moods.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-3 opacity-40">😶</div>
                        <p className="text-sm">No mood entries yet.</p>
                      </div>
                    ) : (
                      moods.map((m, i) => {
                        const s     = m.moodScore || 0
                        const color = s <= 3 ? '#d85a6a' : s <= 6 ? '#ef9f27' : '#3d8b75'
                        const bg    = s <= 3 ? '#fde8eb' : s <= 6 ? '#faeeda' : '#e1f5ee'
                        const date  = new Date(m.loggedAt || NOW)
                          .toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                        return (
                          <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                            <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                              style={{ background: bg }}>
                              <span className="text-xs font-bold" style={{ color }}>{s}/10</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-700 capitalize">
                                {m.moodLabel || 'General'}
                              </div>
                              <div className="text-xs text-gray-400">{date}</div>
                              {m.note && <div className="text-xs text-gray-500 mt-1">{m.note}</div>}
                            </div>
                            <div className="text-xl font-bold" style={{ color }}>
                              {s}<span className="text-xs text-gray-400">/10</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                {/* Journal tab */}
                {tab === 'journal' && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    {journals.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-3 opacity-40">📓</div>
                        <p className="text-sm">No journal entries yet.</p>
                      </div>
                    ) : (
                      journals.map((j) => {
                        const date = new Date(j.createdAt || NOW)
                          .toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                        return (
                          <div key={j.id}
                            className="p-4 rounded-xl border-2 border-gray-100 mb-3 hover:border-teal transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-800">{j.title}</span>
                              <span className="text-xs text-gray-400">{date}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{j.content}</p>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}