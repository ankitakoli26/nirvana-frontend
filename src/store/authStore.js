import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('nirvana_token') || null,
  user:  JSON.parse(localStorage.getItem('nirvana_user') || 'null'),

  setAuth: (token, user) => {
    localStorage.setItem('nirvana_token', token)
    localStorage.setItem('nirvana_user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('nirvana_token')
    localStorage.removeItem('nirvana_user')
    set({ token: null, user: null })
  }
}))

export default useAuthStore