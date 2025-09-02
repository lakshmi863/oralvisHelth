import axios from "axios";

// ✅ Base URL from .env (fallback to Render backend if not set)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://oralvishelth-backend-demo.onrender.com/api",
});

// ✅ Attach token automatically for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
