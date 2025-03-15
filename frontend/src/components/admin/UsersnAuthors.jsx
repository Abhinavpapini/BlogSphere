import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const UsersnAuthors = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    const userId = currentUser ? currentUser._id : null;
    console.log(userId);

    axios
      .get(`${BACKEND_URL}/user-api/users`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      })
      .then((response) => {
        setUsers(response.data.payload);
      })
      .catch((error) => {
        console.error(error);
        showToast("Failed to load users", "error");
      });
  }, []);

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
        `${BACKEND_URL}/admin-api/admin/block-unblock/${id}`,
        { blocked: !blocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: response.data.payload.blocked } : user
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      showToast("Failed to update user status", "error");
    }
  };

  // Toast component
  const Toast = ({ message, type }) => {
    return (
      <div
        className={`position-fixed top-0 end-0 m-3 p-3 rounded shadow-lg ${
          type === "error" ? "bg-danger text-white" : "bg-success text-white"
        }`}
      >
        <p className="mb-0">{message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-indigo-400 text-center sm:text-left">Admin Dashboard</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="table table-dark table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col" className="d-none d-md-table-cell">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div>{user.firstName} {user.lastName}</div>
                      <div className="d-md-none text-muted">{user.email}</div>
                    </td>
                    <td className="d-none d-md-table-cell">{user.email}</td>
                    <td>
                      <span className={`badge ${
                        user.role === "admin" ? "bg-primary" : 
                        user.role === "author" ? "bg-info" : "bg-secondary"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.blocked ? "bg-danger" : "bg-success"
                      }`}>
                        {user.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleBlockStatus(user._id, user.blocked)}
                        className={`btn btn-sm ${
                          user.blocked ? "btn-success" : "btn-danger"
                        }`}
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