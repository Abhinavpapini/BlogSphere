"use client"

import { useContext, useEffect, useState } from "react"
import { userAuthorContextObj } from "../../contexts/UserAuthorContext"
import { useUser } from "@clerk/clerk-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BookOpen, User, Settings } from "lucide-react"

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  async function onSelectRole(e) {
    setError("")
    setIsLoading(true)
    const selectedRole = e.target.value

    try {
      let res = null
      const userData = {
        ...currentUser,
        role: selectedRole,
      }

      if (selectedRole === "author") {
        res = await axios.post(`${BACKEND_URL}/author-api/author`, userData)
      } else if (selectedRole === "user") {
        res = await axios.post(`${BACKEND_URL}/user-api/user`, userData)
      } else if (selectedRole === "admin") {
        res = await axios.post(`${BACKEND_URL}/admin-api/admin`, userData)
      }

      if (res && res.data) {
        const { message, payload } = res.data
        if (message === selectedRole) {
          setCurrentUser({ ...userData, ...payload })
          localStorage.setItem("currentuser", JSON.stringify(payload))
        } else {
          setError(message)
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn === true && isLoaded) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      })
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`)
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`)
    }
    if (currentUser?.role === "admin" && error.length === 0) {
      navigate(`/admin-profile/${currentUser.email}`)
    }
  }, [currentUser])

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto text-center mb-5">
          <h1 className="display-4 mb-3">Welcome to BlogSphere</h1>
          <p className="lead">A platform for writers and readers to connect through meaningful content</p>
        </div>
      </div>

      {!isSignedIn ? (
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <div className="row">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <h2 className="mb-4">For Readers</h2>
                    <p className="mb-4">
                      Discover insightful articles on programming, AI, databases, and more. Join our community to engage
                      with authors and share your thoughts.
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <User className="text-primary me-3" size={24} />
                      <p className="mb-0">Create a personalized reading experience</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <BookOpen className="text-primary me-3" size={24} />
                      <p className="mb-0">Comment on articles and engage with authors</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h2 className="mb-4">For Writers</h2>
                    <p className="mb-4">
                      Share your knowledge and expertise with our growing community. Create, edit, and manage your
                      articles with our intuitive tools.
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <BookOpen className="text-primary me-3" size={24} />
                      <p className="mb-0">Publish articles on your favorite tech topics</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <Settings className="text-primary me-3" size={24} />
                      <p className="mb-0">Track engagement and manage your content</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-center align-items-center mb-4 p-3 bg-light rounded">
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    width="100px"
                    height="100px"
                    className="rounded-circle border border-3 border-white shadow-sm me-4"
                    alt={user.firstName}
                  />
                  <div>
                    <h2 className="mb-1">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-muted mb-0">{user.emailAddresses[0].emailAddress}</p>
                  </div>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <div className="text-center mb-4">
                  <h3>Select your role</h3>
                  <p className="text-muted">Choose how you want to use BlogSphere</p>
                </div>

                <div className="role-radio py-4 d-flex justify-content-center flex-wrap gap-3">
                  <div className="form-check role-option p-3 border rounded">
                    <input
                      type="radio"
                      name="role"
                      id="author"
                      value="author"
                      className="form-check-input"
                      onChange={onSelectRole}
                      disabled={isLoading}
                    />
                    <label htmlFor="author" className="form-check-label ms-2">
                      <strong>Author</strong> - Write and publish articles
                    </label>
                  </div>

                  <div className="form-check role-option p-3 border rounded">
                    <input
                      type="radio"
                      name="role"
                      id="user"
                      value="user"
                      className="form-check-input"
                      onChange={onSelectRole}
                      disabled={isLoading}
                    />
                    <label htmlFor="user" className="form-check-label ms-2">
                      <strong>Reader</strong> - Read and comment on articles
                    </label>
                  </div>

                  <div className="form-check role-option p-3 border rounded">
                    <input
                      type="radio"
                      name="role"
                      id="admin"
                      value="admin"
                      className="form-check-input"
                      onChange={onSelectRole}
                      disabled={isLoading}
                    />
                    <label htmlFor="admin" className="form-check-label ms-2">
                      <strong>Admin</strong> - Manage the platform
                    </label>
                  </div>
                </div>

                {isLoading && (
                  <div className="text-center mt-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Setting up your account...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

