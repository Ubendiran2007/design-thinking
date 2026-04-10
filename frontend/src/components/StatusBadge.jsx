const statusMap = {
  Submitted: 'bg-secondary',
  'Under Review': 'bg-primary',
  'In Progress': 'bg-warning text-dark',
  Resolved: 'bg-success',
}

function StatusBadge({ status }) {
  return <span className={`badge ${statusMap[status] || 'bg-dark'}`}>{status}</span>
}

export default StatusBadge
