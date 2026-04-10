import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const nextErrors = {}
    if (!form.name) nextErrors.name = 'Name is required'
    if (!form.email) nextErrors.email = 'Email is required'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    if (!form.password || form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const response = await registerUser(form)
      toast.success(response.message)
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Registration failed')
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
              <h3 className="mb-3">Register</h3>
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
                <button disabled={loading} className="btn btn-primary w-100">{loading ? 'Creating account...' : 'Create Account'}</button>
              </form>
              <p className="mt-3 mb-0 small text-muted">
                Already registered? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
