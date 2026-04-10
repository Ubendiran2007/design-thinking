function AdminSidebar() {
  return (
    <aside className="admin-sidebar p-3 rounded-3">
      <h6 className="text-uppercase text-muted">Admin Navigation</h6>
      <ul className="list-unstyled mb-0 d-grid gap-2">
        <li><a href="#overview" className="text-decoration-none">Overview</a></li>
        <li><a href="#complaints" className="text-decoration-none">Complaints</a></li>
        <li><a href="#analytics" className="text-decoration-none">Analytics</a></li>
      </ul>
    </aside>
  )
}

export default AdminSidebar
