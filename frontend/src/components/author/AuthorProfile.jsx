import { NavLink, Outlet } from "react-router-dom"
import { BookOpen, PlusCircle } from "lucide-react"

function AuthorProfile() {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Author Dashboard</h2>
      <div className="author-profile">
        <ul className="d-flex justify-content-center list-unstyled fs-5 mb-4 gap-4">
          <li className="nav-item">
            <NavLink
              to="articles"
              className={({ isActive }) =>
                isActive ? "nav-link active d-flex align-items-center" : "nav-link d-flex align-items-center"
              }
            >
              <BookOpen size={18} className="me-2" /> My Articles
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="article"
              className={({ isActive }) =>
                isActive ? "nav-link active d-flex align-items-center" : "nav-link d-flex align-items-center"
              }
            >
              <PlusCircle size={18} className="me-2" /> Write New Article
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthorProfile

