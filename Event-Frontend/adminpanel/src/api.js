import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // ✅ your backend URL
});

// attach token automatically and restrict to ADMIN
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("jwtToken");
  if (stored) {
    try {
      const { token, role } = JSON.parse(stored);
      if (role !== "ADMIN") {
        throw new Error("Access denied: only ADMIN can access this API.");
      }
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error(err.message);
      // Optionally, redirect to login page
      window.location.href = "/login";
    }
  } else {
    // No token found
    window.location.href = "/login";
  }
  return config;
});

export default API;
