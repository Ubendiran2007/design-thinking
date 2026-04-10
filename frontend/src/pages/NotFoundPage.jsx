import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link className="btn btn-primary" to="/">Return Home</Link>
    </div>
  )
}

export default NotFoundPage
