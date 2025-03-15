"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { ENDPOINTS } from "../../config/api"

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const { getToken, userId, sessionId, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      console.log("Starting data fetch...");
      try {
        setLoading(true)
        console.log("Current user object:", user);
        
        const token = await getToken();
        console.log("Got token:", token ? "Token received" : "No token");

        const email = user?.emailAddresses?.[0]?.emailAddress;
        console.log("User email:", email);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        // Fetch admin profile
        console.log("Fetching admin profile...");
        const profileRes = await axios.get(ENDPOINTS.ADMIN.PROFILE, config);
        console.log("Admin profile response:", profileRes.data);
        setAdmin(profileRes.data);

        // Fetch users
        console.log("Fetching users...");
        const usersRes = await axios.get(ENDPOINTS.ADMIN.USERS, config);
        console.log("Users response:", usersRes.data);
        setUsers(usersRes.data);
        
        console.log("Data fetch completed successfully");
      } catch (error) {
        console.error("Detailed error information:", error);
        let errorMessage = "Failed to fetch data";
        if (error.response?.status === 400) {
          errorMessage = error.response.data.message || "Bad request - please check your login status";
        } else if (error.response?.status === 401) {
          errorMessage = "Unauthorized - please log in again";
        } else if (error.response?.status === 404) {
          errorMessage = "Admin not found - please ensure you have admin privileges";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [getToken, userId, sessionId, user])

  const handleBlockUnblock = async (userId, blocked) => {
    try {
      const token = await getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.put(
        ENDPOINTS.ADMIN.BLOCK_UNBLOCK(userId),
        { blocked },
        config
      )
      setUsers(users.map((user) => (user._id === userId ? response.data.payload : user)))
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user status")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const authors = users.filter(user => user.role === 'author');
  const regularUsers = users.filter(user => user.role === 'user');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Admin Profile Section */}
        {admin && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 border-b pb-4">Admin Dashboard</h1>
            <div className="flex items-center justify-center space-x-4">
              {admin.profileImageUrl && (
                <img 
                  src={admin.profileImageUrl} 
                  alt={`${admin.firstName} ${admin.lastName}`}
                  className="w-24 h-24 rounded-full border-4 border-blue-600 shadow-md"
                />
              )}
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="text-gray-700 font-medium">{admin.email}</p>
                <p className="text-blue-700 font-semibold">Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Authors Section */}
        <div className="border border-gray-200  shadow-lg rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-4">
            Authors
            <span className="ml-2 bg-blue-200 text-blue-900 text-sm font-bold px-3 py-1 rounded">
              {authors.length}
            </span>
          </h2>
          {authors.length === 0 ? (
            <p className="text-center text-gray-700 font-medium py-4">No authors found</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {authors.map((author) => (
                <div key={author._id} 
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all border border-gray-200">
                  <div className="flex items-center space-x-4">
                    {author.profileImageUrl && (
                      <img 
                        src={author.profileImageUrl} 
                        alt={`${author.firstName} ${author.lastName}`}
                        className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-sm"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {author.firstName} {author.lastName}
                      </p>
                      <p className="text-gray-700 font-medium">{author.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBlockUnblock(author._id, !author.blocked)}
                    className={`px-5 py-2.5 rounded-md text-white font-bold shadow-sm transition-colors ${
                      author.blocked 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {author.blocked ? "Unblock" : "Block"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Users Section */}
        <div className="border border-gray-200 shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-4">
            Regular Users
            <span className="ml-2 bg-blue-200 text-blue-900 text-sm font-bold px-3 py-1 rounded">
              {regularUsers.length}
            </span>
          </h2>
          {regularUsers.length === 0 ? (
            <p className="text-center text-gray-700 font-medium py-4">No users found</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {regularUsers.map((user) => (
                <div key={user._id} 
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all border border-gray-200">
                  <div className="flex items-center space-x-4">
                    {user.profileImageUrl && (
                      <img 
                        src={user.profileImageUrl} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-sm"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-700 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBlockUnblock(user._id, !user.blocked)}
                    className={`px-5 py-2.5 rounded-md text-white font-bold shadow-sm transition-colors ${
                      user.blocked 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProfile

