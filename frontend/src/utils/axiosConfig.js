import axios from "axios";

// Set default configuration for Axios
axios.defaults.baseURL = "http://localhost:8000/api"; // Your Django backend API base URL
axios.defaults.withCredentials = true; // Include cookies in requests for CSRF token

// Optional: Function to get CSRF token from cookies
const getCSRFToken = () => {
  const cookies = document.cookie.split("; ");
  const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrftoken="));
  return csrfCookie ? csrfCookie.split("=")[1] : null;
};

// Add the CSRF token to request headers automatically
axios.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export default axios;
