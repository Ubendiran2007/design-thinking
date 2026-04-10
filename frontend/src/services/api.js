import axios from 'axios'

const api = axios.create({
  baseURL: 'https://example.gov/api',
  timeout: 5000,
})

const COMPLAINTS_KEY = 'pgts-complaints'

const seedComplaints = [
  {
    id: 'GRV-1001',
    title: 'Streetlight not functioning',
    description: 'Streetlight near block A has not been working for 2 weeks.',
    category: 'Infrastructure',
    location: 'Ward 12, Sector 4',
    status: 'Under Review',
    department: 'Public Works',
    createdAt: '2026-03-20',
    userEmail: 'citizen@example.com',
  },
  {
    id: 'GRV-1002',
    title: 'Irregular water supply',
    description: 'Water supply is unavailable between 6-9 AM.',
    category: 'Water Supply',
    location: 'Ward 8, Green Colony',
    status: 'In Progress',
    department: 'Water Department',
    createdAt: '2026-03-28',
    userEmail: 'citizen@example.com',
  },
  {
    id: 'GRV-1003',
    title: 'Garbage not collected',
    description: 'Garbage has accumulated for several days in lane 5.',
    category: 'Sanitation',
    location: 'Ward 5, Lake View',
    status: 'Resolved',
    department: 'Sanitation',
    createdAt: '2026-04-02',
    userEmail: 'resident@demo.com',
  },
]

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

function getComplaints() {
  const saved = localStorage.getItem(COMPLAINTS_KEY)
  if (!saved) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(seedComplaints))
    return [...seedComplaints]
  }
  return JSON.parse(saved)
}

function setComplaints(complaints) {
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints))
}

export async function loginUser(payload) {
  await wait()
  const role = payload.email.includes('admin') ? 'admin' : 'user'
  return { name: payload.email.split('@')[0], email: payload.email, role }
}

export async function registerUser(payload) {
  await wait()
  return { message: `Welcome ${payload.name}, your account is ready.` }
}

export async function submitComplaint(payload) {
  await wait()
  const complaints = getComplaints()
  const complaint = {
    id: `GRV-${1000 + complaints.length + 1}`,
    status: 'Submitted',
    department: 'Pending Assignment',
    createdAt: new Date().toISOString().slice(0, 10),
    ...payload,
  }
  const updated = [complaint, ...complaints]
  setComplaints(updated)
  return complaint
}

export async function getComplaintById(id) {
  await wait()
  const complaints = getComplaints()
  return complaints.find((item) => item.id.toLowerCase() === id.toLowerCase()) || null
}

export async function getUserComplaints(email) {
  await wait()
  return getComplaints().filter((item) => item.userEmail === email)
}

export async function getAllComplaints(filters = {}) {
  await wait()
  let data = getComplaints()
  if (filters.status) data = data.filter((item) => item.status === filters.status)
  if (filters.category) data = data.filter((item) => item.category === filters.category)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    data = data.filter((item) => item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q))
  }
  return data
}

export async function updateComplaint(id, updates) {
  await wait()
  const complaints = getComplaints()
  const updated = complaints.map((item) => (item.id === id ? { ...item, ...updates } : item))
  setComplaints(updated)
  return updated.find((item) => item.id === id)
}

export async function getTransparencyStats() {
  await wait()
  const complaints = getComplaints()
  const total = complaints.length
  const resolved = complaints.filter((item) => item.status === 'Resolved').length
  const pending = total - resolved
  const categoryMap = complaints.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})
  const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  return {
    total,
    resolved,
    pending,
    categoryDistribution,
    monthlyTrend: [
      { month: 'Jan', complaints: 12 },
      { month: 'Feb', complaints: 18 },
      { month: 'Mar', complaints: 22 },
      { month: 'Apr', complaints: 29 },
    ],
  }
}

export default api
