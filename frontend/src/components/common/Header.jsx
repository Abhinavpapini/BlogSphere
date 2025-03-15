"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo4.png"
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
    <header className="bg-dark-surface border-b border-neon-primary/20">
      <nav className="container mx-auto px-4 py-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to="/" className="d-flex align-items-center">
            <img 
              src={logo || "/placeholder.svg"} 
              alt="BlogSphere Logo" 
              className="w-12 h-12 transition-transform duration-300" 
              width="48" height="48"
            />
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-neon-primary to-neon-secondary bg-clip-text text-transparent">
              BlogSphere
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link to="signin" className="btn btn-outline btn-danger text-gray-300 hover:text-white px-3">
                Sign In
              </Link>
              <Link to="#" className="btn btn-outline text-gray-300 hover:text-white px-3">
                
              </Link>
              <Link to="signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <img
                  src={user.imageUrl || "/placeholder.svg"}
                  className="rounded-circle border-2 border-light"
                  alt={user.firstName}
                  width="40" height="40"
                />
                <div className="d-flex flex-column ms-2">
                  <small className="text-light opacity-75 mb-0" style={{ fontSize: '0.75rem', lineHeight: 1 }}>{currentUser.role}</small>
                  <span className="text-light">{user.firstName}</span>
                </div>
              </div>

              {currentUser.role === "author" && (
                <Link 
                  to={`/author-profile/${currentUser.email}`} 
                  className="btn btn-outline text-white border"
                >
                  <BookOpen size={16} className="me-2 text-white" /> My Articles
                </Link>
              )}

              {currentUser.role === "admin" && (
                <Link 
                  to={`/admin-profile/${currentUser.email}`} 
                  className="btn btn-outline"
                >
                  <Settings size={16} className="me-2" /> Admin Panel
                </Link>
              )}

              {currentUser.role === "user" && (
                <Link 
                  to={`/user-profile/${currentUser.email}`} 
                  className="btn btn-outline"
                >
                  <User size={16} className="me-2" /> My Profile
                </Link>
              )}

              <button onClick={handleSignOut} className="btn btn-danger">
                <LogOut size={16} className="me-2" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header