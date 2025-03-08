import { Link, Outlet } from "react-router-dom"
import { BookOpen } from "lucide-react"

function UserProfile() {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Reader Dashboard</h2>
      <ul className="d-flex justify-content-center list-unstyled fs-5 mb-4">
        <li className="nav-item">
          <Link to="articles" className="nav-link d-flex align-items-center">
            <BookOpen size={18} className="me-2" /> Browse Articles
          </Link>
        </li>
      </ul>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default UserProfile

