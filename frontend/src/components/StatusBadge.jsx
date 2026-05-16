import { Clock, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react'

const config = {
  'Submitted': { color: 'text-danger bg-danger', icon: AlertCircle, label: 'Pending' },
  'Pending': { color: 'text-danger bg-danger', icon: AlertCircle, label: 'Pending' },
  'Under Review': { color: 'text-warning bg-warning', icon: Clock, label: 'In Progress' },
  'In Progress': { color: 'text-warning bg-warning', icon: PlayCircle, label: 'In Progress' },
  'Resolved': { color: 'text-success bg-success', icon: CheckCircle2, label: 'Resolved' }
}

function StatusBadge({ status }) {
  const { color, icon: Icon, label } = config[status] || config['Submitted']
  
  return (
    <span className={`badge d-inline-flex align-items-center gap-1 rounded-pill px-3 py-2 bg-opacity-10 border ${color}`}>
      <Icon size={14} />
      <span className="small fw-bold">{label}</span>
    </span>
  )
}

export default StatusBadge
