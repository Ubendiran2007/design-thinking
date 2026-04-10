import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Loader from '../components/Loader'
import { getTransparencyStats } from '../services/api'

const COLORS = ['#1E3A8A', '#10B981', '#94A3B8', '#0EA5E9']

function TransparencyDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getTransparencyStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading public transparency data..." />

  return (
    <div className="container py-5">
      <h3 className="mb-4">Public Transparency Dashboard</h3>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="metric-card"><h6>Total Complaints</h6><h2>{stats.total}</h2></div></div>
        <div className="col-md-4"><div className="metric-card"><h6>Resolved</h6><h2 className="text-success">{stats.resolved}</h2></div></div>
        <div className="col-md-4"><div className="metric-card"><h6>Pending</h6><h2 className="text-primary">{stats.pending}</h2></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6>Category-wise Distribution</h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={stats.categoryDistribution} dataKey="value" nameKey="name" outerRadius={100} label>
                    {stats.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6>Monthly Complaint Trend</h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={stats.monthlyTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="#1E3A8A" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card border-0 shadow-sm p-3">
            <h6>Resolved vs Pending</h6>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={[{ name: 'Complaints', Resolved: stats.resolved, Pending: stats.pending }]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Resolved" fill="#10B981" />
                  <Bar dataKey="Pending" fill="#1E3A8A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransparencyDashboardPage
