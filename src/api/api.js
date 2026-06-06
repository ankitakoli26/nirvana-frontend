import axios from 'axios'
import useAuthStore from '../store/authStore'

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
})

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const loginUser    = (data) => API.post('/auth/login', data)
export const registerUser = (data) => API.post('/auth/register', data)

// Mood
export const logMood        = (data) => API.post('/mood', data)
export const getMoodHistory = ()     => API.get('/mood/history')

// Journal
export const getJournals   = ()     => API.get('/journal')
export const createJournal = (data) => API.post('/journal', data)
export const deleteJournal = (id)   => API.delete(`/journal/${id}`)

// Chat
export const sendMessage = (data) => API.post('/chatbot', data)

// Report
export const generateReport = () => API.get('/report/weekly')

export default API