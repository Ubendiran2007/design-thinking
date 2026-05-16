import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, BarChart3, CheckCircle2, MapPin } from 'lucide-react'

function HomePage() {
  return (
    <main>
      <section className="hero-section py-5 overflow-hidden">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="col-lg-7 text-center text-lg-start"
            >
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-4"
              >
                Governance Redefined • Transparency First
              </motion.span>
              <h1 className="display-4 fw-bold text-primary mb-4 leading-tight">
                Empowering Citizens through <br/>
                <span className="text-accent">Transparent Grievance Redressal</span>
              </h1>
              <p className="lead text-muted mb-5">
                Join a community dedicated to accountability. Raise your concerns, track their progress in real-time, and monitor government efficiency through our live transparency metrics.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/submit" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-3 rounded-pill fw-bold shadow-sm">
                  Register Grievance <ArrowRight size={20} />
                </Link>
                <Link to="/track" className="btn btn-outline-primary px-4 py-3 rounded-pill fw-bold">
                  Track Progress
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="col-lg-5"
            >
              <div className="position-relative">
                <div className="glass-card p-4 p-md-5 rounded-5 shadow-lg border-0 bg-white">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-accent bg-opacity-10 p-3 rounded-4">
                      <Shield className="text-accent" size={32} />
                    </div>
                    <h5 className="fw-bold mb-0">Platform Values</h5>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle2, text: 'Real-time Lifecycle Tracking', color: 'text-success' },
                      { icon: MapPin, text: 'Location-based Action Routing', color: 'text-danger' },
                      { icon: BarChart3, text: 'Public Performance Metrics', color: 'text-primary' }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="d-flex align-items-center gap-3 mb-3 p-3 rounded-4 bg-light bg-opacity-50"
                      >
                        <item.icon className={item.color} size={24} />
                        <span className="fw-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="position-absolute top-0 start-0 translate-middle bg-accent opacity-10 rounded-circle" style={{ width: '150px', height: '150px', zIndex: -1 }}></div>
                <div className="position-absolute bottom-0 end-0 translate-middle-y bg-primary opacity-10 rounded-circle" style={{ width: '200px', height: '200px', zIndex: -1 }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white border-top">
        <div className="container py-4 text-center">
          <h2 className="fw-bold mb-5">How It Works</h2>
          <div className="row g-4">
            {[
              { title: 'Submit', desc: 'Detail your grievance with location and category' },
              { title: 'Assign', desc: 'Automated routing to responsible departments' },
              { title: 'Resolve', desc: 'Direct updates and progress benchmarks' }
            ].map((step, i) => (
              <div key={i} className="col-md-4">
                <div className="p-4 rounded-4 bg-light h-100 border-bottom border-4 border-primary border-opacity-25 hover-translate-y">
                  <div className="h1 text-primary opacity-25 fw-black mb-3">0{i+1}</div>
                  <h5 className="fw-bold">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
