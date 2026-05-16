import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Moon, Sun, Shield, Layout } from 'lucide-react'
import { useAuth } from '../context/useAuth'

function AppNavbar({ darkMode, onToggleDarkMode }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg govt-nav py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold" to="/">
          <div className="bg-white p-1 rounded">
            <Shield className="text-primary" size={24} />
          </div>
          <span className="d-none d-sm-inline">PGTS Portal</span>
        </Link>

        <div className="d-flex align-items-center gap-3 order-lg-last">
          <button 
            className="btn btn-link text-white p-0" 
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {auth.isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <div className="dropdown">
                <button 
                  className="btn btn-light btn-sm d-flex align-items-center gap-2 rounded-pill px-3"
                  type="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={16} />
                  <span className="small fw-medium d-none d-md-inline">{auth.name || 'User'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
                  <li className="px-3 py-2 border-bottom">
                    <div className="small fw-bold">Signed in as</div>
                    <div className="small text-muted text-truncate" style={{maxWidth: '150px'}}>{auth.email}</div>
                  </li>
                  {auth.role === 'admin' ? (
                    <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/admin"><Shield size={16}/> Admin Panel</Link></li>
                  ) : auth.role === 'department' ? (
                    <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/dept"><Layout size={16}/> Dept Dashboard</Link></li>
                  ) : (
                    <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/dashboard"><Layout size={16}/> My Complaints</Link></li>
                  )}
                </ul>
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm">
                <LogOut size={14} /> <span className="d-none d-md-inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-light btn-sm px-4 rounded-pill fw-medium">
              Login
            </Link>
          )}
          
          <button className="navbar-toggler border-0 text-white p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link text-white opacity-75 hover-opacity-100" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white opacity-75 hover-opacity-100" to="/submit">Report Issue</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white opacity-75 hover-opacity-100" to="/track">Track</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white opacity-75 hover-opacity-100" to="/transparency">Transparency</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar
