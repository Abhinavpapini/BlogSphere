import { useParams, NavLink, Outlet } from "react-router-dom";
import { Users, ChevronRight } from "lucide-react";

function AdminProfile() {
  const { email } = useParams();

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      
      <div className="d-flex align-items-center mb-3">
        <div className="fs-5 text-muted">
          <NavLink to="/" className="text-decoration-none">Home</NavLink>
          <ChevronRight size={16} className="mx-1" />
          <span>Admin ({email})</span>
        </div>
      </div>
      
      <div className="admin-profile mb-4">
        <ul className="d-flex justify-content-center list-unstyled fs-5 mb-4 gap-4">
          <li className="nav-item">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                isActive 
                  ? "nav-link active d-flex align-items-center" 
                  : "nav-link d-flex align-items-center"
              }
            >
              <Users size={18} className="me-2" /> Manage Users
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminProfile;