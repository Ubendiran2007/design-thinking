import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Send, MapPin, Tag, FileText, Loader2 } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { submitComplaint } from '../services/api'

const categories = ['Infrastructure', 'Water Supply', 'Sanitation', 'Public Safety', 'Other']

function SubmitComplaintPage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: auth.email || ''
    }
  })

  const onSubmit = async (data) => {
    if (!auth.isAuthenticated) {
      toast.error('You must be logged in to submit a complaint')
      return navigate('/login')
    }

    setLoading(true)
    try {
      const response = await submitComplaint({ 
        ...data, 
        userId: auth.userId || auth.id,
        userEmail: auth.email 
      })
      toast.success(`Complaint submitted! ID: ${response.id || response._id}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-lg-8"
        >
          <div className="card border-0 shadow-lg p-4 rounded-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <FileText className="text-primary" size={28} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">Submit Grievance</h3>
                <p className="text-muted small mb-0">Your report will be handled with full transparency and accountability.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Complaint Title</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <Tag size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className={`form-control border-start-0 ps-0 ${errors.title ? 'is-invalid' : ''}`}
                      placeholder="Brief summary of the issue"
                      {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Category</label>
                  <select 
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    {...register('category', { required: 'Please select a category' })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Location</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <MapPin size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className={`form-control border-start-0 ps-0 ${errors.location ? 'is-invalid' : ''}`}
                      placeholder="Area or Street name"
                      {...register('location', { required: 'Location is required' })}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">Detailed Description</label>
                  <textarea
                    rows="4"
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    placeholder="Provide as much detail as possible to help us resolve the issue faster..."
                    {...register('description', { required: 'Description is required' })}
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>

                <div className="col-12 mt-4 text-center">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <Loader2 size={20} />
                        </motion.div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        File Complaint
                      </>
                    )}
                  </button>
                  <p className="small text-muted mt-3">By submitting, you agree to provide truthful information.</p>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubmitComplaintPage
