const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;;

export const ENDPOINTS = {
  ADMIN: {
    PROFILE: `${API_BASE_URL}/admin-api/profile`,
    USERS: `${API_BASE_URL}/admin-api/users`,
    BLOCK_UNBLOCK: (userId) => `${API_BASE_URL}/admin-api/block-unblock/${userId}`,
  }
};