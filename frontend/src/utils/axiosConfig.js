import axios from "axios";

// Set default configuration for Axios
axios.defaults.baseURL = "https://speech-record.com:543/api"; // Django API base URL
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

// Function to retrieve CSRF token
const getCSRFToken = () => {
  // First, try to get the token from the meta tag
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) return csrfMeta.getAttribute('content');

  // Fallback: Try to get it from cookies
  const cookies = document.cookie.split("; ");
  const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrftoken="));
  return csrfCookie ? csrfCookie.split("=")[1] : null;
};

// Add CSRF token to request headers
axios.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  console.log("CSRF Token:", csrfToken); // Debugging purpose
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export default axios;
