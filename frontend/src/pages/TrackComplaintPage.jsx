import { useState } from 'react'
import toast from 'react-hot-toast'
import ComplaintTimeline from '../components/ComplaintTimeline'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'
import { getComplaintById } from '../services/api'

function TrackComplaintPage() {
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [complaint, setComplaint] = useState(null)

  const onTrack = async (e) => {
    e.preventDefault()
    if (!id) return toast.error('Enter complaint ID')
    setLoading(true)
    const data = await getComplaintById(id)
    if (!data) toast.error('Complaint not found')
    setComplaint(data)
    setLoading(false)
  }

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h3>Track Complaint</h3>
          <form className="row g-2 mt-2" onSubmit={onTrack}>
            <div className="col-md-8">
              <input value={id} onChange={(e) => setId(e.target.value)} className="form-control" placeholder="Enter Complaint ID (e.g. GRV-1001)" />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100">Track Status</button>
            </div>
          </form>
        </div>
      </div>

      {loading && <Loader text="Fetching complaint details..." />}
      {complaint && !loading && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="mb-3">{complaint.title}</h5>
            <p><strong>ID:</strong> {complaint.id}</p>
            <p><strong>Category:</strong> {complaint.category}</p>
            <p><strong>Location:</strong> {complaint.location}</p>
            <p><strong>Current Status:</strong> <StatusBadge status={complaint.status} /></p>
            <hr />
            <ComplaintTimeline currentStatus={complaint.status} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackComplaintPage
