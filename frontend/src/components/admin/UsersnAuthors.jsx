import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const UsersnAuthors = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { getToken, userId } = useAuth();
  const BACKEND_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const token = await getToken();
        console.log("Got token:", token ? "Token exists" : "No token");
        
        const response = await axios.get(`${BACKEND_URL}/admin-api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        console.log("API Response:", response.data);
        
        // If response.data is the array directly
        if (Array.isArray(response.data)) {
          console.log("Setting users array:", response.data.length, "users found");
          setUsers(response.data);
        } 
        // If response.data contains the array in a property
        else if (Array.isArray(response.data.users) || Array.isArray(response.data.payload)) {
          const usersArray = response.data.users || response.data.payload;
          console.log("Setting users from payload:", usersArray.length, "users found");
          setUsers(usersArray);
        } else {
          console.error("Unexpected response format:", response.data);
          showToast("Invalid data format received", "error");
        }
      } catch (error) {
        console.error("Full error object:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        showToast(error.response?.data?.message || "Failed to load users", "error");
      }
    };

    if (getToken) {
      fetchUsers();
    }
  }, [getToken]);

  // Toast helper function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const toggleBlockStatus = async (id, blocked) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `${BACKEND_URL}/admin-api/block-unblock/${id}`,
        { blocked: !blocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        showToast(response.data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, blocked: response.data.payload.blocked } : user
          )
        );
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      showToast("Failed to update user status", "error");
    }
  };

  // Toast component
  const Toast = ({ message, type }) => {
    return (
      <div
        className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
          toast.show ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${
          type === "error"
            ? "bg-red-700 text-red-100"
            : "bg-green-700 text-green-100"
        }`}
      >
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-indigo-400 text-center sm:text-left">Admin Dashboard</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-300 uppercase tracking-wider">Name</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-300 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-300 uppercase tracking-wider">Role</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <div className="font-medium text-gray-100">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-400 md:hidden mt-1">{user.email}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{user.email}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin" ? "bg-purple-900 text-purple-200" : 
                        user.role === "author" ? "bg-blue-900 text-blue-200" : "bg-gray-600 text-gray-200"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.blocked ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200"
                      }`}>
                        {user.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <button
                        onClick={() => toggleBlockStatus(user._id, user.blocked)}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${
                          user.blocked
                            ? "bg-green-700 hover:bg-green-600 text-green-100"
                            : "bg-red-700 hover:bg-red-600 text-red-100"
                        } transition-colors`}
                      >
                        {user.blocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
};

export default UsersnAuthors; 