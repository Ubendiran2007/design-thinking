import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Optional: Add a request interceptor to include the JWT token if available
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('pgts-auth'))
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export async function loginUser(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function submitComplaint(payload) {
  const { data } = await api.post('/complaints', payload)
  return data
}

export async function getComplaintById(id) {
  const { data } = await api.get(`/complaints/${id}`)
  return data
}

export async function getUserComplaints(email) {
  const { data } = await api.get(`/complaints/user/${email}`)
  return data
}

export async function getAllComplaints(filters = {}) {
  const { data } = await api.get('/complaints', { params: filters })
  return data
}

export async function updateComplaint(id, updates) {
  const { data } = await api.patch(`/complaints/${id}`, updates)
  return data
}

export async function getTransparencyStats() {
  const { data } = await api.get('/stats')
  return data
}

export default api

