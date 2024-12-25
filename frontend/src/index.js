// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Use react-dom/client for React 18+
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext"; // Import the AuthProvider

const root = ReactDOM.createRoot(document.getElementById("root")); // Updated for React 18+

root.render(
  <React.StrictMode>
    <AuthProvider>

      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

