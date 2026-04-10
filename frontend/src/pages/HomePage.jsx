import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main>
      <section className="hero-section py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge text-bg-light mb-3">Citizen First Governance</span>
              <h1 className="display-5 fw-bold text-primary">
                Empowering Citizens Through Transparent Grievance Redressal
              </h1>
              <p className="lead text-muted">
                Raise concerns, track progress, and view public transparency metrics through a unified and trusted platform.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to="/submit" className="btn btn-primary">Register Complaint</Link>
                <Link to="/track" className="btn btn-outline-primary">Track Complaint</Link>
                <Link to="/transparency" className="btn btn-accent">View Transparency Dashboard</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="glass-card p-4">
                <h5 className="fw-semibold">Why this system?</h5>
                <ul className="mb-0 text-muted">
                  <li>End-to-end visibility of grievance lifecycle</li>
                  <li>Department accountability with measurable outcomes</li>
                  <li>Public data-backed transparency dashboards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
