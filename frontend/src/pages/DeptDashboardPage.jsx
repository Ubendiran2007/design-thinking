import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, CheckCircle2, Clock, AlertCircle, RefreshCcw, Search, 
  Layout, FileText, CheckSquare, Droplets, Zap, Construction, PlayCircle, Filter
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'
import { getDepartmentComplaints, updateComplaint } from '../services/api'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'

const DEPT_CONFIG = {
  'Water Department': { color: 'primary', icon: Droplets, theme: 'blue' },
  'Electricity Board': { color: 'warning', icon: Zap, theme: 'yellow' },
  'Road Maintenance': { color: 'secondary', icon: Construction, theme: 'gray' },
  'Sanitation': { color: 'success', icon: Briefcase, theme: 'green' },
  'Public Safety': { color: 'danger', icon: Briefcase, theme: 'red' }
}

function DeptDashboardPage() {
  const { auth } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const dept = DEPT_CONFIG[auth.department] || { color: 'primary', icon: Briefcase, theme: 'blue' }
  const DeptIcon = dept.icon

  const fetchDeptTasks = async () => {
    if (!auth.department) return
    setLoading(true)
    try {
      const data = await getDepartmentComplaints(auth.department)
      setComplaints(data)
    } catch (err) {
      toast.error('Failed to sync department backlog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeptTasks()
  }, [auth.department])

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateComplaint(id, { status: newStatus })
      toast.success(`Grievance status updated to ${newStatus}`)
      fetchDeptTasks()
    } catch (err) {
      toast.error('Connection failure during status update')
    }
  }

  const counts = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Submitted' || c.status === 'Pending').length,
      completed: complaints.filter(c => c.status === 'Resolved').length
    }
  }, [complaints])

  const filteredTasks = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.complaintId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeFilter === 'Pending') return (c.status === 'Submitted' || c.status === 'Pending') && matchesSearch
    if (activeFilter === 'In Progress') return (c.status === 'In Progress' || c.status === 'Under Review') && matchesSearch
    if (activeFilter === 'Completed') return c.status === 'Resolved' && matchesSearch
    return matchesSearch
  })

  if (loading && complaints.length === 0) return <Loader text={`Initializing ${auth.department} Secure Portal...`} />

  return (
    <div className={`dept-dashboard theme-${dept.theme} container py-5`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5"
      >
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className={`bg-${dept.color} bg-opacity-10 p-3 rounded-4`}>
              <DeptIcon className={`text-${dept.color}`} size={32} />
            </div>
            <div>
              <h2 className="fw-black mb-0">{auth.department} Dashboard</h2>
              <p className="text-muted small mb-0 font-monospace uppercase tracking-tighter">Official Resolution Interface • Portal v2.4</p>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3">
          <div className="bg-white p-2 rounded-4 shadow-sm border d-flex gap-2">
            {[
              { label: 'Total', value: counts.total, color: 'primary' },
              { label: 'Pending', value: counts.pending, color: 'danger' },
              { label: 'Resolved', value: counts.completed, color: 'success' }
            ].map(stat => (
              <div key={stat.label} className="px-3 text-center border-end last-border-0">
                <div className="extra-small text-muted fw-bold uppercase">{stat.label}</div>
                <div className={`h5 mb-0 fw-black text-${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-3 rounded-4 bg-white mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Search size={18} /></span>
                  <input 
                    className="form-control bg-light border-0" 
                    placeholder="Search by ID or Title..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex gap-2">
                {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`btn btn-sm rounded-pill flex-grow-1 fw-bold transition-all ${activeFilter === f ? `btn-${dept.color} shadow-sm` : 'btn-light text-muted'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="table-responsive rounded-4 shadow-sm border bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">Grievance Info</th>
                  <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Location</th>
                  <th className="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Priority</th>
                  <th className="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Status</th>
                  <th className="py-3 border-0 small text-muted text-uppercase fw-bold text-end px-4">Management</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <Layout size={48} className="text-muted opacity-25 mb-3" />
                        <h6 className="text-muted fw-bold">No active assignments found</h6>
                        <button onClick={fetchDeptTasks} className="btn btn-sm btn-link text-decoration-none"><RefreshCcw size={14} className="me-1"/> Refresh list</button>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <motion.tr 
                        key={task._id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="transition-all"
                      >
                        <td className="px-4">
                          <div className="d-flex flex-column">
                            <span className="extra-small fw-black text-muted mb-1">{(task.complaintId || task._id).slice(-8)}</span>
                            <span className="fw-bold text-dark">{task.title}</span>
                            <span className="extra-small text-muted text-truncate" style={{maxWidth: '200px'}}>{task.description}</span>
                          </div>
                        </td>
                        <td>
                          <div className="small fw-medium text-muted">
                            {task.location}
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`badge rounded-pill extra-small px-2 py-1 ${
                            task.priority === 'High' ? 'bg-danger' : 
                            task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info text-white'
                          }`}>
                            {task.priority || 'AI-Low'}
                          </span>
                        </td>
                        <td className="text-center">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            {task.status !== 'Resolved' && (
                              <>
                                {task.status !== 'In Progress' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(task.complaintId || task._id, 'In Progress')}
                                    className="btn btn-sm btn-outline-warning rounded-3 p-2 py-1 d-flex align-items-center gap-1 shadow-sm hover-scale"
                                    title="Start Working"
                                  >
                                    <PlayCircle size={16} /> <span className="small fw-bold d-none d-xl-inline">Start Work</span>
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleUpdateStatus(task.complaintId || task._id, 'Resolved')}
                                  className="btn btn-sm btn-success rounded-3 p-2 py-1 d-flex align-items-center gap-1 shadow-sm hover-scale"
                                  title="Mark as Resolved"
                                >
                                  <CheckCircle2 size={16} /> <span className="small fw-bold d-none d-xl-inline">Resolve</span>
                                </button>
                              </>
                            )}
                            {task.status === 'Resolved' && (
                              <div className="text-success small fw-bold d-flex align-items-center gap-1">
                                <CheckCircle2 size={14} /> Closed
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top" style={{ top: '100px' }}>
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom pb-2">
              <AlertCircle className="text-primary" size={18} /> Official Guidelines
            </h6>
            <div className="d-flex flex-column gap-3">
              <div className="bg-light p-3 rounded-3">
                <h6 className="extra-small fw-black uppercase text-muted mb-2">Priority Protocol</h6>
                <p className="extra-small text-muted mb-0">High priority grievances must be acknowledged within 4 hours. Ensure site visit images are uploaded if required.</p>
              </div>
              <div className="bg-light p-3 rounded-3">
                <h6 className="extra-small fw-black uppercase text-muted mb-2">Transparency Rule</h6>
                <p className="extra-small text-muted mb-0">Moving status to 'In Progress' notifies the citizen immediately via the public portal tracking system.</p>
              </div>
              <button onClick={fetchDeptTasks} className="btn btn-outline-primary w-100 rounded-pill py-2 mt-2 d-flex align-items-center justify-content-center gap-2 fw-bold">
                <RefreshCcw size={16} /> Refresh Assignment Queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeptDashboardPage
