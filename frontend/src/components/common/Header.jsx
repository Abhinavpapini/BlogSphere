"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo4.avif"
import { useClerk, useUser } from "@clerk/clerk-react"
import { userAuthorContextObj } from "../../contexts/UserAuthorContext"
import { LogOut, User, BookOpen, Settings } from "lucide-react"

const Header = () => {
  const { signOut } = useClerk()
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()

  const handleSignOut = async () => {
    try {
      await signOut()
      setCurrentUser(null)
      localStorage.clear()
      navigate("/")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <header>
      <nav className="header d-flex justify-content-between align-items-center py-3 px-4">
        <div className="d-flex align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img src={logo || "/placeholder.svg"} alt="BlogSphere Logo" width="60px" className="me-3" />
            <h1 className="m-0 header-title">BlogSphere</h1>
          </Link>
        </div>
        <ul className="d-flex align-items-center list-unstyled m-0">
          {!isSignedIn ? (
            <>
              <li className="me-3">
                <Link to="signin" className="link btn btn-outline-primary">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="signup" className="link btn btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <div className="d-flex align-items-center">
              <div className="user-button d-flex align-items-center me-3">
                <div className="position-relative me-2">
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    width="45px"
                    height="45px"
                    className="rounded-circle border border-2 border-white"
                    alt={user.firstName}
                  />
                  <span className="role position-absolute top-0 end-0">{currentUser.role}</span>
                </div>
                <p className="mb-0 user-name">{user.firstName}</p>
              </div>

              {currentUser.role === "author" && (
                <Link to={`/author-profile/${currentUser.email}`} className="btn btn-sm btn-outline-light me-2">
                  <BookOpen size={16} className="me-1" /> My Articles
                </Link>
              )}

              {currentUser.role === "admin" && (
                <Link to={`/admin-profile/${currentUser.email}`} className="btn btn-sm btn-outline-light me-2">
                  <Settings size={16} className="me-1" /> Admin Panel
                </Link>
              )}

              {currentUser.role === "user" && (
                <Link to={`/user-profile/${currentUser.email}`} className="btn btn-sm btn-outline-light me-2">
                  <User size={16} className="me-1" /> My Profile
                </Link>
              )}

              <button onClick={handleSignOut} className="signout-btn d-flex align-items-center">
                <LogOut size={16} className="me-1" /> Sign Out
              </button>
            </div>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

