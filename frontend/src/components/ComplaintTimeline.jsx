const flow = ['Submitted', 'Under Review', 'In Progress', 'Resolved']

function ComplaintTimeline({ currentStatus }) {
  const currentIndex = Math.max(flow.indexOf(currentStatus), 0)

  return (
    <div className="timeline-wrap">
      {flow.map((step, index) => {
        const completed = index <= currentIndex
        return (
          <div key={step} className="timeline-step">
            <div className={`timeline-dot ${completed ? 'active' : ''}`}>{index + 1}</div>
            <p className={`small mb-0 ${completed ? 'fw-semibold' : 'text-muted'}`}>{step}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ComplaintTimeline
