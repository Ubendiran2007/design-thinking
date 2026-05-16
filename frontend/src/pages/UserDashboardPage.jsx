import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, FileText, ChevronRight, Layout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'
import { getUserComplaints } from '../services/api'

function UserDashboardPage() {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    getUserComplaints(auth.email)
      .then(setComplaints)
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false))
  }, [auth.email])

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (c.complaintId || c._id || '').includes(searchTerm)
      return matchesSearch
    })
  }, [complaints, searchTerm])

  if (loading) return <Loader />

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h2 className="fw-black mb-1">My Personal Grievances</h2>
          <p className="text-muted small mb-0">Track the progress of your submitted reports</p>
        </div>
        <Link to="/submit" className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm font-bold">
          <Plus size={20} /> New Grievance
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
        <div className="p-4 border-bottom bg-light bg-opacity-50">
          <div className="row align-items-center g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted"><Search size={18} /></span>
                <input 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Search your complaints..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small fw-bold">
                Total Submissions: {complaints.length}
              </span>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">ID</th>
                <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Title</th>
                <th className="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Current Status</th>
                <th className="py-3 border-0 small text-muted text-uppercase fw-bold text-end px-4">Tracking</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <Layout size={48} className="text-muted opacity-25 mb-3" />
                      <h6 className="text-muted">No records found</h6>
                      <Link to="/submit" className="btn btn-link btn-sm text-decoration-none mt-2">Submit your first grievance</Link>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c, index) => (
                    <motion.tr 
                      key={c._id || c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-4">
                        <span className="font-monospace small fw-bold text-primary">{(c.complaintId || c._id).slice(-8)}</span>
                      </td>
                      <td>
                        <div className="fw-bold">{c.title}</div>
                        <div className="extra-small text-muted">{new Date(c.createdAt).toLocaleDateString()} • {c.category}</div>
                      </td>
                      <td className="text-center">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 text-end">
                        <Link to={`/track?id=${c.complaintId || c._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold">
                          Track Details <ChevronRight size={14} className="ms-1" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserDashboardPage
