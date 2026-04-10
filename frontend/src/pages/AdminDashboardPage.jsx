import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AdminSidebar from '../components/AdminSidebar'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'
import { getAllComplaints, updateComplaint } from '../services/api'

const departments = ['Public Works', 'Water Department', 'Sanitation', 'Public Safety']
const statuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved']

function AdminDashboardPage() {
  const [filters, setFilters] = useState({ status: '', category: '', search: '' })
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await getAllComplaints(filters)
      if (mounted) {
        setComplaints(data)
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [filters])

  const chartData = useMemo(() => {
    const map = complaints.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})
    return statuses.map((name) => ({ name, value: map[name] || 0 }))
  }, [complaints])

  const handleUpdate = async (id, field, value) => {
    await updateComplaint(id, { [field]: value })
    const data = await getAllComplaints(filters)
    setComplaints(data)
  }

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-lg-2"><AdminSidebar /></div>
        <div className="col-lg-10">
          <section id="overview" className="mb-4">
            <h3>Admin Dashboard</h3>
            <p className="text-muted">Manage complaints, assign departments, and monitor system performance.</p>
          </section>

          <section className="card border-0 shadow-sm mb-4 p-3">
            <div className="row g-2">
              <div className="col-md-3">
                <input className="form-control" placeholder="Search ID or title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">All statuses</option>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                  <option value="">All categories</option>
                  <option>Infrastructure</option>
                  <option>Water Supply</option>
                  <option>Sanitation</option>
                  <option>Public Safety</option>
                </select>
              </div>
            </div>
          </section>

          <section id="complaints" className="card border-0 shadow-sm p-3 mb-4">
            {loading ? <Loader text="Loading complaints..." /> : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th><th>Title</th><th>Status</th><th>Category</th><th>Department</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td><StatusBadge status={item.status} /></td>
                        <td>{item.category}</td>
                        <td>{item.department}</td>
                        <td className="d-flex gap-2">
                          <select className="form-select form-select-sm" defaultValue={item.status} onChange={(e) => handleUpdate(item.id, 'status', e.target.value)}>
                            {statuses.map((status) => <option key={status}>{status}</option>)}
                          </select>
                          <select className="form-select form-select-sm" defaultValue={item.department} onChange={(e) => handleUpdate(item.id, 'department', e.target.value)}>
                            <option>Pending Assignment</option>
                            {departments.map((dep) => <option key={dep}>{dep}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section id="analytics" className="card border-0 shadow-sm p-3">
            <h5>Complaint Status Distribution</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1E3A8A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
