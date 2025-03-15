import { Link, Outlet } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { useEffect, useState } from "react"

function UserProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser) {
      setUserStatus(currentUser.blocked);
    }
  }, []);

  if (userStatus === null) {
    return <div className="text-center text-gray-300 text-xl">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-6">
    {userStatus ? (
        <div className="text-center text-red-400 text-2xl font-semibold">Your account is blocked. Please contact the admin.</div>
    ) : (
    <>
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
    </>
  )
}
</div>
  )
}

export default UserProfile

