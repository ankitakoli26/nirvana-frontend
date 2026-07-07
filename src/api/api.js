import axios from 'axios'
import useAuthStore from '../store/authStore'

const API = axios.create({
  baseURL: 'http://localhost:8080'
})

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If token expired (401) → logout and go to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── AUTH ──
// Register → sends plain text JWT back
export const registerUser = (data) =>
  API.post('/auth/register', data, { responseType: 'text' })

// Login → sends plain text JWT back
export const loginUser = (data) =>
  API.post('/auth/login', data, { responseType: 'text' })

// ── MOOD ──
// Note: backend uses capital field names!
export const logMood = (data) =>
  API.post('/mood', {
    MoodLabel: data.label,
    MoodScore: data.score,
    Note:      data.note || '',
    LoggedAt:  new Date().toISOString().slice(0, 19)
  })

export const getMoodHistory = () => API.get('/mood/history')

export const deleteMood = (id) => API.delete(`/mood/${id}`)

export const getMoodRange = (from, to) =>
  API.get(`/mood/range?from=${from}&to=${to}`)

// Doctor viewing patient moods
export const getDoctorPatientMoods = (patientId) =>
  API.get(`/mood/doctor/${patientId}/history`)

// ── JOURNAL ──
// Note: backend path is /journal/journal not just /journal
export const createJournal = (data) =>
  API.post('/journal/journal', data)

export const getJournals = () =>
  API.get('/journal/journal/history')

export const deleteJournal = (id) =>
  API.delete(`/journal/${id}`)

// Doctor viewing patient journals
export const getDoctorPatientJournals = (patientId) =>
  API.get(`/journal/doctor/${patientId}/history`)

// ── CHATBOT ──
// Backend returns { message, role, sentAt } not { reply }
export const sendMessage = (data) =>
  API.post('/chatbot', { message: data.message })

export const getChatHistory = () =>
  API.get('/chatbot/history')

// ── WELLNESS REPORT ──
// Note: endpoint is /wellness/report not /report/weekly
export const getWellnessReport = () =>
  API.get('/wellness/report')

// ── CONSENT ──
export const inviteDoctor = (doctorEmail) =>
  API.post('/consent/invite', { doctorEmail })

export const revokeConsent = (consentId) =>
  API.post(`/consent/${consentId}/revoke`)

export const getMyDoctors = () =>
  API.get('/consent/patient/my-doctors')

export const getMyPatients = () =>
  API.get('/consent/doctor/my-patients')

export default API