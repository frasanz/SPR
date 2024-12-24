// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { getUserStatus } from "./utils/auth"; // Helper function to fetch user data

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to provide user data globally
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // For storing user data
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    // Fetch user data when the app loads
    getUserStatus()
      .then((data) => {
        setUser(data); // Update user state
        setLoading(false); // Stop loading
      })
      .catch(() => {
        setUser(null); // Set user as null if not authenticated
        setLoading(false); // Stop loading
      });
  }, []);

  // Provide user and loading state to children components
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
