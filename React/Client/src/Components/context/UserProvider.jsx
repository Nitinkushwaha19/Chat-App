// UserContext.js
import React, { createContext, useState, useEffect } from "react";

// Create a UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when the app initializes
  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed User:", parsedUser); // Debug log
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // Function to log the user in
  const loginUser = (userData) => {
    localStorage.setItem("USER", JSON.stringify(userData));
    setUser(userData);
  };

  // Function to log the user out
  const logoutUser = () => {
    localStorage.removeItem("USER");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading  }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
