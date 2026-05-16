import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const flow = ['Submitted', 'Under Review', 'In Progress', 'Resolved']

function ComplaintTimeline({ currentStatus }) {
  const currentIndex = flow.indexOf(currentStatus) === -1 ? 0 : flow.indexOf(currentStatus)

  return (
    <div className="position-relative py-4 px-2">
      <div className="d-flex justify-content-between position-relative" style={{ zIndex: 1 }}>
        {flow.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? 'var(--primary)' : '#e2e8f0',
                  scale: isCurrent ? 1.2 : 1,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(30, 58, 138, 0.2)' : 'none'
                }}
                className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                style={{ width: '32px', height: '32px', color: '#fff' }}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="small fw-bold">{index + 1}</span>}
              </motion.div>
              <span 
                className={`small text-center px-1 ${isCurrent ? 'fw-bold text-primary' : 'text-muted'}`}
                style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
      
      {/* Background Line */}
      <div 
        className="position-absolute translate-middle-y" 
        style={{ 
          top: '40px', 
          left: '10%', 
          right: '10%', 
          height: '4px', 
          backgroundColor: '#e2e8f0', 
          zIndex: 0,
          borderRadius: '2px'
        }}
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (flow.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            height: '100%', 
            backgroundColor: 'var(--primary)',
            borderRadius: '2px'
          }}
        />
      </div>
    </div>
  )
}

export default ComplaintTimeline
