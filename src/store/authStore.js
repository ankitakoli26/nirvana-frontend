import { create } from 'zustand'

// This function reads the JWT token and extracts info from it
// JWT has 3 parts separated by dots — we read the middle part
function decodeToken(token) {
  try {
    const base64 = token.split('.')[1]
    const decoded = JSON.parse(atob(base64))
    return decoded
  } catch {
    return null
  }
}

const useAuthStore = create((set) => ({
  token: localStorage.getItem('nirvana_token') || null,
  user:  JSON.parse(localStorage.getItem('nirvana_user') || 'null'),
  role:  localStorage.getItem('nirvana_role') || null,

  setAuth: (token) => {
    // Decode the JWT to get name, email and role
    const decoded = decodeToken(token)
    const user = {
      name:  decoded?.username || decoded?.name || decoded?.sub?.split('@')[0] || 'User',
      email: decoded?.sub || ''
    }
    const role = decoded?.role || 'PATIENT'

    localStorage.setItem('nirvana_token', token)
    localStorage.setItem('nirvana_user', JSON.stringify(user))
    localStorage.setItem('nirvana_role', role)

    set({ token, user, role })
  },

  logout: () => {
    localStorage.removeItem('nirvana_token')
    localStorage.removeItem('nirvana_user')
    localStorage.removeItem('nirvana_role')
    set({ token: null, user: null, role: null })
  }
}))

export default useAuthStore