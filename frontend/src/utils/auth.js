// src/utils/auth.js
export const getUserStatus = async () => {
    const response = await fetch("http://localhost:8000/api/auth/user/", {
      credentials: "include", // Include cookies for session authentication
    });
  
    if (response.ok) {
      return await response.json(); // User is authenticated
    } else {
      throw new Error("User is not authenticated");
    }
  };
  