import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Users, RefreshCw, Check, X, AlertCircle } from "lucide-react";
import { ENDPOINTS } from "../../config/api";

function AdminDashboard() {
  const [authors, setAuthors] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [loading, setLoading] = useState({
    authors: true,
    users: true
  });
  const [error, setError] = useState({
    authors: "",
    users: ""
  });
  const { getToken } = useAuth();

  // Function to fetch all users from the admin API
  async function fetchUsers() {
    setLoading({ authors: true, users: true });
    setError({ authors: "", users: "" });

    try {
      const token = await getToken();
      
      console.log("Fetching users with token:", token ? "Valid token" : "No token");
      
      const response = await axios.get(ENDPOINTS.ADMIN.USERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter users based on role
      const authorsArr = response.data.filter(user => user.role === "author");
      const usersArr = response.data.filter(user => user.role === "user");

      console.log(`Found ${authorsArr.length} authors and ${usersArr.length} regular users`);
      
      setAuthors(authorsArr);
      setRegularUsers(usersArr);
      
    } catch (err) {
      console.error("Error fetching users:", err);
      setError({
        authors: "Failed to load authors. Please check your connection and try again.",
        users: "Failed to load users. Please check your connection and try again."
      });
    } finally {
      setLoading({ authors: false, users: false });
    }
  }

  // Function to block or unblock a user
  async function toggleBlockUser(userId, currentStatus) {
    try {
      const token = await getToken();
      
      const response = await axios.put(
        ENDPOINTS.ADMIN.BLOCK_UNBLOCK(userId),
        { blocked: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message.includes("blocked") || response.data.message.includes("unblocked")) {
        // Update the user's blocked status in our state
        setAuthors(authors.map(author => 
          author._id === userId ? { ...author, blocked: !currentStatus } : author
        ));
        
        setRegularUsers(regularUsers.map(user => 
          user._id === userId ? { ...user, blocked: !currentStatus } : user
        ));
      }
    } catch (err) {
      console.error("Error toggling user block status:", err);
      setError({
        ...error,
        users: "Failed to update user status. Please try again."
      });
    }
  }

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to render a user table
  const renderUserTable = (users, roleType) => {
    if (loading[roleType === "author" ? "authors" : "users"]) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error[roleType === "author" ? "authors" : "users"]) {
      return (
        <div className="alert alert-danger">
          <AlertCircle size={18} className="me-2" />
          {error[roleType === "author" ? "authors" : "users"]}
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center p-5 bg-light rounded">
          <p className="mb-0 fs-4">No {roleType}s found</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  {user.blocked ? (
                    <span className="badge bg-danger">Blocked</span>
                  ) : (
                    <span className="badge bg-success">Active</span>
                  )}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${user.blocked ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleBlockUser(user._id, user.blocked)}
                  >
                    {user.blocked ? (
                      <>
                        <Check size={16} className="me-1" /> Unblock
                      </>
                    ) : (
                      <>
                        <X size={16} className="me-1" /> Block
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={fetchUsers}
        >
          <RefreshCw size={16} className="me-2" /> Refresh Data
        </button>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-gradient d-flex justify-content-between align-items-center">
              <h3 className="m-0" style={{ color: "var(--royal-blue)" }}>
                <Users size={20} className="me-2" /> Authors <span className="badge bg-primary ms-2">{authors.length}</span>
              </h3>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={fetchUsers}
              >
                <RefreshCw size={14} /> Refresh Data
              </button>
            </div>
            <div className="card-body">
              {renderUserTable(authors, "author")}
            </div>
          </div>
        </div>
        
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-gradient d-flex justify-content-between align-items-center">
              <h3 className="m-0" style={{ color: "var(--royal-blue)" }}>
                <Users size={20} className="me-2" /> Regular Users <span className="badge bg-primary ms-2">{regularUsers.length}</span>
              </h3>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={fetchUsers}
              >
                <RefreshCw size={14} /> Refresh Data
              </button>
            </div>
            <div className="card-body">
              {renderUserTable(regularUsers, "user")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;