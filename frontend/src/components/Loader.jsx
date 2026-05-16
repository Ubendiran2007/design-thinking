import { motion } from 'framer-motion'

function Loader({ text = 'Preparing your data...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="position-relative" style={{ width: '60px', height: '60px' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: '100%',
            height: '100%',
            border: '4px solid var(--primary)',
            borderRadius: '12px',
            opacity: 0.2
          }}
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '4px solid transparent',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%'
          }}
        />
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 mb-0 text-muted small fw-medium text-uppercase tracking-wider"
      >
        {text}
      </motion.p>
    </div>
  )
}

export default Loader
