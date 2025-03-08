"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const { getToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        // Fetch admin profile
        const profileRes = await axios.get("http://localhost:3000/admin-api/profile", config)
        setAdmin(profileRes.data)

        // Fetch users
        const usersRes = await axios.get("http://localhost:3000/admin-api/users", config)
        setUsers(usersRes.data)
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data")
      }
    }

    fetchData()
  }, [getToken])

  const handleBlockUnblock = async (userId, blocked) => {
    try {
      const token = await getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.put(
        `http://localhost:3000/admin-api/block-unblock/${userId}`,
        { blocked },
        config
      )
      setUsers(users.map((user) => (user._id === userId ? response.data.payload : user)))
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user status")
    }
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>
  }

  return (
    <div className="container">
      {admin && (
        <div className="text-center my-4">
          <h1>Admin Profile</h1>
          <p>Name: {admin.firstName} {admin.lastName}</p>
          <p>Email: {admin.email}</p>
        </div>
      )}
      <h2 className="text-center my-4">Users</h2>
      <ul className="list-group">
        {Array.isArray(users) &&
          users.map((user) => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
              {user.firstName} {user.lastName} ({user.email}) - {user.role}
              <button 
                onClick={() => handleBlockUnblock(user._id, !user.blocked)} 
                className={`btn btn-sm ${user.blocked ? 'btn-success' : 'btn-warning'}`}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default AdminProfile

