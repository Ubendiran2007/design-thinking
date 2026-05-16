import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react'
import { registerUser } from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser(data)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
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
          className="col-md-6 col-lg-5"
        >
          <div className="card border-0 shadow-lg p-4 rounded-4">
            <div className="text-center mb-4">
              <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                <UserPlus className="text-success" size={32} />
              </div>
              <h2 className="fw-bold">Create Account</h2>
              <p className="text-muted small">Join our community and make your voice heard with transparency.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <User size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className={`form-control border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="John Doe"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>
                </div>

                <div className="col-12">
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

                <div className="col-12">
                  <label className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className={`form-control border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••••"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' }
                      })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className={`form-control border-start-0 ps-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="••••••••"
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Loader2 size={20} />
                    </motion.div>
                    Registering...
                  </>
                ) : (
                  <>Create Account</>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  Already have an account? <Link to="/login" className="text-success fw-bold text-decoration-none">Login here</Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
