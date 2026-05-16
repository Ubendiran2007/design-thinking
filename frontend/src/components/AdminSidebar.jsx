import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileStack, PieChart, LogOut, Shield, Users } from 'lucide-react'
import { useAuth } from '../context/useAuth'

function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentView = searchParams.get('view') || 'complaints'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { name: 'Complaints', icon: FileStack, view: 'complaints' },
    { name: 'People (Users)', icon: Users, view: 'users' },
    { name: 'Analytics', icon: PieChart, view: 'analytics' },
  ]

  return (
    <aside className="admin-sidebar p-4 h-100 rounded-4 shadow-sm bg-white d-flex flex-column border">
      <div className="d-flex align-items-center gap-2 mb-5 px-2">
        <div className="bg-primary p-2 rounded-3 text-white">
          <Shield size={20} />
        </div>
        <h6 className="fw-black mb-0 text-primary uppercase letter-spacing-1">Admin Panel</h6>
      </div>

      <div className="mb-3 px-2">
        <h6 className="text-uppercase text-muted fw-bold extra-small tracking-wider">Navigation</h6>
      </div>

      <ul className="list-unstyled d-flex flex-column gap-2 mb-0 flex-grow-1">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link 
              to={`/admin?view=${item.view}`}
              className={`d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none transition-all small fw-bold ${
                currentView === item.view ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto pt-4 border-top">
        <button 
          onClick={handleLogout}
          className="btn btn-link w-100 d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none text-danger transition-all small fw-bold border-0 hover-bg-danger-subtle"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
