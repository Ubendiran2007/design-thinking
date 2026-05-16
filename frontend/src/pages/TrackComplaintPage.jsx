import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Calendar, Tag, Shield, Loader2, ListChecks, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import ComplaintTimeline from '../components/ComplaintTimeline'
import StatusBadge from '../components/StatusBadge'
import { getComplaintById } from '../services/api'
import { useLocation } from 'react-router-dom'

function TrackComplaintPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [complaint, setComplaint] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    if (id) {
      setQuery(id)
      handleTrack(id)
    }
  }, [location])

  const handleTrack = async (targetId) => {
    const searchId = typeof targetId === 'string' ? targetId : query
    if (!searchId) return toast.warning('Please enter a complaint ID')
    
    setLoading(true)
    setComplaint(null)
    try {
      const data = await getComplaintById(searchId)
      setComplaint(data)
    } catch (err) {
      toast.error('Complaint not found. Please check the ID.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm p-4 mb-4 rounded-4 bg-white"
          >
            <h3 className="fw-bold mb-3">Track Your Grievance</h3>
            <p className="text-muted small">Enter the 24-character ID or the tracking code provided during submission.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="position-relative">
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="form-control form-control-lg ps-5 rounded-pill" 
                placeholder="Ex: GRV-1001..." 
              />
              <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-2 rounded-pill px-4"
                style={{ height: 'calc(100% - 8px)' }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Track'}
              </button>
            </form>
          </motion.div>

          <AnimatePresence>
            {complaint && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card border-0 shadow-lg overflow-hidden rounded-4 bg-white"
              >
                <div className="bg-primary p-4 text-white">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-white bg-opacity-25 mb-2">ID: {complaint.complaintId || complaint._id}</span>
                      <h4 className="fw-bold mb-0">{complaint.title}</h4>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row g-4 mb-4">
                    <div className="col-sm-4">
                      <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                        <Tag size={16} /> Category
                      </div>
                      <div className="fw-bold">{complaint.category}</div>
                    </div>
                    <div className="col-sm-4">
                      <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                        <MapPin size={16} /> Location
                      </div>
                      <div className="fw-bold">{complaint.location}</div>
                    </div>
                    <div className="col-sm-4">
                      <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                        <Calendar size={16} /> Submitted On
                      </div>
                      <div className="fw-bold">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-4">
                    <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                       Description
                    </div>
                    <p className="mb-0 small">{complaint.description}</p>
                  </div>

                  {complaint.subTasks?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <ListChecks className="text-primary" size={18} />
                        Group Assignments & Progress
                      </h6>
                      <div className="row g-3">
                        {complaint.subTasks.map((task, i) => (
                          <div key={i} className="col-12">
                            <div className="p-3 border rounded-3 bg-white d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold small">{task.taskName}</div>
                                <div className="text-muted extra-small uppercase fw-bold" style={{ fontSize: '10px' }}>
                                  Assigned to: {task.department}
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                {task.status === 'Completed' ? (
                                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 small d-flex align-items-center gap-1">
                                    <CheckCircle2 size={12} /> Resolved
                                  </span>
                                ) : task.status === 'In Progress' ? (
                                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 small d-flex align-items-center gap-1">
                                    <Clock size={12} /> In Progress
                                  </span>
                                ) : (
                                  <span className="badge bg-light text-dark rounded-pill px-3 py-1 small d-flex align-items-center gap-1">
                                    <AlertCircle size={12} /> Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="my-4" />

                  <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <Shield className="text-primary" size={18} />
                    Resolution Lifecycle
                  </h6>
                  
                  <ComplaintTimeline currentStatus={complaint.status} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default TrackComplaintPage
