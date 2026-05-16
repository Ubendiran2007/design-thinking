import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { BarChart3, TrendingUp, PieChart as PieIcon, CheckCircle2, Clock, FileStack } from 'lucide-react'
import Loader from '../components/Loader'
import { getTransparencyStats } from '../services/api'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']

function TransparencyDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getTransparencyStats()
      .then(res => {
        if (res) setStats(res)
        else throw new Error('No data')
      })
      .catch(() => setStats({
        total: 0, resolved: 0, pending: 0,
        categoryDistribution: [],
        monthlyTrend: []
      }))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) return <Loader text="Synchronizing transparency data..." />

  return (
    <div className="container py-5">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <h2 className="fw-bold mb-2">Public Transparency Dashboard</h2>
        <p className="text-muted">Real-time performance metrics and accountability statistics</p>
      </motion.div>

      <div className="row g-4 mb-5">
        {[
          { label: 'Total Grievances', value: stats.total, icon: FileStack, color: 'primary' },
          { label: 'Resolved Cases', value: stats.resolved, icon: CheckCircle2, color: 'success' },
          { label: 'Under Process', value: stats.pending, icon: Clock, color: 'warning' },
        ].map((item, i) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="col-md-4"
          >
            <div className={`card border-0 shadow-sm p-4 rounded-4 border-start border-5 border-${item.color}`}>
              <div className="d-flex align-items-center gap-3">
                <div className={`bg-${item.color} bg-opacity-10 p-3 rounded-circle`}>
                  <item.icon className={`text-${item.color}`} size={24} />
                </div>
                <div>
                  <h6 className="text-muted small mb-1 uppercase tracking-wider fw-bold">{item.label}</h6>
                  <h3 className="fw-bold mb-0">{item.value}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-0 shadow-sm p-4 rounded-4 h-100"
          >
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <PieIcon size={18} className="text-primary" /> Category Distribution
            </h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {stats.categoryDistribution?.length > 0 ? (
                  <PieChart>
                    <Pie data={stats.categoryDistribution} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} paddingAngle={5}>
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted small">No data available</div>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="col-lg-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-0 shadow-sm p-4 rounded-4 h-100"
          >
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Resolution Trend
            </h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {stats.monthlyTrend?.length > 0 ? (
                  <LineChart data={stats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                    <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted small">No data available</div>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="col-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm p-4 rounded-4"
          >
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> Comparative Efficiency
            </h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={[{ name: 'Complaints', Resolved: stats.resolved, Pending: stats.pending }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="Resolved" fill="#10b981" radius={[6, 6, 0, 0]} barSize={60} />
                  <Bar dataKey="Pending" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TransparencyDashboardPage
