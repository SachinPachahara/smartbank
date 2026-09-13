// Central API base configuration for SmartBank Frontend
// Priority:
// 1. VITE_API_URL environment variable (from Vercel / .env)
// 2. Localhost detection (defaults to http://localhost:5000/api)
// 3. Fallback production Render URL

const getApiBaseUrl = () => {
  const envUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL) ||
    "";

  if (envUrl && envUrl.trim() !== "") {
    let cleanUrl = envUrl.trim();
    if (cleanUrl.endsWith("/")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    return cleanUrl;
  }

  // Local development fallback
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return "http://localhost:5000/api";
  }

  // Production fallback if env variable is not explicitly provided
  return "https://smartbank-backend.onrender.com/api";
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users/`,
  ADMINS: `${API_BASE_URL}/admins/`,
  ACCOUNT: `${API_BASE_URL}/account/`,
  REQUEST: `${API_BASE_URL}/request/`,
};

export default API_ENDPOINTS;
