import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const patientNav = [
  { to: '/patient/dashboard', icon: '🏠', label: 'Dashboard'       },
  { to: '/patient/mood',      icon: '😊', label: 'Mood Tracker'    },
  { to: '/patient/journal',   icon: '📓', label: 'Journal'         },
  { to: '/patient/chat',      icon: '🤖', label: 'AI Companion'    },
  { to: '/patient/wellness',  icon: '📊', label: 'Wellness Report' },
  { to: '/patient/clinics',   icon: '🏥', label: 'Find Clinics'    },
  { to: '/patient/consent',   icon: '🤝', label: 'My Doctors'      },
]

const doctorNav = [
  { to: '/doctor/dashboard', icon: '🏠', label: 'Dashboard'     },
]

export default function Sidebar() {
  const { user, role, logout } = useAuthStore()
  const navigate               = useNavigate()

  const name     = user?.name || user?.username || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const navItems = role === 'DOCTOR' ? doctorNav : patientNav

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 bg-navy min-h-screen fixed top-0 left-0 flex flex-col z-50 overflow-hidden">

      {/* Decorative circle */}
      <div className="absolute bottom-[-80px] right-[-80px] w-48 h-48 rounded-full bg-teal opacity-10 pointer-events-none" />

      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b border-white/5">
        <span className="block text-teal-light text-2xl font-serif tracking-wide">
          Nirvana
        </span>
        <span className="block text-xs text-teal-light/40 mt-1 tracking-widest uppercase">
          {role === 'DOCTOR' ? 'Doctor Portal' : 'Wellness'}
        </span>
      </div>

      {/* User info */}
      <div className="mx-3 mt-4 flex items-center gap-3 bg-white/4 border border-white/5 rounded-xl px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-teal-dark flex items-center justify-center text-teal-light text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-medium text-white/85 truncate">{name}</div>
          <div className="text-xs text-teal-light/60">
            {role === 'DOCTOR' ? '🩺 Doctor' : '✦ Wellness member'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">

        {role === 'PATIENT' && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-2">
              Main
            </div>

            {patientNav.slice(0, 3).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-[10px] rounded-lg text-sm mb-0.5 transition-all
                   ${isActive
                     ? 'bg-teal/20 text-teal-light font-medium border-l-[3px] border-teal'
                     : 'text-white/45 hover:bg-white/6 hover:text-white/85'
                   }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}

            <div className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-2 mt-4">
              AI Features
            </div>

            {patientNav.slice(3, 5).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-[10px] rounded-lg text-sm mb-0.5 transition-all
                   ${isActive
                     ? 'bg-teal/20 text-teal-light font-medium border-l-[3px] border-teal'
                     : 'text-white/45 hover:bg-white/6 hover:text-white/85'
                   }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}

            <div className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-2 mt-4">
              Help
            </div>

            {patientNav.slice(5).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-[10px] rounded-lg text-sm mb-0.5 transition-all
                   ${isActive
                     ? 'bg-teal/20 text-teal-light font-medium border-l-[3px] border-teal'
                     : 'text-white/45 hover:bg-white/6 hover:text-white/85'
                   }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}

        {role === 'DOCTOR' && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-2">
              Doctor Portal
            </div>

            {doctorNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-[10px] rounded-lg text-sm mb-0.5 transition-all
                   ${isActive
                     ? 'bg-teal/20 text-teal-light font-medium border-l-[3px] border-teal'
                     : 'text-white/45 hover:bg-white/6 hover:text-white/85'
                   }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}

      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-[10px] rounded-lg text-sm text-white/45 hover:bg-white/6 hover:text-white/85 transition-all w-full"
        >
          <span className="w-5 text-center">🚪</span>
          Log out
        </button>
      </div>

    </aside>
  )
}