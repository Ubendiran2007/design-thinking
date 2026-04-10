import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import AppNavbar from './components/Navbar'
import { useAuth } from './context/useAuth'
import AdminDashboardPage from './pages/AdminDashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import SubmitComplaintPage from './pages/SubmitComplaintPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import TransparencyDashboardPage from './pages/TransparencyDashboardPage'
import UserDashboardPage from './pages/UserDashboardPage'

function ProtectedRoute({ children, role }) {
  const { auth } = useAuth()
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  if (role && auth.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('pgts-theme') === 'dark')

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('pgts-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <AppNavbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
      <div className="fade-in">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<SubmitComplaintPage />} />
          <Route path="/track" element={<TrackComplaintPage />} />
          <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/transparency" element={<TransparencyDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default AppRoutes
