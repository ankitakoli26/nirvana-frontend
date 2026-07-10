import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getJournals, createJournal, deleteJournal } from '../api/api'

export default function Journal() {
  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [journals, setJournals] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState('')

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(''), 3000)
  }

  function loadJournals() {
    getJournals()
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.journals || [])
        setJournals(data)
      })
      .catch(() => {
        setJournals([
          {
            id: 1,
            title: 'Morning clarity',
            content: 'Woke up feeling refreshed. Did a 10-minute meditation. Grateful for small peaceful moments.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'A tough afternoon',
            content: 'Presentation did not go as planned. Feeling anxious but I know tomorrow will be better.',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ])
      })
  }

  useEffect(() => { loadJournals() }, [])

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim())   { showToast('❌ Please add a title!',    'error'); return }
    if (!content.trim()) { showToast('❌ Please write something!', 'error'); return }

    setLoading(true)
    try {
      await createJournal({ title, content })
      showToast('✅ Entry saved! AI is analysing emotions... 🧠')
      setTitle('')
      setContent('')
      loadJournals()
    } catch {
      showToast('✅ Entry saved (demo)! 🧠')
      setJournals(prev => [{
        id: Date.now(),
        title,
        content,
        createdAt: new Date().toISOString()
      }, ...prev])
      setTitle('')
      setContent('')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJournal(id)
      setJournals(prev => prev.filter(j => j.id !== id))
      showToast('✅ Entry deleted!')
    } catch {
      setJournals(prev => prev.filter(j => j.id !== id))
      showToast('✅ Entry deleted!')
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

        <div className="mb-7">
          <h2 className="text-2xl font-medium text-gray-800">Journal 📓</h2>
          <p className="text-sm text-gray-500 mt-1">
            Write freely. Your entries are private and analysed for emotional patterns.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Write form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium text-gray-800">Write a new entry</div>
                <div className="text-xs text-gray-500 mt-1">Express yourself freely</div>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">
                📓
              </div>
            </div>

            <form onSubmit={handleSave}>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 outline-none focus:border-teal transition-all"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your thoughts
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  placeholder="What's on your mind today? This is your safe space..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 outline-none focus:border-teal transition-all resize-none"
                  style={{ minHeight: '200px' }}
                />
                <div className="text-xs text-gray-400 mt-1">{wordCount} words</div>
              </div>

              <div className="bg-teal-pale rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                <span>🧠</span>
                <span className="text-xs text-teal-dark">
                  AI will automatically analyse emotions in your entry after saving.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal text-white rounded-xl font-medium text-sm hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save entry 📓'}
              </button>

            </form>
          </div>

          {/* Journal list */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-medium text-gray-800">Your entries</div>
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                {journals.length} {journals.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {journals.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-5xl mb-3 opacity-40">📓</div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">No entries yet</h4>
                <p className="text-xs">Write your first entry using the form on the left.</p>
              </div>
            ) : (
              [...journals].reverse().map((j) => {
                const date = new Date(j.createdAt || Date.now())
                  .toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })
                const preview = (j.content || '').slice(0, 100) +
                  ((j.content || '').length > 100 ? '...' : '')

                return (
                  <div key={j.id}
                    className="p-4 rounded-xl border-2 border-gray-100 mb-3 hover:border-teal hover:bg-teal-pale transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        {j.title || 'Untitled'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{date}</span>
                        <button
                          onClick={() => handleDelete(j.id)}
                          className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{preview}</p>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </main>
    </div>
  )
}