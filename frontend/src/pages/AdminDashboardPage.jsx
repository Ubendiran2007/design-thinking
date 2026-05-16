import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import { 
  Search, RefreshCcw, FileDown, ChevronLeft, ChevronRight, Filter, 
  CheckCircle2, Clock, AlertCircle, TrendingUp, Users as UsersIcon, Mail, Shield as ShieldIcon, Calendar
} from 'lucide-react'
import { toast } from 'react-toastify'

import AdminSidebar from '../components/AdminSidebar'
import ComplaintTable from '../components/ComplaintTable'
import Loader from '../components/Loader'
import { getAllComplaints, updateComplaint, getAllUsers, updateUser } from '../services/api'
import { useAuth } from '../context/useAuth'
import { exportToCSV } from '../utils/csvExport'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']
const ITEMS_PER_PAGE = 8

function AdminDashboardPage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentView = searchParams.get('view') || 'complaints'

  const [complaints, setComplaints] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  
  // UI State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Auth Protection
  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'admin') {
      toast.error('Access denied. Admin authorization required.')
      navigate('/login')
    }
  }, [auth, navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [complaintsData, usersData] = await Promise.all([
        getAllComplaints(),
        getAllUsers().catch(() => []) // Fallback in case route fails
      ])
      setComplaints(complaintsData)
      setUsers(usersData)
    } catch (err) {
      toast.error('Failed to sync data with central server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Complaints Logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.complaintId?.toLowerCase().includes(search.toLowerCase()) || 
                            c.title?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || c.status === statusFilter
      const matchesCategory = !categoryFilter || c.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [complaints, search, statusFilter, categoryFilter])

  // Users Logic
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredComplaints.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredComplaints, currentPage])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const totalPages = currentView === 'complaints' 
    ? Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE)
    : Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)

  // Analytics Metrics
  const metrics = useMemo(() => {
    const total = complaints.length
    const resolved = complaints.filter(c => c.status === 'Resolved').length
    const pending = total - resolved
    return { total, resolved, pending, usersTotal: users.length }
  }, [complaints, users])

  const chartData = useMemo(() => {
    const categories = complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1
      return acc
    }, {})
    return Object.keys(categories).map(name => ({ name, value: categories[name] }))
  }, [complaints])

  const handleUpdate = async (id, field, value) => {
    setUpdatingId(id)
    try {
      await updateComplaint(id, { [field]: value })
      setComplaints(prev => prev.map(c => (c.complaintId === id || c._id === id) ? { ...c, [field]: value } : c))
      toast.success(`Complaint updated successfully`)
    } catch (err) {
      toast.error('Global sync failed. Please check connection.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSubTaskUpdate = async (id, subTasks) => {
    setUpdatingId(id)
    try {
      await updateComplaint(id, { subTasks })
      setComplaints(prev => prev.map(c => (c.complaintId === id || c._id === id) ? { ...c, subTasks } : c))
      toast.success('Department assignments synchronized')
    } catch (err) {
      toast.error('Failed to update task splits')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUserUpdate = async (userId, field, value) => {
    setUpdatingId(userId)
    try {
      await updateUser(userId, { [field]: value })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, [field]: value } : u))
      toast.success('User updated successfully')
    } catch (err) {
      toast.error('Failed to update user status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading && complaints.length === 0) return <Loader text="Synchronizing secure admin environment..." />

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row g-4">
        <div className="col-lg-2">
          <AdminSidebar />
        </div>

        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-black mb-1">
                {currentView === 'users' ? 'Registered People (Users)' : 'Grievance Intelligence Dashboard'}
              </h3>
              <p className="text-muted small mb-0">Logged in as <span className="fw-bold text-primary">{auth.name} (Administrator)</span></p>
            </div>
            <div className="d-flex gap-2">
              {currentView === 'complaints' && (
                <button onClick={() => exportToCSV(complaints)} className="btn btn-white shadow-sm d-flex align-items-center gap-2 rounded-pill px-4 border border-primary text-primary hover-bg-primary hover-text-white transition-all">
                  <FileDown size={18} /> Export CSV
                </button>
              )}
              <button onClick={fetchData} className="btn btn-primary shadow-sm d-flex align-items-center gap-2 rounded-pill px-4">
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> Sync Data
              </button>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {[
              { label: 'Total Grievances', value: metrics.total, icon: TrendingUp, color: 'text-primary' },
              { label: 'Active Users', value: metrics.usersTotal, icon: UsersIcon, color: 'text-success' },
              { label: 'Pending Actions', value: metrics.pending, icon: AlertCircle, color: 'text-danger' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="col-md-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 border-start border-5 border-opacity-25" style={{ borderColor: 'currentColor' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted small uppercase fw-bold tracking-wider mb-2">{stat.label}</h6>
                      <h2 className="fw-black mb-0">{stat.value}</h2>
                    </div>
                    <div className={`${stat.color} bg-light p-3 rounded-4`}>
                      <stat.icon size={32} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {currentView === 'analytics' && (
            <div className="row g-4 mb-4">
              <div className="col-xl-8">
                <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                  <h6 className="fw-bold mb-4">Activity Distribution</h6>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
                        <YAxis axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                  <h6 className="fw-bold mb-4">Urgency Profile</h6>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={chartData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                          {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-4 border-bottom">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted"><Search size={18} /></span>
                    <input 
                      className="form-control border-start-0 ps-0" 
                      placeholder={currentView === 'users' ? "Search users by name or email..." : "Search grievance ID or title..."} 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                    />
                  </div>
                </div>
                {currentView === 'complaints' && (
                  <>
                    <div className="col-md-3">
                      <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Submitted">Submitted (Pending)</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        {['Infrastructure', 'Water Supply', 'Sanitation', 'Public Safety', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {currentView === 'users' ? (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">Name</th>
                      <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Email</th>
                      <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Role</th>
                      <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Department</th>
                      <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Member Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user._id} className={updatingId === user._id ? 'opacity-50' : ''}>
                        <td className="px-4">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                              <UsersIcon size={16} />
                            </div>
                            <span className="fw-bold small">{user.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 text-muted small">
                            <Mail size={14} /> {user.email}
                          </div>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button className={`btn btn-xs rounded-pill px-3 py-1 dropdown-toggle d-flex align-items-center gap-1 ${user.role === 'admin' ? 'btn-danger text-white' : user.role === 'department' ? 'btn-info text-white' : 'btn-success text-white'}`} data-bs-toggle="dropdown">
                              {user.role}
                            </button>
                            <ul className="dropdown-menu shadow border-0">
                              {['user', 'admin', 'department'].map(r => (
                                <li key={r}><button className="dropdown-item small" onClick={() => handleUserUpdate(user._id, 'role', r)}>{r}</button></li>
                              ))}
                            </ul>
                          </div>
                        </td>
                        <td>
                          {user.role === 'department' ? (
                            <div className="dropdown">
                              <button className="btn btn-xs btn-white border dropdown-toggle rounded-pill px-3" data-bs-toggle="dropdown">
                                {user.department || 'Assign Dept'}
                              </button>
                              <ul className="dropdown-menu shadow border-0">
                                {['Water Department', 'Electricity Board', 'Road Maintenance', 'Sanitation', 'Public Safety'].map(d => (
                                  <li key={d}><button className="dropdown-item small" onClick={() => handleUserUpdate(user._id, 'department', d)}>{d}</button></li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <span className="text-muted extra-small">N/A</span>
                          )}
                        </td>
                        <td className="text-muted small">
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ComplaintTable 
                complaints={paginatedComplaints} 
                onUpdate={handleUpdate} 
                onSubTaskUpdate={handleSubTaskUpdate} 
                updatingId={updatingId} 
              />
            )}

            <div className="p-4 border-top d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="small text-muted">
                Showing {currentView === 'users' ? paginatedUsers.length : paginatedComplaints.length} of {currentView === 'users' ? filteredUsers.length : filteredComplaints.length} records
              </div>
              <div className="d-flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: '32px', height: '32px' }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                    style={{ width: '32px', height: '32px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: '32px', height: '32px' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
