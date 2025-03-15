import { NavLink, Outlet } from "react-router-dom"
import { BookOpen, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"

function AuthorProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser) {
      setUserStatus(currentUser.blocked);
    }
  }, []);

  if (userStatus === null) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="author-profile-container">
      {userStatus ? (
        <div className="blocked-message">
          Your account is blocked. Please contact the admin.
        </div>
      ) : (
    <>
    <div className="container">
      <h2 className="text-center">Author Dashboard</h2>
      <div className="author-profile">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="articles"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <BookOpen size={18} className="icon" /> My Articles
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="article"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <PlusCircle size={18} className="icon" /> Write New Article
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
    </>)
}
    </div>
  );
}

export default AuthorProfile

// Add the CSS styles directly within the JSX file
const styles = `
.author-profile-container {
  background-color: #1a202c;
  min-height: 100vh;
  color: #e2e8f0;
  padding: 24px;
}

.loading {
  text-align: center;
  color: #a0aec0;
  font-size: 1.25rem;
}

.blocked-message {
  text-align: center;
  color: #f56565;
  font-size: 1.5rem;
  font-weight: 600;
}

.container {
  padding: 16px;
}

.text-center {
  text-align: center;
  margin-bottom: 16px;
}

.author-profile .nav-list {
  display: flex;
  justify-content: center;
  list-style: none;
  font-size: 1.25rem;
  margin-bottom: 16px;
  gap: 16px;
}

.nav-item .nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #e2e8f0;
}

.nav-item .nav-link.active {
  font-weight: bold;
}

.icon {
  margin-right: 8px;
}

.outlet-container {
  margin-top: 16px;
}
`;

// Inject the styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

