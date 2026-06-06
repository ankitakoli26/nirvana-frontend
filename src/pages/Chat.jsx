import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import CrisisAlert from '../components/CrisisAlert'
import { sendMessage } from '../api/api'
import useAuthStore from '../store/authStore'

const suggestions = [
  "I've been feeling anxious",
  "Help me calm down",
  "I need some motivation",
  "Give me a breathing exercise",
]

const demoReplies = [
  "I hear you. That sounds like a lot to carry. Can you tell me more about what's been making you feel this way?",
  "It's okay to feel that way. Every emotion is valid and temporary.\n\n**Try the 4-7-8 breathing technique:**\n- Inhale for **4 seconds**\n- Hold for **7 seconds**\n- Exhale for **8 seconds**\n\nRepeat 3 times. 🌿",
  "Thank you for sharing that with me. What's **one small thing** that usually brings you comfort?",
  "I'm really glad you're talking about this. What feels most heavy on your heart right now?",
  "You're doing **better than you think**. The fact that you're here shows real self-awareness. 💚",
]

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,     '<em>$1</em>')
    .replace(/^- (.*?)$/gm,    '<li>$1</li>')
    .replace(/\n/g,            '<br/>')
}

export default function Chat() {
  const { user }                  = useAuthStore()
  const [messages,   setMessages] = useState([])
  const [input,      setInput]    = useState('')
  const [loading,    setLoading]  = useState(false)
  const [showSugg,   setShowSugg] = useState(true)
  const [crisis,     setCrisis]   = useState(false)
  const bottomRef                 = useRef(null)

  const name     = user?.name || 'Friend'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    setShowSugg(false)
    setInput('')

    const userMsg = { role: 'user', text, time: getTime() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res  = await sendMessage({ message: text })
      const data = res.data
      const reply = data.reply || data.message || data.response || 'I hear you. Tell me more.'

      if (data.crisis) setCrisis(true)

      setMessages(prev => [...prev, { role: 'ai', text: reply, time: getTime() }])
    } catch {
      const reply = demoReplies[messages.length % demoReplies.length]
      setMessages(prev => [...prev, { role: 'ai', text: reply, time: getTime() }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function clearChat() {
    setMessages([])
    setShowSugg(true)
    setCrisis(false)
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      <main className="ml-60 flex-1 flex flex-col h-screen">

        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">Nirvana AI Companion</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Online — powered by Gemini AI
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs hover:bg-gray-50 transition-all"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">

          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-sm flex-shrink-0">
                🤖
              </div>
              <div>
                <div className="bg-teal-pale text-teal-dark px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                  Hi {name.split(' ')[0]}! I'm your Nirvana AI Companion, powered by Gemini. 🌿
                  <br /><br />
                  I'm here to listen and support you. How are you feeling today?
                </div>
                <div className="text-xs text-gray-400 mt-1">{getTime()}</div>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse max-w-xl ml-auto' : 'max-w-xl'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                ${msg.role === 'user' ? 'bg-teal-dark text-teal-light' : 'bg-navy text-white'}`}>
                {msg.role === 'user' ? initials : '🤖'}
              </div>
              <div>
                <div
                  className={`px-4 py-3 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-navy text-white/90 rounded-2xl rounded-tr-sm'
                      : 'bg-teal-pale text-teal-dark rounded-2xl rounded-tl-sm'
                    }`}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
                <div className={`text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-sm flex-shrink-0">
                🤖
              </div>
              <div className="bg-teal-pale px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <div key={i}
                    className="w-2 h-2 rounded-full bg-teal"
                    style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Crisis alert */}
          {crisis && <CrisisAlert />}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {showSugg && (
          <div className="px-8 pb-3 flex gap-2 flex-wrap flex-shrink-0">
            {suggestions.map(s => (
              <button key={s}
                onClick={() => { setInput(s); setShowSugg(false) }}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-xs hover:border-teal hover:bg-teal-pale hover:text-teal-dark transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-8 py-4 bg-white border-t border-gray-100 flex gap-3 items-end flex-shrink-0">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Type your message... (Enter to send)"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 outline-none focus:border-teal transition-all resize-none bg-cream"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full bg-teal text-white flex items-center justify-center text-lg hover:bg-teal-dark transition-all hover:scale-105 disabled:opacity-50 flex-shrink-0"
          >
            ➤
          </button>
        </div>

      </main>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}