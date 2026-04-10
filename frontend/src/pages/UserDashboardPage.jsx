import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'
import { getUserComplaints } from '../services/api'

function UserDashboardPage() {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    getUserComplaints(auth.email || 'citizen@example.com')
      .then(setComplaints)
      .finally(() => setLoading(false))
  }, [auth.email])

  return (
    <div className="container py-5">
      <h3 className="mb-4">My Complaints</h3>
      {loading ? <Loader /> : (
        <div className="row g-3">
          {complaints.length === 0 && <p className="text-muted">No complaints submitted yet.</p>}
          {complaints.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm card-hover">
                <div className="card-body">
                  <h6 className="fw-semibold">{item.title}</h6>
                  <p className="small text-muted mb-2">{item.id} | {item.createdAt}</p>
                  <p className="small">{item.description}</p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashboardPage
