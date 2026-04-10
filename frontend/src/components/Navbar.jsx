import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AppNavbar({ darkMode, onToggleDarkMode }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark govt-nav sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Grievance Transparency Portal
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/submit" className="nav-link">Register Complaint</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/track" className="nav-link">Track Complaint</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/transparency" className="nav-link">Transparency</NavLink>
            </li>
            {auth.isAuthenticated && auth.role === 'user' && (
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link">User Dashboard</NavLink>
              </li>
            )}
            {auth.isAuthenticated && auth.role === 'admin' && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">Admin Dashboard</NavLink>
              </li>
            )}
            {!auth.isAuthenticated ? (
              <li className="nav-item">
                <NavLink to="/login" className="btn btn-sm btn-accent ms-lg-2">Login</NavLink>
              </li>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-2">
                <span className="text-light small">Hi, {auth.name}</span>
                <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
              </li>
            )}
            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-sm btn-outline-light"
                onClick={onToggleDarkMode}
                aria-label="Toggle dark mode"
              >
                <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar
