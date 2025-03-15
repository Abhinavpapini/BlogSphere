import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../config/api";
import { Loader2 } from "lucide-react";

function AdminLayout() {
  const { isSignedIn, getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const response = await axios.get(ENDPOINTS.ADMIN.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If we get a successful response, user is an admin
        if (response.status === 200) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    verifyAdmin();
  }, [isSignedIn, getToken]);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ms-2">Verifying admin privileges...</span>
      </div>
    );
  }

  // If not signed in or not an admin, redirect to login
  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/sign-in" replace />;
  }

  // If admin, render the outlet (child routes)
  return <Outlet />;
}

export default AdminLayout;