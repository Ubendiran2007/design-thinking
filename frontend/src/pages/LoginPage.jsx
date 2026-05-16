import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { loginUser } from '../services/api'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await loginUser(data)
      login(response)
      toast.success('Login successful! Welcome back.')
      navigate(response.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-md-5"
        >
          <div className="card border-0 shadow-lg p-4 rounded-4">
            <div className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                <LogIn className="text-primary" size={32} />
              </div>
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted small">Sign in to manage your grievances and track progress.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <Mail size={18} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="name@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className={`form-control border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Loader2 size={20} />
                    </motion.div>
                    Signing in...
                  </>
                ) : (
                  <>Sign In</>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Register here</Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
