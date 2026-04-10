import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { loginUser } from '../services/api'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const nextErrors = {}
    if (!form.email) nextErrors.email = 'Email is required'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    if (!form.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await loginUser(form)
      login(user)
      toast.success('Login successful')
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      toast.error(error.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-3">Login</h3>
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
                <button disabled={loading} className="btn btn-primary w-100">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <p className="mt-3 mb-0 small text-muted">
                No account? <Link to="/register">Register now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
