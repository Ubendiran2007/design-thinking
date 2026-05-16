import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://design-thinking-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 35000, // Render free tier cold starts can take ~30s
})

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('pgts-auth'))
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

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
  const { data } = await api.get('/complaints/stats') 
  return data
}

export async function getAllUsers() {
  const { data } = await api.get('/users')
  return data
}

export async function updateUser(id, updates) {
  const { data } = await api.patch(`/users/${id}`, updates)
  return data
}

export async function getDepartmentComplaints(deptName) {
  const { data } = await api.get(`/complaints/dept/${deptName}`)
  return data
}

export default api
