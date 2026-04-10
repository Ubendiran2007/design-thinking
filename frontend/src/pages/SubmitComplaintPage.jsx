import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/useAuth'
import { submitComplaint } from '../services/api'

function SubmitComplaintPage() {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    file: null,
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category || !form.location) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        file: form.file?.name || null,
        userEmail: auth.email || 'citizen@example.com',
      }
      const complaint = await submitComplaint(payload)
      toast.success(`Complaint submitted successfully. ID: ${complaint.id}`)
      setForm({ title: '', description: '', category: '', location: '', file: null })
    } catch (error) {
      toast.error(error.message || 'Could not submit complaint.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h3 className="mb-4">Submit a Complaint</h3>
          <form onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Title *</label>
                <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  <option>Infrastructure</option>
                  <option>Water Supply</option>
                  <option>Sanitation</option>
                  <option>Public Safety</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Description *</label>
                <textarea rows="4" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location *</label>
                <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">File Upload</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                />
              </div>
            </div>
            <button className="btn btn-primary mt-4" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitComplaintPage
