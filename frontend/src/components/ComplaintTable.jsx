import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, ChevronDown, Split, ListChecks, Plus, Trash2, CheckSquare, 
  AlertCircle, FileSpreadsheet, RefreshCcw, CheckCircle2 
} from 'lucide-react'
import StatusBadge from './StatusBadge'

const departments = ['Water Department', 'Electricity Board', 'Road Maintenance', 'Sanitation', 'Public Safety']
const statuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved']

function ComplaintTable({ complaints, onUpdate, onSubTaskUpdate, updatingId }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">ID / User</th>
            <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Grievance Details</th>
            <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Status</th>
            <th className="py-3 border-0 small text-muted text-uppercase fw-bold">Team Activity</th>
            <th className="py-3 border-0 small text-muted text-uppercase fw-bold text-end px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <AdminRow 
              key={c.complaintId || c._id}
              complaint={c}
              isExpanded={expandedId === (c.complaintId || c._id)}
              onToggle={() => setExpandedId(expandedId === (c.complaintId || c._id) ? null : (c.complaintId || c._id))}
              onUpdate={onUpdate}
              onSubTaskUpdate={onSubTaskUpdate}
              updating={updatingId === (c.complaintId || c._id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminRow({ complaint, isExpanded, onToggle, onUpdate, onSubTaskUpdate, updating }) {
  const [subTasks, setSubTasks] = useState(complaint.subTasks || [])

  const addSubTask = () => setSubTasks([...subTasks, { taskName: '', department: departments[0], status: 'Pending' }])
  const removeSubTask = (idx) => setSubTasks(subTasks.filter((_, i) => i !== idx))
  const updateSubTask = (idx, field, val) => {
    const next = [...subTasks]
    next[idx][field] = val
    setSubTasks(next)
  }

  return (
    <>
      <motion.tr layout className={updating ? 'opacity-50' : ''}>
        <td className="px-4">
          <div className="fw-bold small">{complaint.complaintId?.slice(-8) || '...'}</div>
          <div className="text-muted small d-flex align-items-center gap-1">
            <User size={12} /> {complaint.userEmail?.split('@')[0]}
          </div>
        </td>
        <td>
          <div className="fw-bold">{complaint.title}</div>
          <div className="small text-muted">{complaint.category} • {new Date(complaint.createdAt).toLocaleDateString()}</div>
        </td>
        <td><StatusBadge status={complaint.status} /></td>
        <td>
          <div className="dropdown">
            <button className="btn btn-sm btn-white border dropdown-toggle d-flex align-items-center gap-1 rounded-pill px-3" data-bs-toggle="dropdown">
              {complaint.department || 'Assign Dept'}
            </button>
            <ul className="dropdown-menu shadow border-0">
              {departments.map(d => (
                <li key={d}><button className="dropdown-item small" onClick={() => onUpdate(complaint.complaintId || complaint._id, 'department', d)}>{d}</button></li>
              ))}
            </ul>
          </div>
        </td>
        <td className="px-4 text-end">
          <div className="d-inline-flex align-items-center gap-2">
            <button 
              onClick={onToggle} 
              className={`btn btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1 py-1 px-3 transition-all ${isExpanded ? 'btn-primary shadow-sm' : 'btn-outline-primary'}`}
              style={{ minHeight: '32px' }}
            >
              <Split size={14} /> <span className="d-none d-md-inline fw-medium">Split Task</span>
            </button>
            <div className="dropdown">
              <button 
                className="btn btn-sm btn-outline-primary rounded-pill dropdown-toggle d-flex align-items-center justify-content-center gap-2 py-1 px-3 transition-all fw-bold shadow-sm" 
                data-bs-toggle="dropdown"
                style={{ minHeight: '34px' }}
              >
                <RefreshCcw size={14} /> <span>Status</span>
              </button>
              <ul className="dropdown-menu shadow-lg border-0 py-2 mt-2 dropdown-menu-end">
                <li className="dropdown-header small text-uppercase fw-bold text-muted px-4 mb-2 border-bottom pb-2">Set New Status</li>
                {statuses.map(s => (
                  <li key={s}>
                    <button 
                      className="dropdown-item small py-2 px-4 d-flex align-items-center justify-content-between gap-3 text-secondary hover-text-primary transition-all" 
                      onClick={() => onUpdate(complaint.complaintId || complaint._id, 'status', s)}
                    >
                      {s}
                      {complaint.status === s && <CheckCircle2 size={14} className="text-success" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </td>
      </motion.tr>

      {isExpanded && (
        <tr>
          <td colSpan="5" className="px-4 py-3 bg-light bg-opacity-50 border-0">
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <div className="p-4 bg-white rounded-4 border shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <ListChecks size={18} className="text-primary" /> Sub-Task Assignments
                  </h6>
                  <button onClick={addSubTask} className="btn btn-sm btn-primary rounded-pill px-3">
                    <Plus size={14} /> Add Group
                  </button>
                </div>

                {subTasks.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3 border border-dashed mb-3">
                    <AlertCircle className="text-muted mb-2" size={24} />
                    <p className="text-muted small mb-0">No departments assigned to sub-tasks yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead className="small text-muted">
                        <tr>
                          <th>Action Description</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subTasks.map((task, idx) => (
                          <tr key={idx}>
                            <td>
                              <input className="form-control form-control-sm border-0 bg-light" placeholder="Describe task..." value={task.taskName} onChange={(e) => updateSubTask(idx, 'taskName', e.target.value)} />
                            </td>
                            <td>
                              <select className="form-select form-select-sm border-0 bg-light" value={task.department} onChange={(e) => updateSubTask(idx, 'department', e.target.value)}>
                                {departments.map(d => <option key={d}>{d}</option>)}
                              </select>
                            </td>
                            <td>
                              <select className="form-select form-select-sm border-0 bg-light" value={task.status} onChange={(e) => updateSubTask(idx, 'status', e.target.value)}>
                                <option>Pending</option><option>In Progress</option><option>Completed</option>
                              </select>
                            </td>
                            <td className="text-end">
                              <button onClick={() => removeSubTask(idx)} className="btn btn-sm text-danger p-1"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-3 d-flex justify-content-end gap-2">
                  <button onClick={onToggle} className="btn btn-light btn-sm rounded-pill px-4">Cancel</button>
                  <button onClick={() => onSubTaskUpdate(complaint.complaintId || complaint._id, subTasks)} className="btn btn-primary btn-sm rounded-pill px-4 d-flex align-items-center gap-2">
                    <CheckSquare size={14} /> Save Assignment Splits
                  </button>
                </div>
              </div>
            </motion.div>
          </td>
        </tr>
      )}
    </>
  )
}

export default ComplaintTable
