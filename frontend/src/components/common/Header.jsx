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
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo || "/placeholder.svg"} 
              alt="BlogSphere Logo" 
              className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" 
              width="48" height="48"
            />
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-neon-primary to-neon-secondary bg-clip-text text-transparent">
              BlogSphere
            </h1>
          </Link>
        </div>
        
        <ul className="flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <li>
                <Link to="signin" className="btn btn-outline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    className="w-10 h-10 rounded-full border-2 border-neon-primary/50"
                    alt={user.firstName}
                    width="40" height="40"
                  />
                  <span className="role-badge">
                    {currentUser.role}
                  </span>
                </div>
                <span className="text-gray-100 font-medium">{user.firstName}</span>
              </div>

              {currentUser.role === "author" && (
                <Link 
                  to={`/author-profile/${currentUser.email}`} 
                  className="btn btn-outline"
                >
                  <BookOpen size={16} className="mr-1.5" /> My Articles
                </Link>
              )}

              {currentUser.role === "admin" && (
                <Link 
                  to={`/admin-profile/${currentUser.email}`} 
                  className="btn btn-outline"
                >
                  <Settings size={16} className="mr-1.5" /> Admin Panel
                </Link>
              )}

              {currentUser.role === "user" && (
                <Link 
                  to={`/user-profile/${currentUser.email}`} 
                  className="btn btn-outline"
                >
                  <User size={16} className="mr-1.5" /> My Profile
                </Link>
              )}

              <button onClick={handleSignOut} className="btn btn-danger">
                <LogOut size={16} className="mr-1.5" /> Sign Out
              </button>
            </div>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

